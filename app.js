// ==========================================
// CONTROLADOR DE INTERFAZ - ANALIZADOR CRCA
// ==========================================

function inicializarSistema() {
    generarBotonesAnimales();
    cargarHistorialRemoto();
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
    const registro = {
        fecha: document.getElementById('fecha-analisis').value,
        hora: document.getElementById('hora-sorteo').value,
        num: animal.n,
        animal: animal.a,
        tipo: animal.t
    };

    const exito = await guardarEnSupabase(registro);
    if (exito) {
        historial.unshift(registro);
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    actualizarTabla();
    calcularBalanceElementos();
    analizarDormidos();
    
    if (historial.length > 0) {
        document.getElementById('last-num').innerText = `${historial[0].num} - ${historial[0].animal}`;
    }
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '';
    historial.forEach(r => {
        const esGuacharo = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${esGuacharo}>
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td>${r.num}</td>
            <td>${r.animal}</td>
            <td>${r.tipo}</td>
        </tr>`;
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
