
## 🛠️ Instalación

### 1. Crear entorno virtual (recomendado)

```bash
cd backend
python -m venv venv



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


