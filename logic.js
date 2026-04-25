// --- CONFIGURACIÓN DE CONEXIÓN ---
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

// --- 🔥 NUEVO MOTOR AUTÓNOMO DE PREDICCIÓN FIJA ---
function motorProbabilidadMaestra() {
    if (historialGlobal.length === 0) return { sugeridos: ["22", "31", "27", "35"], unico: "22", tripletas: [] };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    // 1. ESCANEO PROFUNDO (Deep History Scan 2019-2026)
    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        historialGlobal.forEach((reg, i) => {
            if (reg.num === ultimo && i > 0) {
                const siguienteHistorico = historialGlobal[i-1].num;
                pesos[siguienteHistorico] += 60; // Máximo peso al patrón histórico
            }
        });
    }

    // 2. ANÁLISIS DE PRESIÓN DE SECTORES (Evita Monotonía)
    let conteoSectores = { 'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'F':0 };
    hoy.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) conteoSectores[ani.s]++;
    });
    const sectorDeuda = Object.keys(conteoSectores).reduce((a, b) => conteoSectores[a] < conteoSectores[b] ? a : b);
    listaAnimales.filter(a => a.s === sectorDeuda).forEach(a => pesos[a.n] += 45);

    const ordenados = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    
    // 3. GENERACIÓN DE TRIPLETAS FIJAS (Lógica de Arrastre Triple)
    const t1 = `${ordenados[0]}-${ordenados[1]}-${ordenados[2]}`;
    const t2 = `${ordenados[1]}-${ordenados[3]}-${ordenados[4] || '11'}`;
    const t3 = `${ordenados[0]}-${ordenados[2]}-${ordenados[5] || '33'}`;

    return { 
        sugeridos: ordenados.slice(0, 6), 
        unico: ordenados[0], 
        tripletas: [t1, t2, t3] 
    };
}

// --- PANEL VISUAL AUTÓNOMO ---
function renderizarAlertaCuantica() {
    const contenedor = document.getElementById('alerta-cuantica-panel');
    const datos = motorProbabilidadMaestra();
    const ani = listaAnimales.find(a => a.n === datos.unico);
    
    contenedor.innerHTML = `
        <div style="background: #020617; border: 2px solid #38bdf8; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 0 20px #38bdf844;">
            <small style="color: #38bdf8; letter-spacing: 2px;">IA: ANÁLISIS 2019-2026 ACTIVO</small>
            <div style="font-size: 5rem; font-weight: 900; color: white; line-height: 1;">${datos.unico}</div>
            <div style="font-size: 1.5rem; color: #fbbf24; font-weight: bold;">${ani ? ani.a : ''}</div>
            <div style="margin-top: 10px; color: #94a3b8; font-size: 0.7rem;">Siguiente Sorteo: ALTA PROBABILIDAD</div>
        </div>
    `;
}

function ejecutarSniper() {
    const tripCont = document.getElementById('seccion-tripletas');
    const datos = motorProbabilidadMaestra();
    
    let html = `<h3 style="color:#fbbf24; text-align:center;">🎯 TRIPLETAS FIJAS IA</h3>`;
    datos.tripletas.forEach(t => {
        html += `<div style="background:#1e293b; color:white; padding:12px; margin:8px; border-radius:10px; font-weight:900; font-size:1.4rem; text-align:center; border-left:5px solid #f59e0b;">${t}</div>`;
    });
    if(tripCont) tripCont.innerHTML = html;
}

// --- ARRASTRE DE CARLOS AUTOMÁTICO ---
function calcularArrastreCarlos() {
    const datos = motorProbabilidadMaestra();
    const hoy = historialGlobal.filter(r => r.fecha === document.getElementById('fecha-analisis').value);
    if(hoy.length === 0) return;
    
    document.getElementById('arrastre-union').innerText = "T-" + hoy[0].num.slice(-1);
    document.getElementById('arrastre-suma').innerText = "VÍNCULO DIRECTO";
    document.getElementById('arrastre-animal').innerText = datos.unico + " - " + (listaAnimales.find(a => a.n === datos.unico).a);
}

// --- FUNCIONES DE REGISTRO Y CARGA ---
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

function actualizarTodo() {
    renderizarPanelHoras();
    renderizarHistorial();
    renderizarMapa();
    ejecutarSniper();
    calcularArrastreCarlos();
    renderizarAlertaCuantica();
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

// El resto de funciones (generarBotones, renderizarMapa, etc.) se mantienen igual para no romper la interfaz
function generarBotones() {
    const cont = document.getElementById('grid-container');
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = "animal-btn";
        btn.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        btn.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        cont.appendChild(btn);
    });
}

function renderizarPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const fecha = document.getElementById('fecha-analisis').value;
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

window.onload = inicializar;
