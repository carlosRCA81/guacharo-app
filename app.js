/* LÓGICA INTEGRAL ANALIZADOR CRCA - VERSIÓN PATRONES ACTUALIZADA */

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

// Reloj en vivo
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

// Cambiar de pestañas
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// INICIO DEL SISTEMA
function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones(); // <--- Dibuja los cuadros de animales
    llenarSelectEstudio();
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', generarPanelDiario);
    }
}

// Dibuja la cuadrícula de animales en el Registro
function generarGridBotones() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small>${animal.a}</small>`;
        btn.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Primero toca una HORA en el panel superior");
            registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        };
        container.appendChild(btn);
    });
}

// Llena el selector de la pestaña Patrones
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

// Analiza quién sale antes y después
function estudiarAnimalEspecifico() {
    const numBuscado = document.getElementById('select-animal-estudio').value;
    const resDiv = document.getElementById('resultado-patrones');
    if(!numBuscado) return;
    
    let conteoTotal = 0;
    let despues = {};
    let antes = {};

    historial.forEach((reg, idx) => {
        if(reg.num === numBuscado) {
            conteoTotal++;
            if(idx < historial.length - 1) {
                let sig = historial[idx+1].num + " - " + historial[idx+1].animal;
                despues[sig] = (despues[sig] || 0) + 1;
            }
            if(idx > 0) {
                let ant = historial[idx-1].num + " - " + historial[idx-1].animal;
                antes[ant] = (antes[ant] || 0) + 1;
            }
        }
    });

    if(conteoTotal === 0) {
        resDiv.innerHTML = `<p style="color:#ef4444; padding:10px;">Sin datos registrados para el número ${numBuscado}.</p>`;
        return;
    }

    const masFrec = (obj) => {
        const keys = Object.keys(obj);
        return keys.length > 0 ? keys.reduce((a, b) => obj[a] > obj[b] ? a : b) : "Sin datos";
    };

    resDiv.innerHTML = `
        <div class="stat-card-mini">
            <h4>RESUMEN: ${numBuscado}</h4>
            <p>Veces detectado: <strong>${conteoTotal}</strong></p>
        </div>
        <div class="stat-card-mini" style="border-left-color: #f87171;">
            <h4>SUELE SALIR ANTES:</h4>
            <p>🎯 ${masFrec(antes)}</p>
        </div>
        <div class="stat-card-mini" style="border-left-color: #4ade80;">
            <h4>SUELE SALIR DESPUÉS:</h4>
            <p>🚀 ${masFrec(despues)}</p>
        </div>
    `;
}

// Panel de horas (Mapa de calor)
function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    if(!panel) return;
    panel.innerHTML = '';
    const fechaActual = document.getElementById('fecha-analisis').value;

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const registroExistente = historial.find(r => r.fecha === fechaActual && r.hora === hora);
        
        if (registroExistente) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${registroExistente.num})`;
        } else {
            box.innerText = hora;
        }

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = '1px solid #475569');
            box.style.border = '2px solid #38bdf8';
            const inputR = document.getElementById('num-rapido');
            if(inputR) inputR.focus();
        };
        panel.appendChild(box);
    });
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA en los cuadros de arriba");
    const inputNum = document.getElementById('num-rapido');
    let numInput = inputNum.value.trim();
    if(numInput === "0" || numInput === "00") { /* OK */ } 
    else if(numInput.length === 1) numInput = "0" + numInput;

    const animal = listaAnimales.find(a => a.n === numInput);
    if (!animal) return alert("Ese número no existe en la ruleta");

    registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
    inputNum.value = '';
}

function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);

    historial.push({ fecha, hora, num, animal, tipo });
    actualizarInterfaz();
}

function actualizarInterfaz() {
    if(historial.length > 0) {
        const ult = historial[historial.length-1];
        const lastDisp = document.getElementById('last-num');
        if(lastDisp) lastDisp.innerText = `${ult.num} - ${ult.animal}`;
    }
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    historial.slice().reverse().forEach(r => {
        cuerpo.innerHTML += `<tr><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
    });
}

function analizarGuacharo() {
    let sin75 = 0;
    const dias75 = document.getElementById('dias-sin-75');
    if(!dias75) return;
    for(let i = historial.length-1; i >= 0; i--) {
        if(historial[i].num === '75') break;
        sin75++;
    }
    dias75.innerText = sin75;
}

const btnBorrar = document.getElementById('btn-borrar');
if(btnBorrar) btnBorrar.onclick = () => { historial.pop(); actualizarInterfaz(); };
// MODIFICACIÓN PROFESIONAL: Registro con envío a la Nube
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    
    // 1. Registro local (para que sea instantáneo en pantalla)
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);
    const nuevoRegistro = { fecha, hora, num, animal, tipo };
    historial.push(nuevoRegistro);
    
    actualizarInterfaz();

    // 2. ENVÍO DE SEGURIDAD A LA NUBE (Ohio)
    try {
        const respuesta = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(nuevoRegistro)
        });

        if (respuesta.ok) {
            console.log("✅ Datos respaldados en la nube exitosamente");
        } else {
            console.error("❌ Error de conexión al servidor");
        }
    } catch (error) {
        console.error("⚠️ El servidor está en hibernación o no hay internet:", error);
    }
}

// Nueva función para recuperar datos al abrir la App
async function cargarHistorialRemoto() {
    try {
        const respuesta = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial');
        const datos = await respuesta.json();
        if (datos) {
            historial = datos;
            actualizarInterfaz();
        }
    } catch (error) {
        console.log("Modo local activo");
    }
}
