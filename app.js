// CONFIGURACIÓN DE ACCESO
const CLAVE_MAESTRA = "1234"; // AQUÍ PONES TU CLAVE

function checkAccess() {
    const claveIngresada = document.getElementById('access-key').value;
    if (claveIngresada === CLAVE_MAESTRA) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else {
        alert("CLAVE INCORRECTA - ACCESO DENEGADO");
    }
}

// DATOS Y LÓGICA
const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'1', a:'CARNERO', t:'TIERRA'},
    {n:'2', a:'TORO', t:'TIERRA'}, {n:'3', a:'CIEMPIES', t:'TIERRA'}, {n:'4', a:'ALACRAN', t:'TIERRA'},
    {n:'5', a:'LEON', t:'TIERRA'}, {n:'6', a:'RANA', t:'AGUA'}, {n:'7', a:'PERICO', t:'AIRE'},
    {n:'8', a:'RATON', t:'TIERRA'}, {n:'9', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'TIERRA'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'TIERRA'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'JIRAFA', t:'TIERRA'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'37', a:'TORTUGA', t:'TIERRA'},
    {n:'38', a:'BUFALO', t:'TIERRA'}, {n:'39', a:'LECHUZA', t:'AIRE'}, {n:'40', a:'AVISPA', t:'AIRE'},
    {n:'41', a:'CANGURO', t:'TIERRA'}, {n:'42', a:'TUCAN', t:'AIRE'}, {n:'43', a:'MARIPOSA', t:'AIRE'},
    {n:'44', a:'CHIGÜIRE', t:'TIERRA'}, {n:'45', a:'GARZA', t:'AIRE'}, {n:'46', a:'PUMA', t:'TIERRA'},
    {n:'47', a:'PAVO REAL', t:'AIRE'}, {n:'48', a:'PUERCOESPIN', t:'TIERRA'}, {n:'49', a:'PEREZA', t:'TIERRA'},
    {n:'50', a:'CANARIO', t:'AIRE'}, {n:'51', a:'PELICANO', t:'AIRE'}, {n:'52', a:'PULPO', t:'AGUA'},
    {n:'53', a:'CARACOL', t:'AGUA'}, {n:'54', a:'GRILLO', t:'TIERRA'}, {n:'55', a:'OSO HORMIGUERO', t:'TIERRA'},
    {n:'56', a:'TIBURON', t:'AGUA'}, {n:'57', a:'PATO', t:'AGUA'}, {n:'58', a:'HORMIGA', t:'TIERRA'},
    {n:'59', a:'PANTERA', t:'TIERRA'}, {n:'60', a:'CAMALEON', t:'TIERRA'}, {n:'61', a:'PANDA', t:'TIERRA'},
    {n:'62', a:'CACHICAMO', t:'TIERRA'}, {n:'63', a:'CANGREJO', t:'AGUA'}, {n:'64', a:'GAVILÁN', t:'AIRE'},
    {n:'65', a:'ARAÑA', t:'TIERRA'}, {n:'66', a:'LOBO', t:'TIERRA'}, {n:'67', a:'AVESTRUZ', t:'AIRE'},
    {n:'68', a:'JAGUAR', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', a:'BISONTE', t:'TIERRA'},
    {n:'71', a:'GUACAMAYA', t:'AIRE'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'HIPOPOTAMO', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaSeleccionadaActiva = null;

// RELOJ
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

// PESTAÑAS
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) contents[i].style.display = "none";
    const buttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// INICIO
function inicializarSistema() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-consulta-historial').value = hoy;
    generarPanelDiario();
    generarGridBotones();
    consultarFechaEspecifica();
}

async function consultarFechaEspecifica() {
    const fecha = document.getElementById('fecha-consulta-historial').value;
    const tabla = document.getElementById('lista-historial');
    tabla.innerHTML = '<tr><td colspan="4">Cargando...</td></tr>';

    try {
        const res = await fetch(`https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial?fecha=${fecha}`);
        const datos = await res.json();
        tabla.innerHTML = '';
        if (datos.length > 0) {
            datos.sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
            historialGlobal = datos;
            datos.forEach(r => {
                const clase = r.num === '75' ? 'class="row-guacharo"' : '';
                tabla.innerHTML += `<tr ${clase} style="border-bottom: 1px solid #334155;"><td style="padding:10px;">${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="4">No hay registros</td></tr>';
        }
        actualizarDiasSinGuacharo();
    } catch (e) { tabla.innerHTML = '<tr><td colspan="4">Error de red</td></tr>'; }
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    panel.innerHTML = '';
    horasSorteo.forEach(h => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        box.innerText = h;
        box.onclick = () => {
            horaSeleccionadaActiva = h;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = '1px solid #475569');
            box.style.border = '2px solid #38bdf8';
        };
        panel.appendChild(box);
    });
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${a.n}</strong><br><small>${a.a}</small>`;
        btn.onclick = () => registrarDato(a);
        container.appendChild(btn);
    });
}

async function registrarDato(animal) {
    if(!horaSeleccionadaActiva) return alert("Elige una HORA primero");
    const fecha = document.getElementById('fecha-analisis').value;
    const dato = { fecha, hora: horaSeleccionadaActiva, num: animal.n, animal: animal.a, tipo: animal.t };
    
    try {
        await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dato)
        });
        alert("Guardado: " + animal.a);
        consultarFechaEspecifica();
    } catch (e) { alert("Error al conectar"); }
}

function actualizarDiasSinGuacharo() {
    // Aquí podrías poner lógica para contar días atrás desde la API
    document.getElementById('dias-sin-75').innerText = "0"; 
}
