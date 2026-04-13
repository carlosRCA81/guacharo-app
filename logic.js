// ==========================================
// CONFIGURACIÓN SUPABASE - ANALIZADOR CRCA
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

// Reloj
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

// Pestañas
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    let tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Inicio
async function inicializarSistema() {
    generarGridBotones();
    llenarSelectEstudio();
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-historial').value = hoy;
    
    document.getElementById('fecha-analisis').addEventListener('change', generarPanelDiario);
    
    await cargarHistorialRecuperacion();
    generarPanelDiario();
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small>${animal.a}</small>`;
        btn.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Primero toca una HORA");
            registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        };
        container.appendChild(btn);
    });
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    if(!panel) return;
    panel.innerHTML = '';
    const fechaActual = document.getElementById('fecha-analisis').value;

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const registro = historial.find(r => r.fecha === fechaActual && r.hora === hora);
        
        if (registro) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${registro.num})`;
        } else {
            box.innerText = hora;
        }

        if(hora === horaSeleccionadaActiva) box.classList.add('active-select');

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            generarPanelDiario();
            document.getElementById('num-rapido').focus();
        };
        panel.appendChild(box);
    });
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num, animal, tipo };

    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (idx !== -1) historial.splice(idx, 1);
    historial.push(nuevo);
    
    actualizarInterfaz();

    try {
        await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
    } catch (err) { console.error(err); }
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA");
    const inputNum = document.getElementById('num-rapido');
    let val = inputNum.value.trim();
    if (val !== "0" && val !== "00" && val.length === 1) val = "0" + val;
    const animal = listaAnimales.find(a => a.n === val);
    if (!animal) return alert("Número no existe");
    registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
    inputNum.value = '';
}

async function cargarHistorialPorFecha() {
    const fecha = document.getElementById('fecha-historial').value;
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';

    const { data, error } = await _supabase.from('historial_sorteos').select('*').eq('fecha', fecha);
    if (data) {
        cuerpo.innerHTML = '';
        data.sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).forEach(r => {
            const cls = r.num === '75' ? 'class="row-guacharo"' : '';
            cuerpo.innerHTML += `<tr ${cls}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td><td>${r.tipo}</td></tr>`;
        });
    }
}

async function cargarHistorialRecuperacion() {
    const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false}).limit(200);
    if (data) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    if(historial.length > 0) {
        const sorted = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
        document.getElementById('last-num').innerText = `${sorted[0].num} - ${sorted[0].animal}`;
    }
    analizarGuacharo();
    generarPanelDiario();
    calcularBalanceElementos();
    detectarDormidos();
}

function analizarGuacharo() {
    let sin75 = 0;
    const sorted = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    for(let i = sorted.length-1; i >= 0; i--) {
        if(sorted[i].num === '75') break;
        sin75++;
    }
    document.getElementById('dias-sin-75').innerText = sin75;
}

function detectarDormidos() {
    let dormidos = [];
    listaAnimales.forEach(ani => {
        if(!historial.some(r => r.num === ani.n)) dormidos.push(ani.n);
    });
    document.getElementById('lista-dormidos').innerText = dormidos.slice(0,10).join(', ') + "...";
}

function calcularBalanceElementos() {
    const fecha = document.getElementById('fecha-analisis').value;
    let counts = { TIERRA: 0, AIRE: 0, AGUA: 0 };
    historial.filter(r => r.fecha === fecha).forEach(r => { counts[r.tipo]++; });
    document.getElementById('val-tierra').innerText = counts.TIERRA;
    document.getElementById('val-aire').innerText = counts.AIRE;
    document.getElementById('val-agua').innerText = counts.AGUA;
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    sel.innerHTML = '<option value="">-- Selecciona --</option>';
    listaAnimales.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.n; opt.innerText = `${a.n} - ${a.a}`; sel.appendChild(opt);
    });
}

const btnBorrar = document.getElementById('btn-borrar');
if(btnBorrar) {
    btnBorrar.onclick = async () => {
        if(!confirm("¿Borrar último?")) return;
        const ult = historial.pop();
        await _supabase.from('historial_sorteos').delete().match({ fecha: ult.fecha, hora: ult.hora });
        actualizarInterfaz();
    };
}

window.onload = inicializarSistema;
