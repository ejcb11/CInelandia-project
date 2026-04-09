"""
Modelos de base de datos usando SQLAlchemy
Define las tablas: Pizza, Order, OrderItem
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text # type: ignore
from sqlalchemy.orm import relationship # type: ignore
from datetime import datetime
from database import Base


class Pizza(Base):
    """Modelo de Pizza"""
    __tablename__ = "pizzas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String(500), nullable=True)
    available = Column(Boolean, default=True)

# Relación con order_items
    order_items = relationship("OrderItem", back_populates="pizza")

    def __repr__(self):
        return f"<Pizza {self.name} - ${self.price}>"


class Order(Base):
    """Modelo de Pedido"""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=True)
    customer_phone = Column(String(20), nullable=False)
    delivery_address = Column(Text, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(20), default="pending")  # pending, preparing, on_delivery, delivered, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Relación con order_items
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Order #{self.id} - {self.customer_name} - ${self.total}>"


class OrderItem(Base):
    """Modelo de Item de Pedido (relación entre Order y Pizza)"""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    pizza_id = Column(Integer, ForeignKey("pizzas.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

# Relaciones
    order = relationship("Order", back_populates="items")
    pizza = relationship("Pizza", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem: {self.quantity}x Pizza#{self.pizza_id}>"
