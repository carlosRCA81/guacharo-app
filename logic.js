// CONFIGURACIÓN DE BASE DE DATOS (INTACTA)
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LISTA DE ANIMALES Y SECTORES (INTACTA)
const listaAnimales = [
    {n:'0', a:'DELFIN', c:'AZUL', s:'A', e:'Agua'}, {n:'00', a:'BALLENA', c:'AZUL', s:'D', e:'Agua'},
    {n:'01', a:'CARNERO', c:'ROJO', s:'D', e:'Tierra'}, {n:'02', a:'TORO', c:'NEGRO', s:'A', e:'Tierra'},
    {n:'03', a:'CIEMPIES', c:'ROJO', s:'C', e:'Tierra'}, {n:'04', a:'ALACRAN', c:'ROJO', s:'F', e:'Tierra'},
    {n:'05', a:'LEON', c:'ROJO', s:'C', e:'Tierra'}, {n:'06', a:'RANA', c:'NEGRO', s:'F', e:'Agua'},
    {n:'07', a:'PERICO', c:'ROJO', s:'B', e:'Aire'}, {n:'08', a:'RATON', c:'NEGRO', s:'E', e:'Tierra'},
    {n:'09', a:'AGUILA', c:'ROJO', s:'A', e:'Aire'}, {n:'10', a:'TIGRE', c:'NEGRO', s:'D', e:'Tierra'},
    {n:'11', a:'GATO', c:'NEGRO', s:'B', e:'Tierra'}, {n:'12', a:'CABALLO', c:'ROJO', s:'E', e:'Tierra'},
    {n:'13', a:'MONO', c:'NEGRO', s:'D', e:'Tierra'}, {n:'14', a:'PALOMA', c:'ROJO', s:'A', e:'Aire'},
    {n:'15', a:'ZORRO', c:'NEGRO', s:'C', e:'Tierra'}, {n:'16', a:'OSO', c:'ROJO', s:'F', e:'Tierra'},
    {n:'17', a:'PAVO', c:'NEGRO', s:'B', e:'Aire'}, {n:'18', a:'BURRO', c:'ROJO', s:'E', e:'Tierra'},
    {n:'19', a:'CHIVO', c:'ROJO', s:'E', e:'Tierra'}, {n:'20', a:'COCHINO', c:'NEGRO', s:'B', e:'Tierra'},
    {n:'21', a:'GALLO', c:'ROJO', s:'F', e:'Aire'}, {n:'22', a:'CAMELLO', c:'NEGRO', s:'C', e:'Tierra'},
    {n:'23', a:'CEBRA', c:'ROJO', s:'F', e:'Tierra'}, {n:'24', a:'IGUANA', c:'NEGRO', s:'C', e:'Tierra'},
    {n:'25', a:'GALLINA', c:'ROJO', s:'D', e:'Aire'}, {n:'26', a:'VACA', c:'NEGRO', s:'A', e:'Tierra'},
    {n:'27', a:'PERRO', c:'ROJO', s:'D', e:'Tierra'}, {n:'28', a:'ZAMURO', c:'NEGRO', s:'A', e:'Aire'},
    {n:'29', a:'ELEFANTE', c:'NEGRO', s:'E', e:'Tierra'}, {n:'30', a:'CAIMAN', c:'ROJO', s:'B', e:'Agua'},
    {n:'31', a:'LAPA', c:'NEGRO', s:'E', e:'Tierra'}, {n:'32', a:'ARDILLA', c:'ROJO', s:'B', e:'Tierra'},
    {n:'33', a:'PESCADO', c:'NEGRO', s:'F', e:'Agua'}, {n:'34', a:'VENADO', c:'ROJO', s:'C', e:'Tierra'},
    {n:'35', a:'JIRAFA', c:'NEGRO', s:'A', e:'Tierra'}, {n:'36', a:'CULEBRA', c:'ROJO', s:'D', e:'Tierra'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

// TUS REGLAS DE ORO (INTACTAS)
const reglasAtraccion = {
    '05': ['12', '18', '09', '34', '19', '11'], '09': ['05', '12', '18', '14', '28'],
    '36': ['03', '30', '26', '24', '13'], '25': ['07', '14', '21', '09'],
    '00': ['29', '26', '01', '22', '35'], '12': ['05', '09', '18', '11', '13'],
    '20': ['17', '11', '08', '07'], '30': ['03', '36', '26', '06', '00'],
    '07': ['25', '11', '20', '14', '17'], '35': ['25', '08', '09', '26', '29'],
    '11': ['07', '20', '17', '12', '05'], '10': ['08', '13', '01', '00', '25'], 
    '14': ['09', '28', '07', '18', '32']
};

async function inicializarSistema() {
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (data) { historial = data; actualizarInterfaz(); }
    } catch (e) { console.error(e); }
}

// CORRECCIÓN CLAVE: Función de mapa que SI reconoce los anotados
function generarMapaRuleta() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    
    const fHoy = document.getElementById('fecha-analisis').value;
    // Extraemos solo los números que ya tienen resultado hoy
    const numerosYaJugados = historial.filter(r => r.fecha === fHoy).map(r => r.num);

    const sectores = ['A', 'B', 'C', 'D', 'E', 'F'];
    sectores.forEach(sec => {
        const sDiv = document.createElement('div');
        sDiv.className = 'sector-block';
        sDiv.innerHTML = `<div class="sector-header">SEC ${sec}</div>`;
        const sGrid = document.createElement('div');
        sGrid.className = 'sector-grid';

        listaAnimales.filter(a => a.s === sec).forEach(ani => {
            const aDiv = document.createElement('div');
            aDiv.id = `mapa-${ani.n}`;
            
            // Si el número está en la lista de jugados, le ponemos el color sensor
            const esActivo = numerosYaJugados.includes(ani.n) ? 'sensor-fijo' : '';
            
            aDiv.className = `mini-animal ${ani.c === 'ROJO' ? 'bg-rojo' : ani.c === 'AZUL' ? 'bg-azul' : 'bg-negro'} ${esActivo}`;
            aDiv.innerHTML = ani.n;
            sGrid.appendChild(aDiv);
        });
        sDiv.appendChild(sGrid);
        mapa.appendChild(sDiv);
    });
}

function titilearEnMapa(num) {
    const el = document.getElementById(`mapa-${num}`);
    if(el) {
        el.classList.add('titileo');
        setTimeout(() => {
            el.classList.remove('titileo');
            el.classList.add('sensor-fijo');
        }, 5000);
    }
}

async function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo: color };
    
    // Actualizamos historial local inmediatamente
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    
    actualizarInterfaz();
    titilearEnMapa(num); 
    
    try { await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); } 
    catch (e) { console.error(e); }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarTripletasFijas();
    generarMapaRuleta(); // <--- Esto asegura que los colores se mantengan
}

// RESTO DE FUNCIONES (INTACTAS)
function generarPanelDiario() {
    const p = document.getElementById('panel-diario-sorteos');
    if(!p) return;
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

function generarTripletasFijas() {
    const cont = document.getElementById('seccion-tripletas');
    if(!cont) return;
    cont.innerHTML = `
        <div class="card-tripleta"><small>🔥 TRIPLETA DE ORO (DEUDA 21/04)</small><div class="tripleta-nums">18-09-25</div></div>
        <div class="card-tripleta"><small>🎯 CRUCE DE RULETA PROFESIONAL</small><div class="tripleta-nums">00-13-01</div></div>
        <div class="card-tripleta"><small>💎 JUGADA MAESTRA GEOLOCALIZADA</small><div class="tripleta-nums">07-32-11</div></div>
    `;
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    if(!display) return;
    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy);
    if (hoy.length === 0) { display.innerHTML = "ESPERANDO DATOS"; return; }
    const ultimo = hoy[0];
    let sug = reglasAtraccion[ultimo.num] || [];
    display.innerHTML = sug.slice(0,3).map(n => `<span class="sniper-num-pill">${n}</span>`).join('');
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = "animal-btn";
        d.style.borderLeft = `4px solid ${a.c === 'ROJO' ? '#ef4444' : a.c === 'AZUL' ? '#38bdf8' : '#475569'}`;
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const fInput = document.getElementById('fecha-busqueda-historial');
    if(!c || !fInput) return;
    const f = fInput.value;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
        const colorStyle = r.tipo === 'ROJO' ? 'color:#ff4d4d' : r.tipo === 'AZUL' ? 'color:#38bdf8' : 'color:#94a3b8';
        c.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

// RELOJ Y RESET DE LAS 8:00 PM
setInterval(() => { 
    const ahora = new Date();
    const clock = document.getElementById('live-clock'); 
    if(clock) clock.innerText = ahora.toLocaleTimeString(); 
    if(ahora.getHours() === 20 && ahora.getMinutes() === 0 && ahora.getSeconds() === 0) {
        document.querySelectorAll('.mini-animal').forEach(el => el.classList.remove('sensor-fijo'));
        generarMapaRuleta();
    }
}, 1000);

window.onload = inicializarSistema;
