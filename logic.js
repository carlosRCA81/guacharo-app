// ==========================================
// CONFIGURACIÓN SUPABASE - ANALIZADOR CRCA PRO
// ==========================================
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Cache de animales para búsqueda rápida O(1)
const animalMap = {};
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
listaAnimales.forEach(a => animalMap[a.n] = a);

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

// Inicialización optimizada
async function inicializarSistema() {
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput && !fechaInput.value) {
        fechaInput.value = new Date().toISOString().split('T')[0];
    }
    
    generarGridBotones();
    llenarSelectEstudio();
    await cargarHistorialRemoto();
    
    fechaInput?.addEventListener('change', () => {
        generarPanelDiario();
        calcularBalanceElementos();
    });
}

// Carga remota con ordenamiento desde la base de datos (más rápido)
async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .order('fecha', { ascending: false })
            .order('hora', { ascending: false });

        if (error) throw error;
        historial = data || [];
        actualizarInterfaz();
    } catch (err) {
        console.error("Error cargando datos:", err.message);
    }
}

function actualizarInterfaz() {
    // Ordenamos una sola vez para todos los cálculos
    historial.sort((a, b) => {
        if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
        return horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora);
    });

    if(historial.length > 0) {
        document.getElementById('last-num').innerText = `${historial[0].num} - ${historial[0].animal}`;
    }

    // Ejecución fragmentada para no congelar la UI
    requestAnimationFrame(() => {
        actualizarTabla();
        analizarGuacharo();
        generarPanelDiario();
        calcularBalanceElementos();
        detectarDormidos();
    });
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    if(!panel) return;
    
    const fechaActual = document.getElementById('fecha-analisis').value;
    const registrosHoy = historial.filter(r => r.fecha === fechaActual);
    
    let html = '';
    horasSorteo.forEach(hora => {
        const reg = registrosHoy.find(r => r.hora === hora);
        const clase = reg ? 'hora-box jugado' : 'hora-box';
        const texto = reg ? `${hora}<br><strong>(${reg.num})</strong>` : hora;
        html += `<div class="${clase}" onclick="seleccionarHora(this, '${hora}')">${texto}</div>`;
    });
    panel.innerHTML = html;
}

function seleccionarHora(elemento, hora) {
    horaSeleccionadaActiva = hora;
    document.querySelectorAll('.hora-box').forEach(b => {
        b.classList.remove('active-select');
        b.style.border = '1px solid #475569';
    });
    elemento.classList.add('active-select');
    elemento.style.border = '2px solid #38bdf8';
    document.getElementById('num-rapido').focus();
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo, updated_at: new Date() };

    // Actualización optimista de la UI
    const index = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (index !== -1) historial[index] = nuevoRegistro;
    else historial.unshift(nuevoRegistro);
    
    actualizarInterfaz();

    const { error } = await _supabase.from('historial_sorteos').upsert(nuevoRegistro);
    if (error) console.error("Error al guardar:", error);
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA primero");
    const input = document.getElementById('num-rapido');
    let val = input.value.trim();
    if (!val) return;

    if (val.length === 1 && val !== "0") val = "0" + val;
    
    const animal = animalMap[val];
    if (!animal) return alert("Número inválido");

    registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
    input.value = '';
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    
    // Solo mostramos los últimos 50 para mantener la fluidez
    const fragmento = historial.slice(0, 50).map(r => `
        <tr class="${r.num === '75' ? 'row-guacharo' : ''}">
            <td>${r.fecha}</td>
            <td>${r.hora}</td>
            <td>${r.num}</td>
            <td>${r.animal}</td>
            <td>${r.tipo}</td>
        </tr>
    `).join('');
    
    cuerpo.innerHTML = fragmento;
}

// ... Resto de funciones (analizarGuacharo, detectarDormidos) simplificadas para usar el historial ya ordenado
