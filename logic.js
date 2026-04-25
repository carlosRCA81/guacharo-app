// --- CONFIGURACIÓN DE NÚCLEO AUTÓNOMO ---
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

// --- 🧠 MOTOR DE ESTUDIO PROFUNDO (2019-2026) ---
function motorProbabilidadMaestra() {
    if (historialGlobal.length === 0) return { sugeridos: ["11", "22", "33"], unico: "11", tripletas: [] };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        // Escaneo de historial TuAzar: qué salió después del número actual
        historialGlobal.forEach((reg, i) => {
            if (reg.num === ultimo && i > 0) {
                pesos[historialGlobal[i-1].num] += 55;
            }
        });

        // Deuda de Sectores Críticos
        let sectores = { 'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'F':0 };
        hoy.forEach(r => { const ani = listaAnimales.find(a => a.n === r.num); if(ani) sectores[ani.s]++; });
        const sectorFrio = Object.keys(sectores).reduce((a, b) => sectores[a] < sectores[b] ? a : b);
        listaAnimales.filter(a => a.s === sectorFrio).forEach(a => pesos[a.n] += 40);
    }

    const orden = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    return { 
        sugeridos: orden.slice(0, 6), 
        unico: orden[0], 
        tripletas: [`${orden[0]}-${orden[1]}-${orden[2]}`, `${orden[1]}-${orden[3]}-${orden[4]}`, `${orden[0]}-${orden[2]}-${orden[5]}`]
    };
}

// --- ACTUALIZACIÓN AUTOMÁTICA DE PANELES ---
function actualizarTodo() {
    renderizarAlertaCuantica();
    ejecutarSniper();
    renderizarMapa();
    renderizarPanelHoras();
    renderizarHistorial();
}

function renderizarAlertaCuantica() {
    const contenedor = document.getElementById('alerta-cuantica-panel');
    if(!contenedor) return;
    const d = motorProbabilidadMaestra();
    const ani = listaAnimales.find(a => a.n === d.unico);
    contenedor.innerHTML = `
        <div style="background: #020617; border: 2px solid #38bdf8; border-radius: 15px; padding: 20px; text-align: center;">
            <div style="font-size: 5rem; font-weight: 900; color: #fff;">${d.unico}</div>
            <div style="color: #38bdf8; font-size: 1.5rem; font-weight: bold;">${ani ? ani.a : 'ESPERANDO'}</div>
            <small style="color: #f59e0b;">FIJO DETECTADO POR HISTORIAL</small>
        </div>`;
}

function ejecutarSniper() {
    const tripCont = document.getElementById('seccion-tripletas');
    if(!tripCont) return;
    const d = motorProbabilidadMaestra();
    let html = `<h3 style="color:#fbbf24; text-align:center;">🎯 TRIPLETAS FIJAS</h3>`;
    d.tripletas.forEach(t => {
        html += `<div style="background:#1e293b; color:white; padding:10px; margin:5px; border-radius:8px; font-weight:bold; text-align:center; border-left:5px solid #38bdf8;">${t}</div>`;
    });
    tripCont.innerHTML = html;
}

// --- CARGA DE DATOS ---
async function inicializar() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    await cargarDatos();
    generarBotones();
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false});
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

window.onload = inicializar;
