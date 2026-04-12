/* LÓGICA INTEGRAL ANALIZADOR CRCA - REPARADA */

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
let historial = [];
let horaSeleccionadaActiva = null;

// RELOJ
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

// NAVEGACIÓN
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) contents[i].style.display = "none";
    
    const btns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < btns.length; i++) btns[i].classList.remove("active");
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// ARRANQUE DEL SISTEMA
function inicializarSistema() {
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', generarPanelDiario);
    }
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    cargarHistorialRemoto();
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small>${animal.a}</small>`;
        btn.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Primero selecciona una HORA");
            registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        };
        container.appendChild(btn);
    });
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    if(!panel) return;
    panel.innerHTML = '';
    const fechaActual = document.getElementById('fecha-analisis').value;

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const reg = historial.find(r => r.fecha === fechaActual && r.hora === hora);
        
        if (reg) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${reg.num})`;
        } else {
            box.innerText = hora;
        }

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = '1px solid #475569');
            box.style.border = '2px solid #38bdf8';
        };
        panel.appendChild(box);
    });
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    
    // Eliminar si ya existe esa hora en esa fecha
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);

    const nuevoRegistro = { fecha, hora, num, animal, tipo };
    historial.push(nuevoRegistro);
    
    actualizarInterfaz();

    // Sincronizar nube
    try {
        await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuevoRegistro)
        });
    } catch (e) { console.log("Error nube, guardado local."); }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    analizarGuacharo();
    if(historial.length > 0) {
        const ult = historial[historial.length-1];
        const lastDisp = document.getElementById('last-num');
        if(lastDisp) lastDisp.innerText = `${ult.num} - ${ult.animal}`;
    }
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    historial.slice().reverse().forEach(r => {
        cuerpo.innerHTML += `<tr><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
    });
}

async function cargarHistorialRemoto() {
    try {
        const res = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial');
        const datos = await res.json();
        if (datos) {
            historial = datos;
            actualizarInterfaz();
        }
    } catch (e) { console.log("Usando datos locales."); }
}

// Funciones adicionales de análisis
function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- Elige Animal --</option>';
    listaAnimales.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.n;
        opt.innerText = `${a.n} - ${a.a}`;
        sel.appendChild(opt);
    });
}

function analizarGuacharo() {
    let sin75 = 0;
    for(let i = historial.length-1; i >= 0; i--) {
        if(historial[i].num === '75') break;
        sin75++;
    }
    const d = document.getElementById('dias-sin-75');
    if(d) d.innerText = sin75;
}

function registrarPorNumero() {
    const inputNum = document.getElementById('num-rapido');
    let val = inputNum.value.trim();
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA");
    if (val.length === 1 && val !== "0") val = "0" + val;
    
    const animal = listaAnimales.find(a => a.n === val);
    if (!animal) return alert("Número inválido");

    registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
    inputNum.value = '';
}
