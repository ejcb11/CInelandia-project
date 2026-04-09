#!/bin/bash

# Script de inicio rápido para Pizza Planeta Backend
# Este script configura y ejecuta el servidor automáticamente

echo "🚀🍕 Iniciando Pizza Planeta Backend..."
echo ""

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar/actualizar dependencias
echo "📥 Instalando dependencias..."
pip install -q -r requirements.txt

# Generar códigos QR de ejemplo
echo "📱 Generando códigos QR de ejemplo..."
python qr_generator.py

echo ""
echo "✅ Configuración completa!"
echo ""
echo "================================"
echo "  Pizza Planeta API"
echo "================================"
echo ""
echo "🌐 Servidor: http://localhost:8000"
echo "📖 Documentación: http://localhost:8000/docs"
echo "📊 Health check: http://localhost:8000/health"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar servidor
python main.py
