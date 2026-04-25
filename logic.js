// --- CONFIGURACIÓN DE NÚCLEO ESTABLE ---
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

// --- ⏱️ RELOJ EN VIVO (FIXED) ---
function actualizarReloj() {
    const ahora = new Date();
    const tiempo = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const el = document.querySelector('h2') || document.querySelector('.reloj'); 
    if(el) el.innerText = tiempo;
}
setInterval(actualizarReloj, 1000);

// --- 🧠 ESTUDIO RÁPIDO (LÓGICA 2025) ---
function obtenerFijoIA() {
    if (historialGlobal.length < 5) return { fijo: "29", trips: ["29-05-31"] };
    const ultimoReg = historialGlobal[0]; 
    const conteo = {};
    listaAnimales.forEach(a => conteo[a.n] = 0);

    // Análisis de frecuencia después del último animal
    historialGlobal.slice(0, 1500).forEach((reg, i) => {
        if (i > 0 && historialGlobal[i-1].num === ultimoReg.num) {
            conteo[reg.num] += 1;
        }
    });

    const orden = Object.keys(conteo).sort((a, b) => conteo[b] - conteo[a]);
    return { fijo: orden[0], trips: [`${orden[0]}-${orden[1]}-${orden[2]}`] };
}

// --- 🎨 RENDERIZADO DE PANELES ---
function renderizarTodo() {
    renderizarPanelHoras();
    renderizarMapa();
    
    const estudio = obtenerFijoIA();
    const ani = listaAnimales.find(a => a.n === estudio.fijo);

    // Sniper
    const sniper = document.querySelector('.sniper-display') || document.getElementById('alerta-cuantica-panel');
    if(sniper) {
        sniper.innerHTML = `<div style="text-align:center; padding:10px;">
            <div style="font-size:4rem; color:white; font-weight:bold;">${estudio.fijo}</div>
            <div style="color:#fbbf24; font-size:1.5rem;">${ani ? ani.a : ''}</div>
            <small style="color:#38bdf8;">PROBABILIDAD FIJA (ESTUDIO 2025)</small>
        </div>`;
    }
}

function renderizarMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    const fecha = document.getElementById('fecha-analisis').value;
    const jugados = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);

    ['A','B','C','D','E','F'].forEach(s => {
        const div = document.createElement('div');
        div.className = 'sector-block';
        div.innerHTML = `<div class="sector-header">SECTOR ${s}</div>`;
        const grid = document.createElement('div');
        grid.className = 'sector-grid';
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            const span = document.createElement('div');
            const esFijo = jugados.includes(ani.n);
            span.className = `mini-animal ${esFijo ? 'sensor-fijo' : (ani.c === 'ROJO' ? 'rojo' : 'negro')}`;
            span.innerText = ani.n;
            grid.appendChild(span);
        });
        div.appendChild(grid);
        mapa.appendChild(div);
    });
}

function renderizarPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const fecha = document.getElementById('fecha-analisis').value;
    if(!p) return;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const reg = historialGlobal.find(x => x.fecha === fecha && x.hora === h);
        const div = document.createElement('div');
        div.className = `hora-box ${reg ? 'jugado' : ''} ${h === horaActiva ? 'active-select' : ''}`;
        div.innerHTML = reg ? `${h}<br><b>${reg.num}</b>` : h;
        div.onclick = () => { horaActiva = h; renderizarPanelHoras(); };
        p.appendChild(div);
    });
}

// --- 🚀 ACCIONES DE CARGA ---
async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos')
        .select('*')
        .gte('fecha', '2025-01-01')
        .order('fecha', {ascending: false});
    if(!error) { 
        historialGlobal = data; 
        renderizarTodo(); 
    }
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return;
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    const fecha = document.getElementById('fecha-analisis').value;
    
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

window.onload = async () => {
    const inputFecha = document.getElementById('fecha-analisis');
    if(inputFecha) inputFecha.value = new Date().toISOString().split('T')[0];
    actualizarReloj();
    await cargarDatos();
    
    // Generar botones si no existen
    const cont = document.getElementById('grid-container');
    if(cont && cont.innerHTML === "") {
        listaAnimales.forEach(a => {
            const btn = document.createElement('div');
            btn.className = "animal-btn";
            btn.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
            btn.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
            cont.appendChild(btn);
        });
    }
};
