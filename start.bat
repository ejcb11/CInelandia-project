@echo off
REM Script de inicio rápido para Pizza Planeta Backend (Windows)

echo 🚀🍕 Iniciando Pizza Planeta Backend...
echo.

REM Verificar si existe el entorno virtual
if not exist "venv" (
    echo 📦 Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate

REM Instalar/actualizar dependencias
echo 📥 Instalando dependencias...
pip install -q -r requirements.txt

REM Generar códigos QR de ejemplo
echo 📱 Generando códigos QR de ejemplo...
python qr_generator.py

echo.
echo ✅ Configuración completa!
echo.
echo ================================
echo   Pizza Planeta API
echo ================================
echo.
echo 🌐 Servidor: http://localhost:8000
echo 📖 Documentación: http://localhost:8000/docs
echo 📊 Health check: http://localhost:8000/health
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Ejecutar servidor
python main.py

pause
