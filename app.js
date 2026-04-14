// CONFIGURACIÓN SUPABASE (Tus datos reales)
const SUPABASE_URL = "https://ggpxzqfobvkdjpobfmtb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHh6cWZvYnZrkGpPQmJtdEIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxMjE2NjgxNSwiZXhwIjoyMDI3NzQyODE1fQ..."; // He usado la que aparece en tu captura
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'1', a:'CARNERO', t:'TIERRA'},
    {n:'2', a:'TORO', t:'TIERRA'}, {n:'3', a:'CIEMPIES', t:'TIERRA'}, {n:'4', a:'ALACRAN', t:'TIERRA'},
    {n:'5', a:'LEON', t:'TIERRA'}, {n:'6', a:'RANA', t:'AGUA'}, {n:'7', a:'PERICO', t:'AIRE'},
    {n:'8', a:'RATON', t:'TIERRA'}, {n:'9', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
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

// Inicialización rápida
document.addEventListener('DOMContentLoaded', () => {
    inicializarSistema();
    cargarHistorialDesdeSupabase();
});

function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    const fechaInput = document.getElementById('fecha-analisis');
    fechaInput.value = new Date().toISOString().split('T')[0];
    fechaInput.addEventListener('change', generarPanelDiario);
    
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// Cargar datos de la Nube (Ordenados)
async function cargarHistorialDesdeSupabase() {
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });

    if (error) {
        console.error("Error cargando datos:", error);
        alert("Error de conexión: Verifica tu API Key");
        return;
    }

    historial = data || [];
    actualizarInterfaz();
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    panel.innerHTML = '';
    const fechaActual = document.getElementById('fecha-analisis').value;

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const reg = historial.find(r => r.fecha === fechaActual && r.hora === hora);
        
        if (reg) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${reg.num})`;
        } else {
            box.innerText = hora;
        }

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = '1px solid #475569');
            box.style.border = '2px solid #fbbf24';
        };
        panel.appendChild(box);
    });
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.style = "background:#334155; padding:5px; text-align:center; border-radius:4px; cursor:pointer; font-size:0.7rem; color:white;";
        btn.innerHTML = `<strong>${animal.n}</strong><br>${animal.a}`;
        btn.onclick = () => registrarSorteo(animal.n, animal.a, animal.t);
        container.appendChild(btn);
    });
}

async function registrarSorteo(num, animal, tipo) {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA primero");
    const fecha = document.getElementById('fecha-analisis').value;

    const nuevoRegistro = { fecha, hora: horaSeleccionadaActiva, num, animal, tipo };

    // Guardar en Supabase
    const { error } = await _supabase.from('historial_resultados').insert([nuevoRegistro]);

    if (error) {
        alert("Error al guardar: " + error.message);
    } else {
        historial.unshift(nuevoRegistro);
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
    if(historial.length > 0) {
        document.getElementById('last-num').innerText = `${historial[0].num} - ${historial[0].animal}`;
    }
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '';
    historial.forEach(r => {
        const esGuacharo = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${esGuacharo}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
    });
}

function analizarGuacharo() {
    let sin75 = 0;
    for(let r of historial) {
        if(r.num === '75') break;
        sin75++;
    }
    document.getElementById('dias-sin-75').innerText = sin75;
}

function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let c of contents) c.style.display = "none";
    const btns = document.getElementsByClassName("tab-btn");
    for (let b of btns) b.classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    sel.innerHTML = listaAnimales.map(a => `<option value="${a.n}">${a.n} - ${a.a}</option>`).join('');
}
