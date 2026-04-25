// --- CONFIGURACIÓN DE CONEXIÓN ESTABLE ---
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

// --- MOTOR DE ESTUDIO (LIMITADO A 2025-2026 PARA VELOCIDAD) ---
function motorPrediccionFija() {
    if (historialGlobal.length === 0) return { fijo: "12", tripletas: ["12-36-02"] };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const resultadosHoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    if (resultadosHoy.length > 0) {
        const ultimo = resultadosHoy[resultadosHoy.length - 1].num;
        // Análisis de arrastre histórico
        for(let i=0; i < historialGlobal.length - 1; i++) {
            if (historialGlobal[i+1].num === ultimo) {
                pesos[historialGlobal[i].num] += 50;
            }
        }
    }

    const orden = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    const fijo = orden[0] || "00";
    return {
        fijo: fijo,
        tripletas: [`${fijo}-${orden[1] || '01'}-${orden[2] || '02'}`, `${orden[1] || '03'}-${orden[2] || '04'}-${orden[3] || '05'}`]
    };
}

// --- FUNCIONES DE INTERFAZ (TODAS ACTIVAS) ---
async function actualizarTodo() {
    renderizarPanelHoras();
    renderizarMapa();
    renderizarHistorial();
    
    const data = motorPrediccionFija();
    const aniFijo = listaAnimales.find(a => a.n === data.fijo);

    // Panel Sniper e Indicadores
    const sniperCont = document.getElementById('alerta-cuantica-panel');
    if(sniperCont) {
        sniperCont.innerHTML = `
            <div style="background:#020617; border:2px solid #38bdf8; border-radius:15px; padding:15px; text-align:center;">
                <div style="font-size:4.5rem; color:white; font-weight:900; line-height:1;">${data.fijo}</div>
                <div style="color:#fbbf24; font-size:1.4rem; font-weight:bold;">${aniFijo ? aniFijo.a : ''}</div>
                <small style="color:#38bdf8;">ESTUDIO 2025-2026 ACTIVO</small>
            </div>`;
    }

    const tripCont = document.getElementById('seccion-tripletas');
    if(tripCont) {
        tripCont.innerHTML = `<h3 style="color:#fbbf24; text-align:center;">🎯 TRIPLETAS FIJAS</h3>` + 
            data.tripletas.map(t => `<div style="background:#1e293b; color:white; padding:12px; margin:5px; border-radius:10px; text-align:center; font-weight:bold; font-size:1.2rem; border-left:4px solid #f59e0b;">${t}</div>`).join('');
    }
}

function renderizarMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    const fecha = document.getElementById('fecha-analisis').value;
    const salieronHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);

    ['A','B','C','D','E','F'].forEach(s => {
        let html = `<div class="sector-block"><div class="sector-header">SECTOR ${s}</div><div class="sector-grid">`;
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            const activo = salieronHoy.includes(ani.n);
            html += `<div class="mini-animal ${activo ? 'sensor-fijo' : (ani.c === 'ROJO' ? 'rojo' : 'negro')}">${ani.n}</div>`;
        });
        html += `</div></div>`;
        mapa.innerHTML += html;
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

// --- REGISTRO Y CARGA ---
async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*')
        .gte('fecha', '2025-01-01') // Filtro para estudiar solo desde 2025
        .order('fecha', {ascending: false});
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Selecciona Hora");
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    const fecha = document.getElementById('fecha-analisis').value;
    
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
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
