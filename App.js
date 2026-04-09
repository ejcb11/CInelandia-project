let carrito = [];
const API_URL = "http://localhost:8000/api";

// 1. Efecto Scroll del Hero al Menú
function irAlMenu() {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
}

// 2. Cargar las pizzas desde Python
async function cargarMenu() {
    const contenedor = document.getElementById('pizza-container');
    try {
        const response = await fetch(`${API_URL}/pizzas`);
        const pizzas = await response.json();
        contenedor.innerHTML = ''; 

        pizzas.forEach(pizza => {
            const nombreSeguro = pizza.name.replace(/'/g, "\\'"); // Evita errores con nombres especiales
            const tarjeta = `
                <div class="group bg-[#0d1526] text-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800 hover:border-yellow-400/50 transition-all duration-300 hover:-translate-y-2">
                    <div class="relative h-56 overflow-hidden">
                        <img src="${pizza.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    </div>
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-2">
                            <h2 class="text-2xl font-black italic tracking-tight">${pizza.name}</h2>
                            <span class="text-2xl font-black text-green-400">$${pizza.price}</span>
                        </div>
                        <p class="text-gray-400 text-sm mb-6 h-12 overflow-hidden">${pizza.description}</p>
                        
                        <button onclick="agregarAlCarrito('${nombreSeguro}', ${pizza.price})" class="w-full bg-yellow-400 text-black hover:bg-yellow-300 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95">
                            <span>AÑADIR AL PEDIDO</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    } catch (error) {
        console.error("Error cargando el menú:", error);
    }
}

// 3. Funciones del Carrito de Compras
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('translate-x-full');
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio: parseFloat(precio) });
    actualizarCarritoVisual();
    
    // Abrir automáticamente el panel lateral
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function actualizarCarritoVisual() {
    const contenedorItems = document.getElementById('cart-items');
    const contador = document.getElementById('cart-count');
    const totalElemento = document.getElementById('cart-total');
    
    contenedorItems.innerHTML = '';
    let sumaTotal = 0;

    carrito.forEach((item, index) => {
        sumaTotal += item.precio;
        contenedorItems.innerHTML += `
            <div class="flex justify-between items-center bg-gray-900/80 p-4 rounded-2xl border border-gray-800 mb-3">
                <div>
                    <p class="font-black text-sm uppercase italic text-white">${item.nombre}</p>
                    <p class="text-green-400 font-bold">$${item.precio.toFixed(2)}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" class="text-red-500 hover:text-red-400 p-2">
                    ✕
                </button>
            </div>
        `;
    });

    contador.innerText = carrito.length;
    totalElemento.innerText = `$${sumaTotal.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoVisual();
}

// 4. Cargar los QR
async function cargarQRCodes() {
    const api_endpoints = [
        { id: 'qr-instagram', data: "https://instagram.com/pizzaplaneta", color: "#E1306C" },
        { id: 'qr-whatsapp', data: "https://wa.me/15551234567", color: "#25D366" }
    ];

    for (const item of api_endpoints) {
        const div = document.getElementById(item.id);
        if (!div) continue;
        try {
            const res = await fetch(`${API_URL}/qr-code`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ data: item.data, fill_color: item.color, size: 400 })
            });
            const qr = await res.json();
            div.innerHTML = `<img src="data:image/png;base64,${qr.image_base64}" class="w-full h-full object-contain">`;
        } catch (e) {
            console.error(`Error cargando QR ${item.id}:`, e);
        }
    }
}

// 5. Encender todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    cargarQRCodes();
});