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

const reglasAtraccion = {
    '00': ['29', '26', '01'], '07': ['25', '14', '17'], '12': ['05', '09', '18'], 
    '14': ['09', '28', '07'], '36': ['03', '30', '26'], '05': ['12', '18', '09']
};

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

async function inicializarSistema() {
    document.getElementById('fecha-analisis').value = new Date().toISOString().split('T')[0];
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
    if (data) { historial = data; actualizarInterfaz(); }
}

function registrarPorNumero() {
    const val = document.getElementById('num-rapido').value.padStart(2, '0').replace('000','00');
    const animal = listaAnimales.find(a => a.n === val);
    if (animal && horaSeleccionadaActiva) registrarSorteo(animal.n, animal.a, animal.c, horaSeleccionadaActiva);
}

async function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num, animal, tipo: color };
    await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
    document.getElementById('snd-alerta').play();
    await cargarHistorialRemoto();
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarMapaRuleta();
    calcularTripletasIA();
}

function calcularTripletasIA() {
    const cont = document.getElementById('seccion-tripletas');
    const hoy = historial.filter(r => r.fecha === document.getElementById('fecha-analisis').value);
    const jugados = hoy.map(r => r.num);
    const faltantes = listaAnimales.filter(a => !jugados.includes(a.n));
    
    cont.innerHTML = `
        <div class="card-tripleta"><small>🔥 DEUDA DEL DÍA</small><div class="tripleta-nums">${faltantes[0]?.n || '05'}-${faltantes[1]?.n || '17'}-${faltantes[2]?.n || '25'}</div></div>
        <div class="card-tripleta"><small>🎯 CRUCE PROFESIONAL</small><div class="tripleta-nums">00-13-29</div></div>
    `;
}

function generarMapaRuleta() {
    const mapa = document.getElementById('mapa-ruleta');
    mapa.innerHTML = '';
    const hoy = historial.filter(r => r.fecha === document.getElementById('fecha-analisis').value).map(r => r.num);
    ['A','B','C','D','E','F'].forEach(s => {
        let div = `<div class="sector-block"><div class="sector-header">SEC ${s}</div><div class="sector-grid">`;
        listaAnimales.filter(a => a.s === s).forEach(a => {
            div += `<div class="mini-animal ${hoy.includes(a.n) ? 'sensor-fijo' : (a.c==='ROJO'?'bg-rojo':a.c==='AZUL'?'bg-azul':'bg-negro')}">${a.n}</div>`;
        });
        mapa.innerHTML += div + `</div></div>`;
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

function actualizarTabla() {
    const f = document.getElementById('fecha-busqueda-historial').value || document.getElementById('fecha-analisis').value;
    const body = document.getElementById('lista-historial');
    body.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
        body.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${listaAnimales.find(a=>a.n===r.num).s}</td><td style="color:${r.tipo==='ROJO'?'#ef4444':r.tipo==='AZUL'?'#38bdf8':'#fff'}">${r.tipo}</td></tr>`;
    });
}

function actualizarJugadaSniper() {
    const hoy = historial.filter(r => r.fecha === document.getElementById('fecha-analisis').value);
    if (hoy.length > 0) {
        const ult = hoy[0].num;
        const sugeridos = reglasAtraccion[ult] || ['05', '17', '25'];
        document.getElementById('numeros-sugeridos-directos').innerHTML = sugeridos.map(n => `<span class="sniper-num-pill">${n}</span>`).join('');
    }
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = "animal-btn";
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializarSistema;
