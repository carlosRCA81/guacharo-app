const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

const reglasAtraccion = {
    '35': ['25', '08', '09'], '00': ['29', '26', '01'], '0': ['09'], '20': ['17'], '25': ['07'],
    '07': ['25', '11', '20'], '03': ['30', '36', '26'], '30': ['03', '36', '26'], '36': ['03', '30', '26'],
    '05': ['09', '12', '18', '34', '19'], '09': ['05', '12', '18'], '12': ['05', '09', '18'], '34': ['05', '19']
};

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
        if (data) { historial = data; actualizarInterfaz(); }
    } catch (e) { }
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

async function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo: color };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    actualizarInterfaz();
    try { await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); } catch (e) { }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarTripletasFijas();
}

function generarTripletasFijas() {
    const cont = document.getElementById('seccion-tripletas');
    if(!cont) return;
    const t1 = ["05", "12", "25"];
    const t2 = ["07", "20", "17"];
    const t3 = ["09", "33", "02"];
    cont.innerHTML = `
        <div class="card-tripleta"><small>🔥 TRIPLETA FIJA</small><div class="tripleta-nums">${t1.join('-')}</div></div>
        <div class="card-tripleta"><small>🎯 SECTOR CALIENTE</small><div class="tripleta-nums">${t2.join('-')}</div></div>
        <div class="card-tripleta"><small>💎 JUGADA MAESTRA</small><div class="tripleta-nums">${t3.join('-')}</div></div>
    `;
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const panel = document.getElementById('panel-proxima-jugada');
    const titulo = document.getElementById('sniper-titulo');
    const aviso = document.getElementById('aviso-fuera');
    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    if (hoy.length === 0) {
        display.innerHTML = "ESPERANDO DATOS";
        return;
    }

    const ultimo = hoy[hoy.length - 1];
    let sugeridos = reglasAtraccion[ultimo.num] || [];
    
    if (ultimo.hora === "7:00 PM") {
        titulo.innerText = "🌅 PROYECCIÓN MAÑANA";
        sugeridos = ["01", "10", "36"];
        panel.classList.remove('alerta-caliente');
    } else if (sugeridos.length > 0) {
        titulo.innerText = "🔥 FAMILIA DETECTADA";
        panel.classList.add('alerta-caliente');
        try { document.getElementById('snd-alerta').play(); } catch(e){}
    } else {
        titulo.innerText = "🎯 PRÓXIMA JUGADA";
        sugeridos = [(parseInt(ultimo.num)+1).toString().padStart(2,'0'), "11", "25"];
        panel.classList.remove('alerta-caliente');
    }

    display.innerHTML = sugeridos.map(n => `<span style="background:#1e293b; padding: 4px 10px; border-radius: 4px; border: 1px solid #fbbf24; margin:2px;">${n}</span>`).join('');
    
    const bloqueado = hoy.length >= 2 ? hoy[hoy.length - 2].num : "--";
    aviso.innerHTML = `🚫 NÚMERO FUERA: ${bloqueado}`;
}

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora");
    let v = document.getElementById('num-rapido').value;
    if(v !== '0' && v !== '00') v = v.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) registrarSorteo(ani.n, ani.a, ani.c, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = "animal-btn";
        d.style.borderLeft = `4px solid ${a.c === 'ROJO' ? '#ef4444' : a.c === 'AZUL' ? '#38bdf8' : '#000'}`;
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function estudiarAtraccion() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-atraccion');
    if (!val) return res.innerHTML = "";
    const comp = reglasAtraccion[val] || ["Sin datos fijos"];
    res.innerHTML = `<div style="margin-top:10px;"><b>Atracción directa:</b><br><div style="display:flex; justify-content:center; gap:5px; margin-top:5px;">
        ${comp.map(n => `<span style="background:#ef4444; padding:5px 10px; border-radius:4px; font-weight:bold;">${n}</span>`).join('')}
    </div></div>`;
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const f = document.getElementById('fecha-busqueda-historial').value;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) {
            const colorClass = r.tipo === 'ROJO' ? 'txt-rojo' : r.tipo === 'AZUL' ? 'txt-azul' : 'txt-negro';
            c.innerHTML += `<tr>
                <td>${r.hora}</td>
                <td><b style="font-size:1rem;">${r.num}</b></td>
                <td>${r.animal}</td>
                <td>${ani.s} / ${ani.e}</td>
                <td class="${colorClass}">${r.tipo}</td>
            </tr>`;
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
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializarSistema;
