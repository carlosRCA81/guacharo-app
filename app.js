// ==========================================
// CONFIGURACIÓN MAESTRA - ANALIZADOR CRCA PRO
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
    {n:'68', a:'JAGUAR', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', b:'BISONTE', t:'TIERRA'},
    {n:'71', a:'GUACAMAYA', t:'AIRE'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'HIPOPOTAMO', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historial = [];
let horaSeleccionadaActiva = null;

// --- INICIO Y CARGA ---
async function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    const fInput = document.getElementById('fecha-analisis');
    if(fInput) {
        fInput.value = new Date().toISOString().split('T')[0];
        fInput.onchange = generarPanelDiario;
    }
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .order('fecha', { ascending: false });
        if (data) {
            historial = data;
            actualizarInterfaz();
        }
    } catch (e) { console.error("Error Supabase:", e); }
}

// --- REGISTRO ---
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const registro = { fecha, hora, num, animal, tipo };

    // Optimización local
    historial = historial.filter(r => !(r.fecha === fecha && r.hora === hora));
    historial.unshift(registro); 
    
    actualizarInterfaz();

    try {
        await _supabase.from('historial_sorteos').upsert(registro);
    } catch (err) { console.error("Error al guardar:", err); }
}

// --- NÚCLEO DEL ALGORITMO (IA Predictiva) ---
function ejecutarAnalisisAvanzado() {
    if (historial.length < 5) return;

    const ultimos = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora)).slice(0, 50);
    const ultimoNum = ultimos[0].num;

    // 1. Detección de Secuencias (Anunciantes)
    let proximosProbables = {};
    for (let i = 1; i < historial.length; i++) {
        if (historial[i].num === ultimoNum && i > 0) {
            let siguiente = historial[i-1].num;
            proximosProbables[siguiente] = (proximosProbables[siguiente] || 0) + 1;
        }
    }

    // 2. Lógica de Espejos y Escaleras
    let sugeridos = Object.keys(proximosProbables).sort((a,b) => proximosProbables[b] - proximosProbables[a]).slice(0, 3);
    
    // Si no hay suficientes datos, usamos espejos matemáticos
    if(sugeridos.length < 3) {
        let espejo = ultimoNum.split('').reverse().join('');
        if(!sugeridos.includes(espejo)) sugeridos.push(espejo);
    }

    // Mostrar en UI
    const alerta = document.getElementById('alerta-probabilidad');
    if(alerta) {
        alerta.innerHTML = `
            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; padding: 10px; border-radius: 5px;">
                <span class="probabilidad-alta">🎯 RECOMENDADOS CRCA:</span><br>
                <div style="display:flex; justify-content: space-around; font-size: 1.2rem; margin-top:5px;">
                    ${sugeridos.map(n => `<strong>${n}</strong>`).join(' - ')}
                </div>
            </div>
        `;
    }
}

function detectarPatronesEspeciales() {
    const res = document.getElementById('resultado-patrones-guacharo');
    if(!res || historial.length < 3) return;

    const h = historial.slice(0, 5);
    let msg = "";

    // Detección de Escalera
    if(parseInt(h[0].num) === parseInt(h[1].num) + 1) msg = "📈 ESCALERA DETECTADA";
    // Detección de Repetición
    if(h[0].num === h[1].num) msg = "🔄 REPETICIÓN DETECTADA";
    
    if(msg) {
        res.innerHTML = `<div class="stat-card-mini" style="border-left-color: #fbbf24; animation: pulse 2s infinite;">
            <h4>ALERTA DE ALGORITMO:</h4>
            <p>${msg}</p>
        </div>`;
    }
}

// --- UI Y TABLAS ---
function actualizarInterfaz() {
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
    ejecutarAnalisisAvanzado();
    detectarPatronesEspeciales();
    detectarDormidos();
    calcularBalanceElementos();
}

function analizarGuacharo() {
    let sin75 = 0;
    for(let r of historial) {
        if(r.num === '75') break;
        sin75++;
    }
    const d = document.getElementById('dias-sin-75');
    if(d) d.innerText = sin75;
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    historial.slice(0, 30).forEach(r => {
        const clase75 = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${clase75}>
            <td>${r.fecha.split('-').reverse().join('/')}</td>
            <td>${r.hora}</td>
            <td>${r.num}</td>
            <td>${r.animal}</td>
            <td>${r.tipo}</td>
        </tr>`;
    });
}

// (Mantén tus funciones generarPanelDiario, generarGridBotones y checkAccess igual que las tienes
