
"""
Pizza Planeta - Backend API
API REST para manejar el menú, pedidos y códigos QR
"""

import logging
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import engine, get_db, Base
from models import Pizza, Order, OrderItem
from schemas import (
    PizzaResponse,
    OrderCreate,
    OrderResponse,
    OrderItemCreate,
    QRCodeRequest,
    QRCodeResponse
)
from qr_generator import generate_qr_code
from config import settings
from initial_data import PIZZAS_DATA

# Configurar logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    debug=settings.debug
)

# Configurar CORS con configuración segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


@app.on_event("startup")
async def startup_event():
    """Inicializar la base de datos con pizzas si está vacía"""
    try:
        db = next(get_db())
        existing_pizzas = db.query(Pizza).count()

        if existing_pizzas == 0:
            # Agregar pizzas iniciales
            for pizza_data in PIZZAS_DATA:
                pizza = Pizza(**pizza_data)
                db.add(pizza)
            db.commit()
            logger.info(f"✅ Base de datos inicializada con {len(PIZZAS_DATA)} pizzas")
        else:
            logger.info(f"✅ Base de datos ya contiene {existing_pizzas} pizzas")
    except Exception as e:
        logger.error(f"❌ Error inicializando base de datos: {e}")
        raise


@app.get("/", tags=["General"])
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "🚀 Bienvenido a Pizza Planeta API",
        "version": settings.app_version,
        "docs": "/docs",
        "endpoints": {
            "pizzas": "/api/pizzas",
            "orders": "/api/orders",
            "qr_codes": "/api/qr-code"
        }
    }


@app.get("/api/pizzas", response_model=List[PizzaResponse], tags=["Pizzas"])
async def get_pizzas(db: Session = Depends(get_db)):
    """Obtener todas las pizzas disponibles"""
    try:
        pizzas = db.query(Pizza).filter(Pizza.available == True).all()
        logger.info(f"📋 Obtenidas {len(pizzas)} pizzas disponibles")
        return pizzas
    except Exception as e:
        logger.error(f"❌ Error obteniendo pizzas: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.get("/api/pizzas/{pizza_id}", response_model=PizzaResponse, tags=["Pizzas"])
async def get_pizza(pizza_id: int, db: Session = Depends(get_db)):
    """Obtener una pizza específica por ID"""
    try:
        pizza = db.query(Pizza).filter(Pizza.id == pizza_id).first()
        if not pizza:
            logger.warning(f"⚠️ Pizza con ID {pizza_id} no encontrada")
            raise HTTPException(status_code=404, detail="Pizza no encontrada")
        return pizza
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error obteniendo pizza {pizza_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.post("/api/orders", response_model=OrderResponse, tags=["Orders"])
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Crear un nuevo pedido"""
    try:
        # Validar que haya items en el pedido
        if not order_data.items or len(order_data.items) == 0:
            raise HTTPException(status_code=400, detail="El pedido debe contener al menos una pizza")

# Calcular el total del pedido
        total = 0.0
        for item in order_data.items:
            pizza = db.query(Pizza).filter(Pizza.id == item.pizza_id).first()
            if not pizza:
                raise HTTPException(status_code=404, detail=f"Pizza con ID {item.pizza_id} no encontrada")
            if not pizza.available:
                raise HTTPException(status_code=400, detail=f"Pizza {pizza.name} no está disponible")
            total += pizza.price * item.quantity

# Crear el pedido
        new_order = Order(
            customer_name=order_data.customer_name,
            customer_email=order_data.customer_email,
            customer_phone=order_data.customer_phone,
            delivery_address=order_data.delivery_address,
            total=total,
            status="pending",
            created_at=datetime.utcnow()
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

# Agregar items al pedido
        for item_data in order_data.items:
            pizza = db.query(Pizza).filter(Pizza.id == item_data.pizza_id).first()
            order_item = OrderItem(
                order_id=new_order.id,
                pizza_id=item_data.pizza_id,
                quantity=item_data.quantity,
                unit_price=pizza.price,
                subtotal=pizza.price * item_data.quantity
            )
            db.add(order_item)

        db.commit()
        db.refresh(new_order)

        logger.info(f"📦 Nuevo pedido #{new_order.id} creado - Total: ${total:.2f} - Cliente: {order_data.customer_name}")

        return new_order

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error creando pedido: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.get("/api/orders", response_model=List[OrderResponse], tags=["Orders"])
async def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los pedidos (con paginación)"""
    try:
        orders = db.query(Order).offset(skip).limit(limit).all()
        logger.info(f"📋 Obtenidos {len(orders)} pedidos (skip={skip}, limit={limit})")
        return orders
    except Exception as e:
        logger.error(f"❌ Error obteniendo pedidos: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.get("/api/orders/{order_id}", response_model=OrderResponse, tags=["Orders"])
async def get_order(order_id: int, db: Session = Depends(get_db)):
    """Obtener un pedido específico por ID"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            logger.warning(f"⚠️ Pedido con ID {order_id} no encontrado")
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error obteniendo pedido {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.patch("/api/orders/{order_id}/status", tags=["Orders"])
async def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Actualizar el estado de un pedido"""
    try:
        valid_statuses = ["pending", "preparing", "on_delivery", "delivered", "cancelled"]

        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"
            )

        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            logger.warning(f"⚠️ Pedido con ID {order_id} no encontrado para actualizar estado")
            raise HTTPException(status_code=404, detail="Pedido no encontrado")

        old_status = order.status
        order.status = status
        order.updated_at = datetime.utcnow()
        db.commit()

        logger.info(f"📝 Estado del pedido #{order_id} actualizado: {old_status} → {status}")

        return {"message": f"Estado del pedido #{order_id} actualizado a: {status}"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error actualizando estado del pedido {order_id}: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@app.post("/api/qr-code", response_model=QRCodeResponse, tags=["QR Codes"])
async def create_qr_code(request: QRCodeRequest):
    """Generar un código QR"""
    try:
        qr_image_base64 = generate_qr_code(
            data=request.data,
            size=request.size or 300,
            fill_color=request.fill_color or "black",
            back_color=request.back_color or "white"
        )

        logger.info(f"📱 Código QR generado para: {request.data[:50]}...")

        return QRCodeResponse(
            data=request.data,
            image_base64=qr_image_base64,
            format="png"
        )
    except Exception as e:
        logger.error(f"❌ Error generando código QR: {e}")
        raise HTTPException(status_code=500, detail=f"Error generando código QR: {str(e)}")


@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    logger.info(f"🚀 Iniciando {settings.app_name}")
    # Usar "main:app" en lugar de app directamente
    uvicorn.run(
        "main:app", 
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )