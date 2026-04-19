const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', c:'AZUL', s:'A'}, {n:'00', a:'BALLENA', c:'AZUL', s:'D'},
    {n:'01', a:'CARNERO', c:'ROJO', s:'D'}, {n:'02', a:'TORO', c:'NEGRO', s:'A'},
    {n:'03', a:'CIEMPIES', c:'ROJO', s:'C'}, {n:'04', a:'ALACRAN', c:'ROJO', s:'F'},
    {n:'05', a:'LEON', c:'ROJO', s:'C'}, {n:'06', a:'RANA', c:'ROJO', s:'F'},
    {n:'07', a:'PERICO', c:'ROJO', s:'B'}, {n:'08', a:'RATON', c:'ROJO', s:'E'},
    {n:'09', a:'AGUILA', c:'ROJO', s:'A'}, {n:'10', a:'TIGRE', c:'ROJO', s:'D'},
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
    {n:'31', a:'LAPA', c:'ROJO', s:'E'}, {n:'32', a:'ARDILLA', c:'ROJO', s:'B'},
    {n:'33', a:'PESCADO', c:'NEGRO', s:'F'}, {n:'34', a:'VENADO', c:'ROJO', s:'C'},
    {n:'35', a:'JIRAFA', c:'NEGRO', s:'A'}, {n:'36', a:'CULEBRA', c:'ROJO', s:'D'}
];

// LISTA DE 12 HORAS CORREGIDA (DE 8:00 AM A 7:00 PM SIN FALTAR 2 Y 3)
const horasSorteo = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', 
    '6:00 PM', '7:00 PM'
];

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
    try {
        const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (data) { 
            historial = data; 
            actualizarInterfaz(); 
        }
    } catch (e) { console.error("Error Supabase"); }
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

function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo: color };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    actualizarInterfaz();
    _supabase.from('historial_sorteos').upsert(nuevo).then();
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const panel = document.getElementById('panel-proxima-jugada');
    const titulo = document.getElementById('sniper-titulo');
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    if (hoy.length === 0) return;
    const ultimo = hoy[hoy.length - 1];
    let sugeridos = [];
    let esAlertaCaliente = false;

    const familias = {
        '35': ['08', '12', '09'], '25': ['07', '21', '10'], '00': ['26', '29', '01'],
        '03': ['30', '36', '24'], '36': ['01', '10', '25'], '08': ['12', '05', '0']
    };

    if (familias[ultimo.num]) {
        sugeridos = familias[ultimo.num];
        esAlertaCaliente = true;
        titulo.innerText = "🔥 FAMILIA DETECTADA";
        try { document.getElementById('snd-alerta').play(); } catch(e){}
    } else {
        let n = parseInt(ultimo.num);
        sugeridos = [(n + 1).toString().padStart(2, '0'), (n === 0 ? 36 : n - 1).toString().padStart(2, '0'), '11'];
        titulo.innerText = "🎯 Próxima Jugada Calculada";
    }

    panel.className = `panel-sniper ${esAlertaCaliente ? 'alerta-caliente' : ''}`;
    display.innerHTML = sugeridos.map(n => `<span style="background:#0f172a; padding: 5px 12px; border-radius: 5px; border: 1px solid white; color:white; font-weight:bold; margin-right:5px;">${n}</span>`).join('');
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = 'animal-btn';
        d.style.borderLeft = `4px solid ${a.c === 'ROJO' ? '#ef4444' : a.c === 'NEGRO' ? '#000' : '#38bdf8'}`;
        d.innerHTML = `<b>${a.n}</b><br>${a.a}<br><small>${a.s}</small>`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora primero");
    let v = document.getElementById('num-rapido').value;
    if(v !== '0' && v !== '00') v = v.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) registrarSorteo(ani.n, ani.a, ani.c, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const f = document.getElementById('fecha-busqueda-historial').value;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) {
            c.innerHTML += `<tr><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td><span class="badge ${ani.c === 'ROJO' ? 'bg-rojo' : ani.c === 'NEGRO' ? 'bg-negro' : 'bg-azul'}">${ani.c}</span></td></tr>`;
        }
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
    s.innerHTML = '<option value="">-- Selecciona Animal --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { 
    const c = document.getElementById('live-clock');
    if(c) c.innerText = new Date().toLocaleTimeString(); 
}, 1000);

window.onload = inicializarSistema;
