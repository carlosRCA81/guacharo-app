// ==========================================
// CONTROLADOR DE INTERFAZ (app.js)
// ==========================================

async function inicializarSistema() {
    console.log("App Iniciada...");
    await cargarHistorialRemoto();
    generarBotonesAnimales();
    actualizarInterfaz();
}

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

async function registrarSorteo(numero) {
    const animal = listaAnimales.find(a => a.n === numero);
    const fecha = document.getElementById('fecha-analisis').value;
    const hora = document.getElementById('hora-sorteo').value;

    const nuevo = {
        fecha: fecha,
        hora: hora,
        num: animal.n,
        animal: animal.a,
        tipo: animal.t
    };

    const exito = await guardarEnSupabase(nuevo);
    if (exito) {
        historial.unshift(nuevo);
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    actualizarTabla();
    calcularBalanceElementos();
    analizarDormidos();
    
    const display = document.getElementById('last-num');
    if (display && historial.length > 0) {
        display.innerText = `${historial[0].num} - ${historial[0].animal}`;
    }
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if (!cuerpo) return;
    
    cuerpo.innerHTML = '';
    historial.forEach(r => {
        const fila = document.createElement('tr');
        if (r.num === '75') fila.className = 'row-guacharo';
        fila.innerHTML = `<td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td>`;
        cuerpo.appendChild(fila);
    });
}

function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let c of contents) c.classList.remove("active");
    
    const btns = document.getElementsByClassName("tab-btn");
    for (let b of btns) b.classList.remove("active");
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
