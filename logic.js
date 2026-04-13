// ==========================================
// CONFIGURACIÓN SUPABASE - ANALIZADOR CRCA
// ==========================================
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'01', a:'CARNERO', t:'TIERRA'},
    {n:'02', a:'TORO', t:'TIERRA'}, {n:'03', a:'CIEMPIES', t:'TIERRA'}, {n:'04', a:'ALACRAN', t:'TIERRA'},
    {n:'05', a:'LEON', t:'TIERRA'}, {n:'06', a:'RANA', t:'AGUA'}, {n:'07', a:'PERICO', t:'AIRE'},
    {n:'08', a:'RATON', t:'TIERRA'}, {n:'09', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
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

// ==========================================
// SISTEMA DE NAVEGACIÓN Y RELOJ
// ==========================================
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    let tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) { tablinks[i].classList.remove("active"); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

async function inicializarSistema() {
    generarGridBotones();
    llenarSelectEstudio();
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
        fechaInput.addEventListener('change', generarPanelDiario);
    }
    await cargarHistorialRemoto();
}

// ==========================================
// INTERFAZ DE REGISTRO
// ==========================================
function generarGridBotones() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-item';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small>${animal.a}</small>`;
        btn.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Primero toca una HORA");
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
            const inputRapido = document.getElementById('num-rapido');
            if(inputRapido) inputRapido.focus();
        };
        panel.appendChild(box);
    });
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA");
    const inputNum = document.getElementById('num-rapido');
    let val = inputNum.value.trim();
    if (!val) return;

    if (val !== "0" && val !== "00" && val.length === 1) val = "0" + val;
    const animal = listaAnimales.find(a => a.n === val);
    
    if (!animal) return alert("Número no existe");
    registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
    inputNum.value = '';
}

// ==========================================
// GESTIÓN DE DATOS (SUPABASE)
// ==========================================
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo };

    try {
        const { error } = await _supabase.from('historial_sorteos').upsert(nuevoRegistro);
        if (error) throw error;
        await cargarHistorialRemoto();
    } catch (err) { 
        console.error("Error al guardar:", err.message);
        alert("Error de red al guardar datos");
    }
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*');
        if (error) throw error;
        if (data) {
            historial = data;
            actualizarInterfaz();
        }
    } catch (err) { 
        console.log("⚠️ Error Supabase:", err.message);
        const cuerpo = document.getElementById('lista-historial');
        if(cuerpo) cuerpo.innerHTML = '<tr><td colspan="5">Error de red</td></tr>';
    }
}

async function consultarFechaEspecifica() {
    const f = document.getElementById('fecha-consulta-historial').value;
    const { data, error } = await _supabase.from('historial_sorteos').select('*').eq('fecha', f);
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    if(data) {
        data.sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
            const isGuacharo = r.num === '75' ? 'class="row-guacharo"' : '';
            cuerpo.innerHTML += `<tr ${isGuacharo}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
        });
    }
}

// ==========================================
// ANÁLISIS Y ESTADÍSTICAS
// ==========================================
function actualizarInterfaz() {
    if(historial.length > 0) {
        const temp = [...historial].sort((a,b) => {
             if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
             return horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora);
        });
        const ult = temp[temp.length-1];
        const lastNumDisp = document.getElementById('last-num');
        if(lastNumDisp) lastNumDisp.innerText = `${ult.num} - ${ult.animal}`;
    }
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
    calcularBalanceElementos();
    detectarDormidos();
}

function detectarDormidos() {
    const cont = document.getElementById('lista-dormidos');
    if(!cont) return;
    let dormidos = [];
    listaAnimales.forEach(ani => {
        if(!historial.some(r => r.num === ani.n)) dormidos.push(ani.n);
    });
    cont.innerText = dormidos.length > 0 ? dormidos.slice(0, 15).join(', ') + "..." : "Ninguno";
}

function analizarGuacharo() {
    const tempSorted = [...historial].sort((a,b) => {
        if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
        return horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora);
    });

    let sin75 = 0;
    for(let i = tempSorted.length-1; i >= 0; i--) {
        if(tempSorted[i].num === '75') break;
        sin75++;
    }
    const display = document.getElementById('dias-sin-75');
    if(display) display.innerText = sin75;

    const resEstudio = document.getElementById('resultado-patrones-guacharo');
    if (resEstudio) {
        let antesDel75 = [];
        tempSorted.forEach((reg, idx) => {
            if (reg.num === '75' && idx > 0) antesDel75.push(tempSorted[idx-1].num + " - " + tempSorted[idx-1].animal);
        });
        
        if (antesDel75.length > 0) {
            const counts = {};
            antesDel75.forEach(x => counts[x] = (counts[x] || 0) + 1);
            const masFrec = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            resEstudio.innerHTML = `<div class="card-stats"><h4>ANUNCIANTE:</h4><p><strong>${masFrec}</strong></p></div>`;
        }
    }
}

function calcularBalanceElementos() {
    const f = document.getElementById('fecha-analisis').value;
    let counts = { TIERRA: 0, AIRE: 0, AGUA: 0 };
    historial.filter(r => r.fecha === f).forEach(r => { if(counts[r.tipo] !== undefined) counts[r.tipo]++; });
    if(document.getElementById('val-tierra')) {
        document.getElementById('val-tierra').innerText = counts.TIERRA;
        document.getElementById('val-aire').innerText = counts.AIRE;
        document.getElementById('val-agua').innerText = counts.AGUA;
    }
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    if(!sel) return;
    sel.innerHTML = listaAnimales.map(a => `<option value="${a.n}">${a.n} - ${a.a}</option>`).join('');
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    [...historial].sort((a, b) => {
        if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
        return horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora);
    }).slice(0, 30).forEach(r => {
        const isGuacharo = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${isGuacharo}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
    });
}

window.onload = inicializarSistema;
