// --- NÚCLEO DE ESTUDIO TUAZAR (REPARADO Y LIGERO) ---
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

// --- RELOJ EN VIVO ---
function actualizarReloj() {
    const ahora = new Date();
    const tiempo = ahora.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const el = document.getElementById('reloj-ia');
    if(el) el.innerText = tiempo;
}
setInterval(actualizarReloj, 1000);

// --- ESTUDIO AUTOMÁTICO SIN BLOQUEO ---
function motorProbabilidadIA() {
    if (historialGlobal.length === 0) return { unico: "17", tripletas: ["17-31-08"] };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        // Solo estudia los últimos 1500 sorteos para no congelar la web
        for(let i=0; i < Math.min(historialGlobal.length - 1, 1500); i++) {
            if (historialGlobal[i].num === ultimo) {
                pesos[historialGlobal[i+1].num] += 50;
            }
        }
    }

    const orden = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    return { 
        unico: orden[0] || "05", 
        tripletas: [`${orden[0]}-${orden[1]}-${orden[2]}`, `${orden[1]}-${orden[2]}-${orden[3]}`] 
    };
}

// --- RENDERIZADO DE SECTORES (MAPA) ---
function renderizarMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    const fecha = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);

    ['A','B','C','D','E','F'].forEach(s => {
        const secDiv = document.createElement('div');
        secDiv.className = 'sector-block';
        secDiv.innerHTML = `<div class="sector-header">SECTOR ${s}</div><div class="sector-grid" id="grid-${s}"></div>`;
        mapa.appendChild(secDiv);

        const grid = secDiv.querySelector(`#grid-${s}`);
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            const item = document.createElement('div');
            const isOut = jugadosHoy.includes(ani.n);
            item.className = `mini-animal ${isOut ? 'sensor-fijo' : (ani.c === 'ROJO' ? 'rojo' : 'negro')}`;
            item.innerText = ani.n;
            grid.appendChild(item);
        });
    });
}

// --- RECARGA DE TODA LA DATA ---
async function actualizarTodo() {
    renderizarPanelHoras();
    renderizarMapa();
    renderizarHistorial();
    
    // Sniper y Alerta
    const data = motorProbabilidadIA();
    const alertCont = document.getElementById('alerta-cuantica-panel');
    if(alertCont) {
        alertCont.innerHTML = `<div style="text-align:center; padding:15px; background:#020617; border:2px solid #38bdf8; border-radius:12px;">
            <div style="font-size:4rem; color:white; font-weight:900;">${data.unico}</div>
            <div style="color:#38bdf8; font-weight:bold;">${(listaAnimales.find(a=>a.n===data.unico)||{}).a || ''}</div>
        </div>`;
    }

    const tripCont = document.getElementById('seccion-tripletas');
    if(tripCont) {
        tripCont.innerHTML = `<h3 style="color:#fbbf24; text-align:center;">🎯 TRIPLETAS IA</h3>` + 
        data.tripletas.map(t => `<div style="background:#1e293b; color:white; padding:10px; margin:5px; border-radius:8px; text-align:center; font-weight:bold; border-left:4px solid #f59e0b;">${t}</div>`).join('');
    }
}

// --- FUNCIONES BASE ---
async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false}).limit(2000);
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Marca la hora primero");
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    const fecha = document.getElementById('fecha-analisis').value;
    
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
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

function generarBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = "animal-btn";
        btn.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        btn.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        cont.appendChild(btn);
    });
}

window.onload = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    await cargarDatos();
    generarBotones();
};
