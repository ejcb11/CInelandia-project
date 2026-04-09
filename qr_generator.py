"""
Generador de códigos QR usando qrcode y Pillow
"""

import qrcode
import io
import base64
from typing import Optional


def generate_qr_code(
    data: str,
    size: int = 300,
    fill_color: str = "black",
    back_color: str = "white",
    error_correction: int = qrcode.constants.ERROR_CORRECT_H
) -> str:
    """
    Genera un código QR y lo devuelve como string base64

    Args:
        data: Texto o URL para codificar
        size: Tamaño del código QR en píxeles
        fill_color: Color del código QR
        back_color: Color de fondo
        error_correction: Nivel de corrección de errores (L, M, Q, H)

    Returns:
        String base64 de la imagen PNG del código QR
    """

# Crear instancia de QRCode
    qr = qrcode.QRCode(
        version=1,  # Tamaño del código QR (1-40)
        error_correction=error_correction,
        box_size=10,  # Tamaño de cada "caja" del QR
        border=4,  # Borde alrededor del código
    )

# Agregar datos
    qr.add_data(data)
    qr.make(fit=True)

# Crear imagen
    img = qr.make_image(fill_color=fill_color, back_color=back_color)

# Redimensionar si es necesario
    if size:
        img = img.resize((size, size))

# Convertir a bytes
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

# Convertir a base64
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return img_base64


def save_qr_code_to_file(data: str, filename: str, **kwargs) -> str:
    """
    Genera y guarda un código QR en un archivo

    Args:
        data: Texto o URL para codificar
        filename: Nombre del archivo de salida (debe terminar en .png)
        **kwargs: Argumentos adicionales para generate_qr_code

    Returns:
        Path del archivo guardado
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=kwargs.get('error_correction', qrcode.constants.ERROR_CORRECT_H),
        box_size=kwargs.get('box_size', 10),
        border=kwargs.get('border', 4),
    )

    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(
        fill_color=kwargs.get('fill_color', 'black'),
        back_color=kwargs.get('back_color', 'white')
    )

    img.save(filename)
    return filename


if __name__ == "__main__":
# Ejemplo de uso
    print("Generando códigos QR de ejemplo...")

# Instagram
    instagram_qr = save_qr_code_to_file(
        data="https://instagram.com/pizzaplaneta",
        filename="qr_instagram.png",
        fill_color="#1e3a8a"  # Azul oscuro
    )
    print(f"✅ QR de Instagram guardado en: {instagram_qr}")

# WhatsApp
    whatsapp_qr = save_qr_code_to_file(
        data="https://wa.me/15551234567?text=Hola%20Pizza%20Planeta%2C%20quiero%20hacer%20un%20pedido",
        filename="qr_whatsapp.png",
        fill_color="#25D366"  # Verde WhatsApp
    )
    print(f"✅ QR de WhatsApp guardado en: {whatsapp_qr}")
