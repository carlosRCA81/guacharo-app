// ==========================================
// COORDINACIÓN DE INTERFAZ - ANALIZADOR CRCA
// ==========================================

let historial = [];

// 1. Inicialización al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Si el usuario ya pasó la seguridad, cargamos datos
    const mainApp = document.getElementById('main-app');
    if (mainApp && mainApp.style.display !== 'none') {
        inicializarSistema();
    }
});

async function inicializarSistema() {
    console.log("Iniciando componentes de la App...");
    await cargarHistorialRemoto();
    generarBotonesAnimales();
    actualizarInterfaz();
}

// 2. Generar la cuadrícula de animales para click rápido
function generarBotonesAnimales() {
    const grid = document.getElementById('grid-animales');
    if (!grid) return;
    
    grid.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-item';
        btn.innerHTML = `<strong>${animal.n}</strong><br>${animal.a}`;
        btn.onclick = () => registrarSorteo(animal.n);
        grid.appendChild(btn);
    });
}

// 3. Registrar un nuevo sorteo
async function registrarSorteo(numero) {
    const animalEncontrado = listaAnimales.find(a => a.n === numero);
    if (!animalEncontrado) {
        alert("Número no válido");
        return;
    }

    const nuevoRegistro = {
        fecha: document.getElementById('fecha-analisis').value,
        hora: document.getElementById('hora-sorteo').value,
        num: animalEncontrado.n,
        animal: animalEncontrado.a,
        tipo: animalEncontrado.t
    };

    // Guardar en Supabase (Función en logic.js)
    const exito = await guardarEnSupabase(nuevoRegistro);

    if (exito) {
        // Actualizar localmente para no recargar todo
        historial.unshift(nuevoRegistro);
        actualizarInterfaz();
        console.log("Registrado con éxito:", nuevoRegistro.animal);
    }
}

// 4. Actualizar toda la UI
function actualizarInterfaz() {
    actualizarTabla();
    calcularBalanceElementos(); // En logic.js
    analizarDormidos();        // En logic.js
    
    // Mostrar el último resultado en el banner
    if (historial.length > 0) {
        const last = historial[0];
        const display = document.getElementById('last-num');
        if (display) display.innerText = `${last.num} - ${last.animal}`;
    }
}

// 5. Renderizar la tabla de historial
function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if (!cuerpo) return;
    
    cuerpo.innerHTML = '';
    historial.slice(0, 50).forEach(r => { // Mostramos los últimos 50
        const fila = document.createElement('tr');
        if (r.num === '75') fila.className = 'row-guacharo';
        
        fila.innerHTML = `
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td>${r.num}</td>
            <td>${r.animal}</td>
            <td><small>${r.tipo}</small></td>
        `;
        cuerpo.appendChild(fila);
    });
}

// 6. Navegación de pestañas
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let c of contents) c.classList.remove("active");
    
    const btns = document.getElementsByClassName("tab-btn");
    for (let b of btns) b.classList.remove("active");
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
