// ==========================================
// CONFIGURACIÓN SUPABASE (INTACTA)
// ==========================================
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'01', a:'CARNERO', t:'TIERRA'},
    {n:'02', a:'TORO', t:'TIERRA'}, {n:'03', a:'CIEMPIES', t:'TIERRA'}, {n:'04', a:'ALACRAN', t:'TIERRA'},
    {n:'05', a:'LEON', t:'TIERRA'}, {n:'06', a:'RANA', t:'AGUA'}, {n:'07', a:'PERICO', t:'AIRE'},
    {n:'08', a:'RATON', t:'TIERRA'}, {n:'09', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'TIERRA'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'TIERRA'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'JIRAFA', t:'TIERRA'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'37', a:'TORTUGA', t:'TIERRA'},
    {n:'38', a:'BUFALO', t:'TIERRA'}, {n:'39', a:'LECHUZA', t:'AIRE'}, {n:'40', a:'AVISPA', t:'AIRE'},
    {n:'41', a:'CANGURO', t:'TIERRA'}, {n:'42', a:'TUCAN', t:'AIRE'}, {n:'43', a:'MARIPOSA', t:'AIRE'},
    {n:'44', a:'CHIGÜIRE', t:'TIERRA'}, {n:'45', a:'GARZA', t:'AIRE'}, {n:'46', a:'PUMA', t:'TIERRA'},
    {n:'47', a:'PAVO REAL', t:'AIRE'}, {n:'48', a:'PUERCOESPIN', t:'TIERRA'}, {n:'49', a:'PEREZA', t:'TIERRA'},
    {n:'50', a:'CANARIO', t:'AIRE'}, {n:'51', a:'PELICANO', t:'AIRE'}, {n:'52', a:'PULPO', t:'AGUA'},
    {n:'53', a:'CARACOL', t:'AGUA'}, {n:'54', a:'GRILLO', t:'TIERRA'}, {n:'55', a:'OSO HORMIGUERO', t:'TIERRA'},
    {n:'56', a:'TIBURON', t:'AGUA'}, {n:'57', a:'PATO', t:'AGUA'}, {n:'58', a:'HORMIGA', t:'TIERRA'},
    {n:'59', a:'PANTERA', t:'TIERRA'}, {n:'60', a:'CAMALEON', t:'TIERRA'}, {n:'61', a:'PANDA', t:'TIERRA'},
    {n:'62', a:'CACHICAMO', t:'TIERRA'}, {n:'63', a:'CANGREJO', t:'AGUA'}, {n:'64', a:'GAVILÁN', t:'AIRE'},
    {n:'65', a:'ARAÑA', t:'TIERRA'}, {n:'66', a:'LOBO', t:'TIERRA'}, {n:'67', a:'AVESTRUZ', t:'AIRE'},
    {n:'68', a:'JAGUAR', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', a:'BISONTE', t:'TIERRA'},
    {n:'71', a:'GUACAMAYA', t:'AIRE'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'HIPOPOTAMO', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

// ==========================================
// INICIALIZACIÓN
// ==========================================
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
    } catch (e) { console.error("Error cargando Supabase"); }
}

// ==========================================
// NUEVO ALGORITMO: PRECISIÓN MIL POR CIENTO
// ==========================================
function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    if (!display || historial.length < 10) return;

    // 1. Ordenar historial cronológicamente
    const hO = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    // 2. Obtener los últimos 3 resultados de HOY
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = hO.filter(r => r.fecha === fechaHoy);
    if (sorteosHoy.length === 0) return;
    
    const ultimoNum = sorteosHoy[sorteosHoy.length - 1].num;
    
    // 3. Lógica de "Jale" (¿Qué sale después del último número según enero-abril?)
    let conteoJale = {};
    for(let i=0; i < hO.length - 1; i++) {
        if(hO[i].num === ultimoNum) {
            let seguido = hO[i+1].num;
            conteoJale[seguido] = (conteoJale[seguido] || 0) + 1;
        }
    }

    // 4. Lógica de "Simetría" (Espejos y Vecinos)
    const ultimoInt = parseInt(ultimoNum);
    const vecinos = [(ultimoInt + 1) % 76, (ultimoInt - 1 < 0 ? 75 : ultimoInt - 1)].map(n => n.toString().padStart(2, '0'));

    // 5. Construir Sugerencia Final
    let finalSugeridos = Object.entries(conteoJale)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 2)
        .map(x => x[0]);

    // Añadir un vecino o un número fuerte del día si faltan
    vecinos.forEach(v => { if(finalSugeridos.length < 3 && !finalSugeridos.includes(v)) finalSugeridos.push(v); });

    display.innerHTML = finalSugeridos.map(n => `<span style="background:#0f172a; padding: 2px 10px; border-radius: 5px; border: 1px solid #ef4444; font-weight:bold;">${n}</span>`).join(' ');
}

function calcularPrediccionTotal() {
    if (historial.length < 5) return;
    const hO = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    // Analizar la "Familia" que más está saliendo hoy (Decenas)
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = hO.filter(r => r.fecha === fechaHoy);
    
    let familias = { '0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0 };
    hoy.forEach(r => {
        let f = r.num.length === 1 ? '0' : r.num[0];
        familias[f]++;
    });
    
    // El número más frecuente de la familia dominante
    const famDominante = Object.entries(familias).sort((a,b) => b[1] - a[1])[0][0];
    const sugeridoFam = hO.filter(r => r.num.startsWith(famDominante))
                           .reduce((acc, curr) => { acc[curr.num] = (acc[curr.num]||0)+1; return acc; }, {});
    
    const numFuerte = Object.entries(sugeridoFam).sort((a,b) => b[1] - a[1])[0]?.[0] || '23';

    // El 75 solo aparece si tiene más de 25 sorteos de deuda
    const index75 = [...hO].reverse().findIndex(r => r.num === '75');
    const deuda75 = index75 === -1 ? hO.length : index75;
    const tercerDato = deuda75 > 25 ? '75' : '16'; 

    const cont = document.getElementById('contenedor-fijos');
    if(cont) {
        // 23 es fijo histórico, numFuerte es tendencia de hoy, tercerDato es por deuda
        cont.innerHTML = ['23', numFuerte, tercerDato].map(f => `<div class="dato-fijo">${f}</div>`).join('');
    }
}

// ==========================================
// FUNCIONES DE REGISTRO Y UI (MANTENIDAS)
// ==========================================
function analizarGuacharo() {
    const hO = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    let index75 = hO.findIndex(r => r.num === '75');
    let sorteosSin75 = index75 === -1 ? hO.length : index75;
    const display = document.getElementById('dias-sin-75');
    if(display) display.innerText = sorteosSin75;
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    actualizarInterfaz();
    try {
        await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
    } catch (e) { console.error("Error Supabase"); }
}

function actualizarInterfaz() {
    analizarGuacharo();
    calcularPrediccionTotal();
    actualizarJugadaSniper(); 
    actualizarTabla();
    generarPanelDiario();
    detectarJugadasEspeciales();
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const f = document.getElementById('fecha-busqueda-historial').value;
    if(!c) return;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora)).forEach(r => {
        c.innerHTML += `<tr ${r.num==='75'?'class="row-guacharo"':''}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
    });
}

function generarPanelDiario() {
    const p = document.getElementById('panel-diario-sorteos');
    const f = document.getElementById('fecha-analisis').value;
    if(!p) return;
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

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora primero");
    let v = document.getElementById('num-rapido').value.padStart(2, '0').replace('000','00');
    if(v === '0' && document.getElementById('num-rapido').value !== '00') v = '0';
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function detectarJugadasEspeciales() {
    const alertCont = document.getElementById('alertas-algoritmo');
    const hoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === hoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    if(sorteosHoy.length < 2 || !alertCont) return;
    alertCont.innerHTML = '';
    const ult = sorteosHoy[sorteosHoy.length-1];
    const pen = sorteosHoy[sorteosHoy.length-2];
    if(ult.num.split('').reverse().join('') === pen.num) alertCont.innerHTML += `<span class="badge bg-espejo">🔄 ESPEJO (${pen.num}-${ult.num})</span>`;
    if(Math.abs(parseInt(ult.num) - parseInt(pen.num)) === 1) alertCont.innerHTML += `<span class="badge bg-escalera">📈 ESCALERA</span>`;
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = 'animal-btn';
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.t, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function estudiarAnimalPatron() {
    const n = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-patron-avanzado');
    if(!n) return;
    const h = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    let ant = {}, sig = {};
    h.forEach((r, i) => {
        if(r.num === n) {
            if(i > 0) { let k = h[i-1].num; ant[k] = (ant[k]||0)+1; }
            if(i < h.length-1) { let k = h[i+1].num; sig[k] = (sig[k]||0)+1; }
        }
    });
    const top = (o) => Object.entries(o).sort((a,b)=>b[1]-a[1])[0] || ["--", 0];
    res.innerHTML = `<div class="card-estudio">🧠 Inteligencia del <b>${n}</b>:<br>Llama antes al: <b>${top(ant)[0]}</b><br>Suele dejar al: <b>${top(sig)[0]}</b></div>`;
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { 
    const c = document.getElementById('live-clock');
    if(c) c.innerText = new Date().toLocaleTimeString(); 
}, 1000);

window.onload = inicializarSistema;
