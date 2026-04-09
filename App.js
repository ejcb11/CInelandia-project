async function cargarMenu() {
    const contenedor = document.getElementById('pizza-container');

    try {
        // 1. Llamamos a tu servidor backend
        const respuesta = await fetch('http://localhost:8000/api/pizzas');
        
        if (!respuesta.ok) {
            throw new Error('Error al conectar con la base espacial (Backend)');
        }

        // 2. Convertimos la respuesta a datos usables
        const pizzas = await respuesta.json();
        
        // 3. Limpiamos el mensaje de "Cargando..."
        contenedor.innerHTML = '';

        // 4. Dibujamos cada pizza en la pantalla usando clases de Tailwind
        pizzas.forEach(pizza => {
    const tarjeta = `
        <div class="group bg-card text-card-foreground rounded-3xl overflow-hidden shadow-xl border border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div class="relative overflow-hidden h-56">
                <img src="${pizza.image}" alt="${pizza.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                    🚀 Galáctica
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h2 class="text-2xl font-bold tracking-tight">${pizza.name}</h2>
                    <span class="text-2xl font-black text-primary">$${pizza.price}</span>
                </div>
                
                <p class="text-muted-foreground text-sm leading-relaxed mb-6 h-12 overflow-hidden">
                    ${pizza.description}
                </p>
                
                <button class="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                    <span>Añadir al pedido</span>
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
        console.error("Houston, tenemos un problema:", error);
        contenedor.innerHTML = `<p class="text-red-500 text-center col-span-3">⚠️ Error cargando el menú. Verifica que el backend esté encendido.</p>`;
    }
}

// Ejecutar la función apenas cargue la página
cargarMenu();

let carrito = [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('translate-x-full');
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarrito();
    // Animación de feedback
    if(!document.getElementById('cart-sidebar').classList.contains('translate-x-full')) return;
    toggleCart(); 
}

function actualizarCarrito() {
    const contenedor = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const totalElement = document.getElementById('cart-total');
    
    contenedor.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        contenedor.innerHTML += `
            <div class="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                <div>
                    <p class="font-bold text-sm">${item.nombre}</p>
                    <p class="text-green-400 text-xs">$${item.precio}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" class="text-red-500 text-xs">Quitar</button>
            </div>
        `;
    });

    count.innerText = carrito.length;
    totalElement.innerText = `$${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// ... (resto de tu lógica del carrito arriba) ...

// Función para cargar los códigos QR desde el backend
async function cargarQRCodes() {
    const contenedorInstagram = document.getElementById('qr-instagram');
    const contenedorWhatsApp = document.getElementById('qr-whatsapp');

    // Datos para los QR (ajústalos a tus enlaces reales)
    const datosInstagram = {
        data: "https://instagram.com/pizzaplaneta",
        fill_color: "#E1306C" // Color Instagram
    };
    const datosWhatsApp = {
        data: "https://wa.me/15551234567?text=Hola%20Pizza%20Planeta%2C%20quiero%20hacer%20un%20pedido",
        fill_color: "#25D366" // Color WhatsApp
    };

    try {
        // Cargar QR Instagram
        const responseInsta = await fetch('http://localhost:8000/api/qr-code', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datosInstagram)
        });
        const qrInsta = await responseInsta.json();
        contenedorInstagram.innerHTML = `<img src="data:image/png;base64,${qrInsta.image_base64}" class="w-full h-full">`;

        // Cargar QR WhatsApp
        const responseWA = await fetch('http://localhost:8000/api/qr-code', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datosWhatsApp)
        });
        const qrWA = await responseWA.json();
        contenedorWhatsApp.innerHTML = `<img src="data:image/png;base64,${qrWA.image_base64}" class="w-full h-full">`;

    } catch (error) {
        console.error("Error cargando códigos QR:", error);
        contenedorInstagram.innerHTML = `<span class="text-xs text-red-400 p-2">Error al cargar QR</span>`;
        contenedorWhatsApp.innerHTML = `<span class="text-xs text-red-400 p-2">Error al cargar QR</span>`;
    }
}

// Asegúrate de llamar a esta función al cargar la página
// Puedes añadirla dentro del mismo evento que carga el menú o por separado:
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu(); // Tu función existente para las pizzas
    cargarQRCodes(); // La nueva función para los QR
});