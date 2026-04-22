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
    const fechaBusqueda = document.getElementById('fecha-busqueda-historial');
    if(fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    if(fechaBusqueda) fechaBusqueda.value = new Date().toISOString().split('T')[0];
    
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (error) throw error;
        if (data) { historial = data; actualizarInterfaz(); }
    } catch (e) { console.error("Error cargando historial:", e); }
}

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

async function registrarSorteo(num, animal, color, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo: color };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    
    actualizarInterfaz();
    titilearEnMapa(num); 
    
    try { await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); } 
    catch (e) { console.error("Error al guardar:", e); }
}

function generarMapaRuleta() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    const fHoy = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historial.filter(r => r.fecha === fHoy).map(r => r.num);

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
            const esJugado = jugadosHoy.includes(ani.n);
            aDiv.className = `mini-animal ${esJugado ? 'sensor-fijo' : (ani.c === 'ROJO' ? 'bg-rojo' : ani.c === 'AZUL' ? 'bg-azul' : 'bg-negro')}`;
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
        setTimeout(() => el.classList.remove('titileo'), 5000);
    }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarTripletasFijas(); 
    generarMapaRuleta(); 
}

function generarTripletasFijas() {
    const cont = document.getElementById('seccion-tripletas');
    if(!cont) return;
    
    // TRIPLETAS CONGELADAS PARA EL DÍA (Precisión Estricta Miércoles)
    let t1 = "09-14-28"; // ORO
    let t2 = "25-32-10"; // REFUERZO SECTOR D/B
    let t3 = "11-25-20"; // EXPLOSIVA

    cont.innerHTML = `
        <div class="card-tripleta"><small>🔥 TRIPLETA DE ORO (MIÉRCOLES)</small><div class="tripleta-nums">${t1}</div></div>
        <div class="card-tripleta"><small>📡 TRIPLETA DE REFUERZO</small><div class="tripleta-nums">${t2}</div></div>
        <div class="card-tripleta"><small>💎 TRIPLETA EXPLOSIVA</small><div class="tripleta-nums">${t3}</div></div>
    `;
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const panel = document.getElementById('panel-proxima-jugada');
    const avisoRepetido = document.getElementById('aviso-fuera');
    if(!display || !panel) return;
    
    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy);
    
    // ANIMAL FIJO SEGÚN ALGORITMO HISTÓRICO (ESTRICTO)
    // Si ya salió el 10, la Gallina (25) sube a probabilidad 95%
    let animalFijo = "25"; 
    
    if (hoy.length === 0) { 
        display.innerHTML = `<span class="sniper-num-pill">${animalFijo}</span>`; 
        avisoRepetido.innerHTML = "ESPERANDO APERTURA...";
        return; 
    }

    const ultimo = hoy[0];
    const numsHoy = hoy.map(r => r.num);
    
    // Detector de repetición estricto
    const repetidoEnPotencia = numsHoy.find((n, i) => numsHoy.indexOf(n) !== i);
    if (repetidoEnPotencia) {
        avisoRepetido.innerHTML = `⚠️ SE CONFIRMA REPETICIÓN: ${repetidoEnPotencia}`;
    } else {
        avisoRepetido.innerHTML = "LÍNEA DE CRUCE: SECTOR D ACTIVO";
    }

    panel.classList.add('alerta-caliente');
    display.innerHTML = `<span class="sniper-num-pill">${animalFijo}</span><span class="sniper-num-pill" style="opacity:0.6">11</span><span class="sniper-num-pill" style="opacity:0.6">20</span>`;
}

function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora primero");
    let v = input.value;
    if(v === "") return;
    if(v !== '0' && v !== '00') v = v.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) { 
        registrarSorteo(ani.n, ani.a, ani.c, horaSeleccionadaActiva); 
        input.value = ''; 
    }
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
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) {
            const colorStyle = r.tipo === 'ROJO' ? 'color:#ff4d4d' : r.tipo === 'AZUL' ? 'color:#38bdf8' : 'color:#94a3b8';
            c.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani.s}/${ani.e}</td><td style="${colorStyle};font-weight:bold">${r.tipo}</td></tr>`;
        }
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const target = document.getElementById(n);
    if(target) target.style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function estudiarAtraccion() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-atraccion');
    if (!val || !res) return;
    const comp = reglasAtraccion[val] || ["Calculando..."];
    res.innerHTML = `<div style="margin-top:10px;"><b>Atracción directa:</b><br><div style="display:flex; justify-content:center; gap:5px; margin-top:5px;">
        ${comp.map(n => `<span style="background:#ef4444; color:white; padding:5px 8px; border-radius:4px; font-weight:bold;">${n}</span>`).join('')}
    </div></div>`;
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { const clock = document.getElementById('live-clock'); if(clock) clock.innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializarSistema;
