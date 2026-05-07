const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', c:'AZUL', s:'A'}, {n:'00', a:'BALLENA', c:'AZUL', s:'D'},
    {n:'01', a:'CARNERO', c:'ROJO', s:'D'}, {n:'02', a:'TORO', c:'NEGRO', s:'A'},
    {n:'03', a:'CIEMPIES', c:'ROJO', s:'C'}, {n:'04', a:'ALACRAN', c:'ROJO', s:'F'},
    {n:'05', a:'LEON', c:'ROJO', s:'C'}, {n:'06', a:'RANA', c:'NEGRO', s:'F'},
    {n:'07', a:'PERICO', c:'ROJO', s:'B'}, {n:'08', a:'RATON', c:'NEGRO', s:'E'},
    {n:'09', a:'AGUILA', c:'ROJO', s:'A'}, {n:'10', a:'TIGRE', c:'NEGRO', s:'D'},
    {n:'11', a:'GATO', c:'NEGRO', s:'B'}, {n:'12', a:'CABALLO', c:'ROJO', s:'E'},
    {n:'13', a:'MONO', c:'NEGRO', s:'D'}, {n:'14', a:'PALOMA', c:'ROJO', s:'A'},
    {n:'15', a:'ZORRO', c:'NEGRO', s:'C'}, {n:'16', a:'OSO', c:'ROJO', s:'F'},
    {n:'17', a:'PAVO', c:'NEGRO', s:'B'}, {n:'18', a:'BURRO', c:'ROJO', s:'E'},
    {n:'19', a:'CHIVO', c:'ROJO', s:'E'}, {n:'20', a:'COCHINO', c:'NEGRO', s:'B'},
    {n:'21', a:'GALLO', c:'ROJO', s:'F'}, {n:'22', a:'CAMELLO', c:'NEGRO', s:'C'},
    {n:'23', a:'CEBRA', c:'ROJO', s:'F'}, {n:'24', a:'IGUANA', c:'NEGRO', s:'C'},
    {n:'25', a:'GALLINA', c:'ROJO', s:'D'}, {n:'26', a:'VACA', c:'NEGRO', s:'A'},
    {n:'27', a:'PERRO', c:'ROJO', s:'D'}, {n:'28', a:'ZAMURO', c:'NEGRO', s:'A'},
    {n:'29', a:'ELEFANTE', c:'NEGRO', s:'E'}, {n:'30', a:'CAIMAN', c:'ROJO', s:'B'},
    {n:'31', a:'LAPA', c:'NEGRO', s:'E'}, {n:'32', a:'ARDILLA', c:'ROJO', s:'B'},
    {n:'33', a:'PESCADO', c:'NEGRO', s:'F'}, {n:'34', a:'VENADO', c:'ROJO', s:'C'},
    {n:'35', a:'JIRAFA', c:'NEGRO', s:'A'}, {n:'36', a:'CULEBRA', c:'ROJO', s:'D'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

// --- 🧠 CEREBRO DE TRIPLETAS (FIJO Y ESTADÍSTICO) ---
function generarTripletasInteligentes() {
    const cont = document.getElementById('seccion-tripletas');
    const fechaActual = document.getElementById('fecha-analisis').value;
    if(!historialGlobal.length || !cont) return;

    // 1. Obtener los 10 números con más salidas en todo el historial de Supabase
    const conteo = {};
    historialGlobal.forEach(r => conteo[r.num] = (conteo[r.num] || 0) + 1);
    const calientes = Object.entries(conteo).sort((a,b) => b[1] - a[1]).map(x => x[0]);

    // 2. Usar la fecha para elegir los números del día (Bloqueo de 24h)
    const seed = parseInt(fechaActual.replace(/-/g, ''));
    
    // Función para obtener número basado en frecuencia y fecha
    const getN = (offset) => calientes[(seed + offset) % calientes.length] || '00';

    // TRIPLETA A: Los "Dueños" del historial
    const t1 = [calientes[0] || '17', calientes[1] || '30', calientes[2] || '00'];
    // TRIPLETA B: Arrastre Sectorial (Mezcla de sectores)
    const t2 = [getN(5), getN(12), getN(21)];
    // TRIPLETA C: Deuda Programada
    const t3 = [calientes[3] || '11', calientes[4] || '24', calientes[5] || '09'];

    cont.innerHTML = `
        <div style="text-align:center; color:#22c55e; font-size:0.75rem; margin-bottom:12px; border-bottom: 1px solid #334155; padding-bottom: 5px;">
            SISTEMA DE PROBABILIDAD FIJA - ${fechaActual}
        </div>
        ${card(t1, "TRIPLETA MAESTRA", "MAYOR FRECUENCIA REAL")}
        ${card(t2, "TRIPLETA REFUERZO", "ANÁLISIS DE ARRASTRE")}
        ${card(t3, "TRIPLETA SISTEMA", "CIERRE DE SECTORES")}
    `;
}

function card(nums, tit, sub) {
    return `<div class="tripleta-card">
        <span class="badge-tripleta">${tit}</span>
        <div class="nums-tripleta">
            <div class="num-circle">${nums[0]}</div>
            <div class="num-circle">${nums[1]}</div>
            <div class="num-circle">${nums[2]}</div>
        </div>
        <small style="color:#38bdf8; font-size: 0.6rem;">${sub}</small>
    </div>`;
}

// --- 📊 CONTROL DE REGISTRO E HISTORIAL (SIN CAMBIOS) ---
async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Marca la hora");
    const ani = listaAnimales.find(a => a.n === val.padStart(2, '0'));
    if(!ani) return alert("Número no válido");
    const fecha = document.getElementById('fecha-analisis').value;
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false});
    if(!error) { 
        historialGlobal = data; 
        actualizarTodo(); 
    }
}

function actualizarTodo() {
    renderPanelHoras();
    renderHistorial();
    renderMapa();
    generarTripletasInteligentes();
}

function renderPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const f = document.getElementById('fecha-analisis').value;
    if(!p) return;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const r = historialGlobal.find(x => x.fecha === f && x.hora === h);
        const d = document.createElement('div');
        d.className = `hora-box ${r ? 'jugado' : ''} ${h === horaActiva ? 'active-select' : ''}`;
        d.innerHTML = r ? `${h}<br><b>${r.num}</b>` : h;
        d.onclick = () => { horaActiva = h; renderPanelHoras(); };
        p.appendChild(d);
    });
}

function renderHistorial() {
    const tabla = document.getElementById('lista-historial');
    const fechaBuscada = document.getElementById('fecha-busqueda-historial').value;
    if(!tabla) return;
    tabla.innerHTML = '';
    const filtrado = historialGlobal
        .filter(r => r.fecha === fechaBuscada)
        .sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num.toString().padStart(2, '0'));
        tabla.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td><td class="${r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul'}">${r.tipo}</td></tr>`;
    });
}

function renderMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    const fecha = document.getElementById('fecha-analisis').value;
    if(!mapa) return;
    mapa.innerHTML = '';
    const hoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);
    ['A','B','C','D','E','F'].forEach(s => {
        let html = `<div class="sector-block"><div class="sector-header">SECTOR ${s}</div><div class="sector-grid">`;
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            html += `<div class="mini-animal ${hoy.includes(ani.n) ? 'sensor-fijo' : ani.c.toLowerCase()}">${ani.n}</div>`;
        });
        mapa.innerHTML += html + `</div></div>`;
    });
}

function openTab(e, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(n).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
}

async function init() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    document.getElementById('fecha-analisis').onchange = actualizarTodo;
    document.getElementById('fecha-busqueda-historial').onchange = renderHistorial;
    await cargarDatos();
    const grid = document.getElementById('grid-container');
    listaAnimales.forEach(a => {
        const b = document.createElement('div');
        b.className = "animal-btn";
        b.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        b.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        grid.appendChild(b);
    });
}
window.onload = init;
