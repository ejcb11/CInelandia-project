import requests
import sys

BASE_URL = "http://localhost:8000"

print("--- VERIFICADOR DE CONEXIÓN PIZZA PLANETA ---")

try:
    print(f"📡 Intentando conectar a: {BASE_URL}/health")
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    
    if response.status_code == 200:
        print("✅ ¡CONEXIÓN EXITOSA!")
        print(f"Respuesta del servidor: {response.json()}")
    else:
        print(f"⚠️ El servidor respondió, pero con error: {response.status_code}")

except requests.exceptions.ConnectionError:
    print("❌ ERROR: No se pudo conectar.")
    print("👉 Asegúrate de que el backend esté corriendo (ejecuta 'python main.py' en otra terminal).")
except Exception as e:
    print(f"❌ Ocurrió un error inesperado: {e}")

input("\nPresiona Enter para salir...")