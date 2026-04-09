"""
Datos iniciales de pizzas para poblar la base de datos
"""

from typing import List, Dict, Any

PIZZAS_DATA: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Galaxia Suprema",
        "description": "Pepperoni cósmico, champiñones estelares, pimientos y queso nebulosa",
        "price": 20.00,
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    },
    {
        "id": 2,
        "name": "Meteorito Picante",
        "description": "Jalapeños ardientes, carne picada espacial, cebolla y salsa de fuego",
        "price": 16.99,
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    },
    {
        "id": 3,
        "name": "Vegetal Lunar",
        "description": "Espinacas, brócoli cósmico, tomates cherry y aceitunas negras",
        "price": 15.99,
        "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    },
    {
        "id": 4,
        "name": "Queso Saturno",
        "description": "Cuatro quesos galácticos: mozzarella, gorgonzola, parmesano y provolone",
        "price": 17.99,
        "image": "https://images.unsplash.com/photo-1593504049359-74330189a345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    },
    {
        "id": 5,
        "name": "Hawaiana Orbital",
        "description": "Jamón espacial, piña tropical y queso fundido",
        "price": 16.49,
        "image": "https://images.unsplash.com/photo-1613564834361-9436948817d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    },
    {
        "id": 6,
        "name": "Pepperoni Estelar",
        "description": "Doble pepperoni de la constelación más sabrosa del universo",
        "price": 14.99,
        "image": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        "available": True
    }
]