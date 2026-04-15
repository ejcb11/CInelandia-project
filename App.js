let carrito = [];
const API_URL = "http://localhost:8000/api";

// Efecto Scroll del Hero al Menú
function irAlMenu() {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
}

// Cargar las pizzas desde Python
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

// Funciones del Carrito de Compras
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

// Carga de los codigos QR de contacto
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

// Encender todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    cargarQRCodes();
});

// --- RADAR DE PEDIDOS ---
function rastrearPedido() {
    const input = document.getElementById('codigo-rastreo');
    const codigo = input.value.trim().toUpperCase();
    const panel = document.getElementById('panel-telemetria');
    
    if (codigo === "") {
        alert("¡Capitán! Necesita ingresar un código de misión válido.");
        return;
    }

    // Mostrar el panel con una pequeña animación
    panel.classList.remove('hidden');
    panel.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-4', 'duration-500');

    // Resetear todos los pasos primero
    for (let i = 1; i <= 4; i++) {
        const paso = document.getElementById(`paso-${i}`);
        const icono = paso.querySelector('div');
        paso.classList.add('opacity-50');
        icono.className = "w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xl mb-4 transition-all duration-500 z-10";
    }
    document.getElementById('linea-progreso').style.width = '0%';

    // Simular conexión con el backend (MOCK DATA)
    let nivelProgreso = 1;

    if (codigo === "ASTRO-001") {
        nivelProgreso = 2; // Preparando
    } else if (codigo === "ASTRO-002") {
        nivelProgreso = 3; // En camino
    } else if (codigo === "ASTRO-003") {
        nivelProgreso = 4; // Entregado
    } else {
        // Para cualquier otro código válido, simulacion que acaba de entrar
        nivelProgreso = 1; 
    }

    // Animar la barra de progreso
    setTimeout(() => {
        const anchos = ['0%', '33%', '66%', '100%'];
        document.getElementById('linea-progreso').style.width = anchos[nivelProgreso - 1];

        // Encender los pasos completados
        for (let i = 1; i <= nivelProgreso; i++) {
            setTimeout(() => {
                const paso = document.getElementById(`paso-${i}`);
                const icono = paso.querySelector('div');
                
                paso.classList.remove('opacity-50');
                // Estilo brillante para paso completado
                icono.className = "w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] flex items-center justify-center text-xl mb-4 transition-all duration-500 z-10 scale-110";
            }, i * 300); 
        }
    }, 100);
}

// LÓGICA DEL MODAL DE CONFIRMACIÓN
let codigoPedidoActual = "";

function procesarPedido() {
    // Validacion del carrito sin elementos
    if (carrito.length === 0) {
        alert("¡Capitán! Su carrito espacial está vacío. Añada provisiones antes de despegar.");
        return;
    }

    // Generacion de código aleatorio
    const numeroAleatorio = Math.floor(Math.random() * 900) + 100;
    codigoPedidoActual = `ASTRO-${numeroAleatorio}`;

    // Insertar código y abrir modal
    const modal = document.getElementById('modal-confirmacion');
    const codigoElemento = document.getElementById('codigo-pedido-modal');
    
    if (modal && codigoElemento) {
        codigoElemento.innerText = codigoPedidoActual;
        modal.classList.remove('hidden');
    }

    // Limpiar carrito
    carrito = [];
    actualizarCarritoVisual();
    
    // Cerrar panel lateral del carrito
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && !sidebar.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-confirmacion');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function irAlRadarDesdeModal() {
    // Ocultar modal
    cerrarModal();
    
    // Pegar código en el input del radar automáticamente
    const inputRadar = document.getElementById('codigo-rastreo');
    if (inputRadar) {
        inputRadar.value = codigoPedidoActual;
    }
    
    // Hacer scroll hacia el radar
    const radarSection = document.getElementById('panel-telemetria').parentElement;
    if (radarSection) {
        radarSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// LÓGICA DEL BOTÓN "IR ARRIBA"

function subirAlInicio() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
}

// Mostrar el botón solo cuando bajamos por la página
window.addEventListener('scroll', () => {
    const btnSubir = document.getElementById('btn-subir');
    
    if (window.scrollY > 400) {
        // Aparece
        btnSubir.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        btnSubir.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
        // Se esconde
        btnSubir.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        btnSubir.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }
});

// ANIMACION DE DESPEGUE

function iniciarDespegue() {
    const contenedor = document.getElementById('contenedor-cohete');
    const fuego = document.getElementById('fuego-motor');
    const menuSection = document.getElementById('menu-section');
    
    if (contenedor && menuSection) {
        // 1. Inicio de vibración (rumble) y animacion de motor
        contenedor.classList.add('animacion-rumble');
        fuego.classList.add('fuego-activo');
        
        // 2. retraso antes de animacion
        setTimeout(() => {
            
            contenedor.classList.remove('animacion-rumble');
            contenedor.classList.add('animacion-despegue');
            
            setTimeout(() => {
                menuSection.scrollIntoView({ behavior: 'smooth' });
                
               // retorno del cohete a zona inicial
                setTimeout(() => {
                    contenedor.classList.remove('animacion-despegue');
                    fuego.classList.remove('fuego-activo');
                    // corte de animacion del fuego
                }, 2000);
                
            }, 400); 
            
        }, 500); 
    }
}
