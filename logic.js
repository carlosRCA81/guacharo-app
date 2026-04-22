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
    '10': ['08', '13', '01', '00', '25'], '12': ['05', '09', '18', '11', '13'],
    '05': ['12', '18', '09', '34', '19', '11'], '09': ['05', '12', '18', '14', '28'],
    '36': ['03', '30', '26', '24', '13'], '25': ['07', '14', '21', '09'],
    '20': ['17', '11', '08', '07'], '07': ['25', '11', '20', '14', '17'],
    '06': ['01', '04', '16', '33'], '32': ['11', '20', '14', '07']
};

async function inicializarSistema() {
    const fA = document.getElementById('fecha-analisis');
    const fH = document.getElementById('fecha-busqueda-historial');
    if(fA) fA.value = new Date().toISOString().split('T')[0];
    if(fH) fH.value = new Date().toISOString().split('T')[0];
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*');
        if (error) throw error;
        // Ordenamos el historial por fecha y luego por el índice de la hora
        historial = data.sort((a, b) => {
            if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
            return horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora);
        });
        actualizarInterfaz();
    } catch (e) { console.error("Error conexión:", e); }
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
    
    // UPSERT local
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    
    actualizarInterfaz();
    try { await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); } 
    catch (e) { console.error("Error Supabase:", e); }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    actualizarJugadaSniper();
    generarTripletasDinamicas();
    generarMapaRuleta();
}

// LOGICA ALTA DEFINICIÓN: Sniper que no repite y rastrea flujo
function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const aviso = document.getElementById('aviso-fuera');
    if(!display) return;
    
    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    if (hoy.length === 0) { display.innerHTML = "ESPERANDO APERTURA"; return; }

    const ult = hoy[0]; 
    let sugeridos = [...(reglasAtraccion[ult.num] || ["25", "11", "20"])];

    // FILTRO ANTI-REPETICIÓN: Quitamos lo que ya salió hoy
    const yaSalieron = hoy.map(r => r.num);
    sugeridos = sugeridos.filter(n => !yaSalieron.includes(n));

    // Si nos quedamos sin números por el filtro, buscamos por Sector
    if (sugeridos.length < 2) {
        const ultimoAni = listaAnimales.find(a => a.n === ult.num);
        const sectorSig = { 'A':'B', 'B':'C', 'C':'D', 'D':'E', 'E':'F', 'F':'A' }[ultimoAni.s];
        const refuerzos = listaAnimales.filter(a => a.s === sectorSig && !yaSalieron.includes(a.n)).map(a => a.n);
        sugeridos = [...sugeridos, ...refuerzos];
    }

    aviso.innerHTML = `📡 RASTREANDO TRAS EL ${ult.num}...`;
    display.innerHTML = sugeridos.slice(0,3).map(n => `<span class="sniper-num-pill">${n}</span>`).join('');
}

// TRIPLETAS QUE PIENSAN
function generarTripletasDinamicas() {
    const cont = document.getElementById('seccion-tripletas');
    if(!cont) return;
    const fHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fHoy);
    
    // T1: Dinámica basada en atracción real sin repetidos
    let t1 = "11-25-20";
    if(hoy.length > 0) {
        const ult = hoy[0].num;
        let base = (reglasAtraccion[ult] || ["01", "36", "13"]).filter(n => n !== ult);
        t1 = base.slice(0,3).join('-');
    }

    // T2: Miércoles de Oro (Fija Estadística)
    let t2 = "09-14-28"; 
    // T3: El "Salto" (Sector que no ha salido hoy)
    const sectoresHoy = hoy.map(r => listaAnimales.find(a => a.n === r.num).s);
    const faltantes = ['A','B','C','D','E','F'].filter(s => !sectoresHoy.includes(s));
    let t3 = "04-16-33"; // Default F
    if(faltantes.length > 0) {
        const aniFaltante = listaAnimales.filter(a => a.s === faltantes[0]).slice(0,3).map(a => a.n);
        t3 = aniFaltante.join('-');
    }

    cont.innerHTML = `
        <div class="card-tripleta"><small>💎 ATAQUE POST-SORTEO</small><div class="tripleta-nums">${t1}</div></div>
        <div class="card-tripleta"><small>🔥 ORO MIÉRCOLES</small><div class="tripleta-nums">${t2}</div></div>
        <div class="card-tripleta"><small>📡 SALTO DE SECTOR</small><div class="tripleta-nums">${t3}</div></div>
    `;
}

// ORDENAMIENTO DE TABLA (HISTORIAL CLARO)
function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const fInput = document.getElementById('fecha-busqueda-historial');
    if(!c || !fInput) return;
    const f = fInput.value;
    c.innerHTML = '';
    
    // Filtramos y ordenamos por hora real
    const datosTabla = historial.filter(r => r.fecha === f)
                        .sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    datosTabla.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) {
            const clr = r.tipo === 'ROJO' ? 'color:#ff4d4d' : r.tipo === 'AZUL' ? 'color:#38bdf8' : 'color:#94a3b8';
            c.innerHTML += `<tr>
                <td>${r.hora}</td>
                <td><b>${r.num}</b></td>
                <td>${r.animal}</td>
                <td>${ani.s}/${ani.e}</td>
                <td style="${clr}; font-weight:bold">${r.tipo}</td>
            </tr>`;
        }
    });
}

// FUNCIONES DE SOPORTE (Mantenidas y limpias)
function generarMapaRuleta() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return; mapa.innerHTML = '';
    const fHoy = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historial.filter(r => r.fecha === fHoy).map(r => r.num);
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(sec => {
        const sDiv = document.createElement('div');
        sDiv.className = 'sector-block';
        sDiv.innerHTML = `<div class="sector-header">SEC ${sec}</div>`;
        const sGrid = document.createElement('div');
        sGrid.className = 'sector-grid';
        listaAnimales.filter(a => a.s === sec).forEach(ani => {
            const aDiv = document.createElement('div');
            const esJug = jugadosHoy.includes(ani.n);
            aDiv.className = `mini-animal ${esJug ? 'sensor-fijo' : (ani.c==='ROJO'?'bg-rojo':ani.c==='AZUL'?'bg-azul':'bg-negro')}`;
            aDiv.innerHTML = ani.n;
            sGrid.appendChild(aDiv);
        });
        sDiv.appendChild(sGrid);
        mapa.appendChild(sDiv);
    });
}

function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    if(!horaSeleccionadaActiva) return alert("Selecciona hora en el panel");
    let v = input.value;
    if(v === "") return;
    if(v !== '0' && v !== '00') v = v.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) { registrarSorteo(ani.n, ani.a, ani.c, horaSeleccionadaActiva); input.value = ''; }
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return; cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = "animal-btn";
        d.style.borderLeft = `4px solid ${a.c === 'ROJO' ? '#ef4444' : a.c === 'AZUL' ? '#38bdf8' : '#475569'}`;
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.c, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function estudiarAtraccion() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-atraccion');
    if (!val || !res) return;
    const comp = reglasAtraccion[val] || ["Calculando..."];
    res.innerHTML = `<div style="margin-top:10px;"><b>Atracción Fuerte:</b><br>${comp.map(n => `<span class="sniper-num-pill">${n}</span>`).join('')}</div>`;
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { 
    const clock = document.getElementById('live-clock'); 
    if(clock) clock.innerText = new Date().toLocaleTimeString(); 
}, 1000);

window.onload = inicializarSistema;
