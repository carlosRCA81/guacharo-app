// CONFIGURACIÓN MAESTRA
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'TU_KEY_COMPLETA_AQUI'; // Usa la key larga de tu archivo .env
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CLAVE_MAESTRA = '1234';
let historial = [];

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'01', a:'CARNERO', t:'TIERRA'},
    {n:'75', a:'GUACHARO', t:'AIRE'}, // Aseguramos que el 75 esté en tu lista
    // ... (El resto de tu lista original de animales aquí)
];

// SEGURIDAD
function checkAccess() {
    const pass = document.getElementById('access-key').value;
    if (pass === CLAVE_MAESTRA) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        inicializarSistema();
    } else { alert("ERROR: CLAVE INCORRECTA"); }
}

function inicializarSistema() {
    cargarHistorialRemoto();
    setInterval(() => {
        document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// GESTIÓN DE DATOS
async function cargarHistorialRemoto() {
    const { data, error } = await _supabase.from('historial_sorteos')
        .select('*')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });
    
    if (!error && data) {
        historial = data;
        actualizarInterfaz();
    }
}

async function filtrarPorFecha() {
    const fecha = document.getElementById('filtro-fecha-almanaque').value;
    if(!fecha) return;

    const { data, error } = await _supabase.from('historial_sorteos')
        .select('*')
        .eq('fecha', fecha)
        .order('hora', { ascending: true });

    if (!error) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '';
    
    let sin75 = 0;
    let encontrado75 = false;

    historial.forEach(r => {
        // Lógica de Ingeniería: Resaltado del 75
        const esEspecial = r.num === '75' ? 'class="row-guacharo"' : '';
        if(r.num === '75') encontrado75 = true;
        if(!encontrado75) sin75++;

        cuerpo.innerHTML += `
            <tr ${esEspecial}>
                <td>${r.fecha}</td>
                <td>${r.hora}</td>
                <td><strong>${r.num}</strong></td>
                <td>${r.animal}</td>
            </tr>`;
    });

    document.getElementById('dias-sin-75').innerText = sin75;
    if(historial.length > 0) {
        document.getElementById('last-num').innerText = `${historial[0].num} - ${historial[0].animal}`;
    }
}

// PESTAÑAS
function openTab(evt, tabName) {
    const contents = document.getElementsByClassName("tab-content");
    for (let c of contents) c.style.display = "none";
    const btns = document.getElementsByClassName("tab-btn");
    for (let b of btns) b.classList.remove("active");
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}
