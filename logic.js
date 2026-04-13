// CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CLAVE_MAESTRA = '1234';
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

// SEGURIDAD
function checkAccess() {
    const pass = document.getElementById('access-key').value;
    if (pass === CLAVE_MAESTRA) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else {
        alert("CLAVE INCORRECTA");
    }
}

// INICIALIZACIÓN
async function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    const fInput = document.getElementById('fecha-analisis');
    fInput.value = new Date().toISOString().split('T')[0];
    fInput.addEventListener('change', generarPanelDiario);
    
    // Iniciar Reloj
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);

    await cargarHistorialRemoto();
}

// REGISTRO Y UI
function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    panel.innerHTML = '';
    const fecha = document.getElementById('fecha-analisis').value;

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const reg = historial.find(r => r.fecha === fecha && r.hora === hora);
        if(reg) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${reg.num})`;
        } else {
            box.innerText = hora;
        }
        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.classList.remove('active-select'));
            box.classList.add('active-select');
        };
        panel.appendChild(box);
    });
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    listaAnimales.forEach(ani => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${ani.n}</strong><small>${ani.a}</small>`;
        btn.onclick = () => registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
        container.appendChild(btn);
    });
}

async function registrarSorteo(num, animal, tipo, hora) {
    if(!hora) return alert("Selecciona una hora primero");
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num, animal, tipo };

    // Optimismo UI
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial.splice(idx, 1);
    historial.push(nuevo);
    actualizarInterfaz();

    // Guardar en Supabase
    await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
}

function registrarPorNumero() {
    const n = document.getElementById('num-rapido').value.padStart(2, '0').replace('000', '00');
    const ani = listaAnimales.find(a => a.n === n || (n === '0' && a.n === '0'));
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function actualizarInterfaz() {
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
}

function actualizarTabla() {
    const tabla = document.getElementById('lista-historial');
    tabla.innerHTML = '';
    [...historial].reverse().forEach(r => {
        const row = `<tr><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
        tabla.innerHTML += row;
    });
}

async function cargarHistorialRemoto() {
    const { data } = await _supabase.from('historial_sorteos').select('*');
    if(data) {
        historial = data;
        actualizarInterfaz();
    }
}

// LÓGICA GUACHARO Y PATRONES
function analizarGuacharo() {
    let sin75 = 0;
    const sorted = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    for(let i = sorted.length-1; i >= 0; i--) {
        if(sorted[i].num === '75') break;
        sin75++;
    }
    document.getElementById('dias-sin-75').innerText = sin75;
}

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    sel.innerHTML = listaAnimales.map(a => `<option value="${a.n}">${a.n} - ${a.a}</option>`).join('');
}
