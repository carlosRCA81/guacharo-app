// ==========================================
// CONFIGURACIÓN SUPABASE (INTACTA)
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

async function inicializarSistema() {
    document.getElementById('fecha-analisis').value = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-busqueda-historial').value = new Date().toISOString().split('T')[0];
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
    if (data) { historial = data; actualizarInterfaz(); }
}

// ALGORITMO: 3 DATOS FIJOS DEL DÍA
function calcularTresDatosFijos() {
    const cont = document.getElementById('contenedor-fijos');
    if(!cont || historial.length < 5) return;

    // Lógica: 1. El más frío, 2. El que más sale después del último, 3. Random del elemento dominante
    const frecuencias = {};
    historial.forEach(r => frecuencias[r.num] = (frecuencias[r.num] || 0) + 1);
    
    // 1. Frío (que menos ha salido)
    const frio = listaAnimales.sort((a,b) => (frecuencias[a.n] || 0) - (frecuencias[b.n] || 0))[0].n;
    
    // 2. Caliente (el que más sale)
    const caliente = Object.entries(frecuencias).sort((a,b) => b[1] - a[1])[0][0];

    // 3. El 75 si está cerca de salir, sino el 00
    const dato3 = (parseInt(document.getElementById('dias-sin-75').innerText) > 40) ? '75' : '00';

    const fijos = [frio, caliente, dato3];
    cont.innerHTML = fijos.map(f => `<div class="dato-fijo">${f}</div>`).join('');
}

// CORRECCIÓN GUACHARO 75
function analizarGuacharo() {
    const hO = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    let index75 = hO.findIndex(r => r.num === '75');
    
    const display = document.getElementById('dias-sin-75');
    if(display) {
        // Si no se encuentra, son todos los registros. Si se encuentra, son los sorteos desde el último.
        display.innerText = index75 === -1 ? hO.length : index75;
    }
}

// SUGERENCIAS POR ELEMENTO
function sugerirPorElemento() {
    const res = document.getElementById('sugerencias-elemento');
    const hoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === hoy);
    if(sorteosHoy.length === 0) return;

    const ultimoTipo = sorteosHoy[0].tipo;
    const sugeridos = listaAnimales.filter(a => a.t === ultimoTipo).slice(0, 3).map(a => a.n).join(', ');

    res.innerHTML = `<div class="card-estudio">🔥 Dominio <b>${ultimoTipo}</b> detectado. Sugeridos a salir: <b>${sugeridos}</b></div>`;
}

// EL RESTO DE FUNCIONES SE MANTIENEN PARA NO ROMPER NADA
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.push(nuevo);
    actualizarInterfaz();
    await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
}

function actualizarInterfaz() {
    analizarGuacharo();
    calcularTresDatosFijos();
    actualizarTabla();
    generarPanelDiario();
    sugerirPorElemento();
    detectarJugadasEspeciales();
}

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Elige hora");
    let v = document.getElementById('num-rapido').value.padStart(2, '0').replace('000','00');
    if(v === '0') v = '0';
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const f = document.getElementById('fecha-busqueda-historial').value;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora)).forEach(r => {
        c.innerHTML += `<tr ${r.num==='75'?'class="row-guacharo"':''}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
    });
}

function generarPanelDiario() {
    const p = document.getElementById('panel-diario-sorteos');
    const f = document.getElementById('fecha-analisis').value;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const r = historial.find(x => x.fecha === f && x.hora === h);
        const b = document.createElement('div');
        b.className = `hora-box ${r?'jugado':''} ${h===horaSeleccionadaActiva?'active-select':''}`;
        b.innerHTML = r ? `${h}<br><b>${r.num}</b>` : h;
        b.onclick = () => { horaSeleccionadaActiva = h; generarPanelDiario(); };
        p.appendChild(b);
    });
}

function detectarJugadasEspeciales() {
    const alertCont = document.getElementById('alertas-algoritmo');
    const hoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === hoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    if(sorteosHoy.length < 2 || !alertCont) return;
    alertCont.innerHTML = '';
    const ult = sorteosHoy[sorteosHoy.length-1];
    const pen = sorteosHoy[sorteosHoy.length-2];
    if(ult.num.split('').reverse().join('') === pen.num) alertCont.innerHTML += `<span class="badge bg-espejo">🔄 ESPEJO</span>`;
    if(Math.abs(parseInt(ult.num) - parseInt(pen.num)) === 1) alertCont.innerHTML += `<span class="badge bg-escalera">📈 ESCALERA</span>`;
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = 'animal-btn';
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.t, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function estudiarAnimalPatron() {
    const n = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-patron-avanzado');
    const h = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    let ant = {}, sig = {};
    h.forEach((r, i) => {
        if(r.num === n) {
            if(i > 0) { let k = h[i-1].num; ant[k] = (ant[k]||0)+1; }
            if(i < h.length-1) { let k = h[i+1].num; sig[k] = (sig[k]||0)+1; }
        }
    });
    const top = (o) => Object.entries(o).sort((a,b)=>b[1]-a[1])[0] || ["--", 0];
    res.innerHTML = `<div class="card-estudio">💡 Histórico para ${n}:<br>Sale antes: ${top(ant)[0]}<br>Sale después: ${top(sig)[0]}</div>`;
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializarSistema;
