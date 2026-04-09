# 🚀🍕 Pizza Planeta - Backend API

Backend API REST construido con FastAPI para el sistema de pedidos de Pizza Planeta.

## 📋 Características

- ✅ **API REST completa** con FastAPI
- ✅ **Base de datos SQLite** para almacenar pedidos y pizzas
- ✅ **Generación de códigos QR** dinámicos
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Validación de datos** con Pydantic
- ✅ **CORS habilitado** para el frontend React

## 🛠️ Instalación

### 1. Crear entorno virtual (recomendado)

```bash
cd backend
python -m venv venv

# En Linux/Mac:
source venv/bin/activate

# En Windows:
venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 🚀 Ejecutar el servidor

```bash
# Desde el directorio backend/
python main.py

# O usando uvicorn directamente:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 📖 Documentación API

Una vez que el servidor esté corriendo, visita:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 Endpoints Principales

### Pizzas

- `GET /api/pizzas` - Obtener todas las pizzas
- `GET /api/pizzas/{id}` - Obtener una pizza específica

### Pedidos

- `POST /api/orders` - Crear un nuevo pedido
- `GET /api/orders` - Obtener todos los pedidos
- `GET /api/orders/{id}` - Obtener un pedido específico
- `PATCH /api/orders/{id}/status` - Actualizar estado de pedido

### Códigos QR

- `POST /api/qr-code` - Generar un código QR

### Utilidad

- `GET /health` - Health check
- `GET /` - Información de la API

## 📦 Estructura del Proyecto

```
backend/
├── main.py              # Aplicación principal de FastAPI
├── models.py            # Modelos de base de datos (SQLAlchemy)
├── schemas.py           # Schemas de Pydantic para validación
├── database.py          # Configuración de base de datos
├── qr_generator.py      # Generador de códigos QR
├── requirements.txt     # Dependencias de Python
└── README.md           # Este archivo
```

## 🗄️ Base de Datos

El proyecto usa **SQLite** como base de datos. El archivo `pizza_planeta.db` se crea automáticamente al iniciar el servidor.

### Tablas:

1. **pizzas** - Catálogo de pizzas
2. **orders** - Pedidos de clientes
3. **order_items** - Items de cada pedido (relación many-to-many)

## 📝 Ejemplos de Uso

### Crear un pedido

```bash
curl -X POST "http://localhost:8000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Juan Pérez",
    "customer_email": "juan@example.com",
    "customer_phone": "+1234567890",
    "delivery_address": "Calle Galaxia 123, Ciudad Espacial",
    "items": [
      {"pizza_id": 1, "quantity": 2},
      {"pizza_id": 3, "quantity": 1}
    ]
  }'
```

### Generar código QR

```bash
curl -X POST "http://localhost:8000/api/qr-code" \
  -H "Content-Type: application/json" \
  -d '{
    "data": "https://instagram.com/pizzaplaneta",
    "size": 300,
    "fill_color": "#1e3a8a",
    "back_color": "white"
  }'
```

## 🔧 Configuración

### Variables de entorno (opcional)

Puedes crear un archivo `.env` para configuración adicional:

```env
DATABASE_URL=sqlite:///./pizza_planeta.db
API_HOST=0.0.0.0
API_PORT=8000
```

## 🚀 Mejoras Futuras

Ideas para mejorar el backend:

1. **Autenticación JWT** - Para panel de administración
2. **PostgreSQL** - Migrar de SQLite a PostgreSQL para producción
3. **Notificaciones Email** - Enviar confirmación de pedidos por email
4. **WhatsApp API** - Integración con WhatsApp Business
5. **Panel Admin** - Dashboard para gestionar pedidos
6. **Pagos Online** - Integración con Stripe/PayPal
7. **Websockets** - Para actualizaciones en tiempo real
8. **Tests** - Agregar tests unitarios y de integración
9. **Docker** - Containerizar la aplicación
10. **Analytics** - Sistema de reportes y estadísticas

## 📊 Scripts de Desarrollo

### Generar códigos QR de ejemplo

```bash
python qr_generator.py
```

Esto generará dos archivos:
- `qr_instagram.png`
- `qr_whatsapp.png`

## 🐛 Debug

Para activar modo debug y ver logs detallados:

```python
# En main.py, al final:
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

**¡Hecho con ❤️ y 🍕 para Pizza Planeta!**
