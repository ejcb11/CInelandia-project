"""
Configuración de la base de datos SQLite con SQLAlchemy
"""

import sqlalchemy
from sqlalchemy.orm import sessionmaker

# URL de conexión a SQLite (archivo local)
SQLALCHEMY_DATABASE_URL = "sqlite:///./pizza_planeta.db"

# Crear engine de SQLAlchemy
engine = sqlalchemy.create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necesario para SQLite
)

# Crear SessionLocal para manejar sesiones de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = sqlalchemy.orm.declarative_base()


def get_db():
    """
    Dependency para obtener una sesión de base de datos
    Se usa con FastAPI Depends()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
