"""
Schemas de Pydantic para validación de datos
Define los modelos de request/response de la API
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
import re


# ============= PIZZA SCHEMAS =============

class PizzaResponse(BaseModel):
    """Schema de respuesta para Pizza"""
    id: int
    name: str
    description: str
    price: float
    image: Optional[str] = None
    available: bool = True

    model_config = {
        "from_attributes": True
    }


# ============= ORDER SCHEMAS =============

class OrderItemCreate(BaseModel):
    """Schema para crear un item de pedido"""
    pizza_id: int
    quantity: int = Field(gt=0, description="La cantidad debe ser mayor a 0")


class OrderItemResponse(BaseModel):
    """Schema de respuesta para item de pedido"""
    id: int
    pizza_id: int
    quantity: int
    unit_price: float
    subtotal: float
    pizza: PizzaResponse

    model_config = {
        "from_attributes": True
    }


class OrderCreate(BaseModel):
    """Schema para crear un pedido"""
    customer_name: str = Field(min_length=2, max_length=100)
    customer_email: Optional[EmailStr] = None
    customer_phone: str = Field(min_length=7, max_length=20)
    delivery_address: str = Field(min_length=10)
    items: List[OrderItemCreate]

    @field_validator('customer_phone')
    @classmethod
    def validate_phone(cls, v):
        # Validar formato de teléfono (solo números, espacios, guiones, paréntesis)
        if not re.match(r'^[\d\s\-\(\)\+]+$', v):
            raise ValueError('El teléfono solo puede contener números, espacios, guiones, paréntesis y el símbolo +')
        return v


class OrderResponse(BaseModel):
    """Schema de respuesta para pedido"""
    id: int
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: str
    delivery_address: str
    total: float
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    model_config = {
        "from_attributes": True
    }


# ============= QR CODE SCHEMAS =============

class QRCodeRequest(BaseModel):
    """Schema para solicitar generación de código QR\"\"\""""
    data: str = Field(description="URL o texto para el código QR")
    size: Optional[int] = Field(default=300, ge=100, le=1000, description="Tamaño del código QR en píxeles")
    fill_color: Optional[str] = Field(default="black", description="Color del código QR")
    back_color: Optional[str] = Field(default="white", description="Color de fondo")


class QRCodeResponse(BaseModel):
    """Schema de respuesta para código QR"""
    data: str
    image_base64: str
    format: str = "png"