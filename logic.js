/* LÓGICA IA CRCA - VERSIÓN MÁXIMA CAPACIDAD */
const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'1', a:'CARNERO', t:'TIERRA'},
    {n:'2', a:'TORO', t:'TIERRA'}, {n:'3', a:'CIEMPIES', t:'TIERRA'}, {n:'4', a:'ALACRAN', t:'TIERRA'},
    {n:'5', a:'LEON', t:'TIERRA'}, {n:'6', a:'RANA', t:'AGUA'}, {n:'7', a:'PERICO', t:'AIRE'},
    {n:'8', a:'RATON', t:'TIERRA'}, {n:'9', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'AIRE'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'TIERRA'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'JIRAFA', t:'TIERRA'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'37', a:'TORTUGA', t:'AGUA'},
    {n:'38', a:'CUCARACHA', t:'TIERRA'}, {n:'39', a:'LECHUZA', t:'AIRE'}, {n:'40', a:'AVISPA', t:'AIRE'},
    {n:'41', a:'ALACRAN', t:'TIERRA'}, {n:'42', a:'CIEMPIES', t:'TIERRA'}, {n:'43', a:'MARIPOSA', t:'AIRE'},
    {n:'44', a:'GATO', t:'TIERRA'}, {n:'45', a:'GARZA', t:'AIRE'}, {n:'46', a:'PUMA', t:'TIERRA'},
    {n:'47', a:'PAVO REAL', t:'AIRE'}, {n:'48', a:'ZORRO', t:'TIERRA'}, {n:'49', a:'RATON', t:'TIERRA'},
    {n:'50', a:'CANARIO', t:'AIRE'}, {n:'51', a:'PELICANO', t:'AIRE'}, {n:'52', a:'BURRO', t:'TIERRA'},
    {n:'53', a:'CHIVO', t:'TIERRA'}, {n:'54', a:'COCHINO', t:'TIERRA'}, {n:'55', a:'GALLO', t:'AIRE'},
    {n:'56', a:'CAMELLO', t:'TIERRA'}, {n:'57', a:'CEBRA', t:'TIERRA'}, {n:'58', a:'HORMIGA', t:'TIERRA'},
    {n:'59', a:'PANTERA', t:'TIERRA'}, {n:'60', a:'CAMALEON', t:'TIERRA'}, {n:'61', a:'GALLINA', t:'TIERRA'},
    {n:'62', a:'VACA', t:'TIERRA'}, {n:'63', a:'PERRO', t:'TIERRA'}, {n:'64', a:'ZAMURO', t:'AIRE'},
    {n:'65', a:'ELEFANTE', t:'TIERRA'}, {n:'66', a:'LOBO', t:'TIERRA'}, {n:'67', a:'AVESTRUZ', t:'AIRE'},
    {n:'68', a:'ARDILLA', t:'TIERRA'}, {n:'69', a:'CONEJO', t:'TIERRA'}, {n:'70', a:'TUCAN', t:'AIRE'},
    {n:'71', a:'VENADO', t:'TIERRA'}, {n:'72', a:'GORILA', t:'TIERRA'}, {n:'73', a:'JIRAFA', t:'TIERRA'},
    {n:'74', a:'TURPIAL', t:'AIRE'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

let historial = [];

// CARGA INICIAL
window.onload = async () => {
    await cargarHistorialRemoto();
    actualizarInterfaz();
    iniciarReloj();
};

async function cargarHistorialRemoto() {
    try {
        const res = await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial');
        historial = await res.json() || [];
        console.log("Base de datos cargada: " + historial.length + " registros.");
    } catch (e) { console.error("Error al conectar con la nube."); }
}

function actualizarInterfaz() {
    renderizarBotonesAnimales();
    renderizarHoras();
    renderizarHistorial();
    motorIA();
    estudio75();
}

// FILTRO DE HISTORIAL (PARA QUE SEA RÁPIDA)
function renderizarHistorial() {
    const lista = document.getElementById('lista-historial');
    const filtroMes = document.getElementById('filtro-mes').value;
    lista.innerHTML = "";
    
    // Invertir para ver lo más reciente arriba
    const datosFiltrados = historial.slice().reverse().filter(reg => {
        if (filtroMes === "todos") return true;
        return reg.fecha.split('-')[1] === filtroMes;
    });

    datosFiltrados.forEach(reg => {
        const esGuacharo = reg.num === "75" ? 'class="75-especial"' : '';
        lista.innerHTML += `<tr ${esGuacharo}>
            <td>${reg.fecha}</td>
            <td>${reg.hora}</td>
            <td>${reg.num}</td>
            <td>${listaAnimales.find(a => a.n === reg.num)?.a || '---'}</td>
        </tr>`;
    });
}

// EL MOTOR IA DE PREDICCIÓN (PESOS)
function motorIA() {
    if (historial.length < 5) return;
    
    const ultimo = historial[historial.length - 1];
    const penultimo = historial[historial.length - 2];
    let pesos = {};

    listaAnimales.forEach(a => pesos[a.n] = 0);

    // REGLA 1: ESPEJO (+40 pts)
    const espejoUltimo = ultimo.num.split('').reverse().join('');
    if (pesos[espejoUltimo] !== undefined) pesos[espejoUltimo] += 40;

    // REGLA 2: ESCALERA (+30 pts)
    const siguienteEscalera = (parseInt(ultimo.num) + 1).toString();
    if (pesos[siguienteEscalera] !== undefined) pesos[siguienteEscalera] += 30;

    // REGLA 3: FAMILIA (TIERRA/AIRE/AGUA) (+20 pts)
    const tipoUltimo = listaAnimales.find(a => a.n === ultimo.num)?.t;
    listaAnimales.filter(a => a.t === tipoUltimo).forEach(a => pesos[a.n] += 20);

    // REGLA 4: ANUNCIANTE 75 (MONO)
    if (ultimo.num === "13") pesos["75"] += 100;

    const ordenados = Object.entries(pesos).sort((a,b) => b[1] - a[1]);
    const top3 = ordenados.slice(0, 3);

    const contenedor = document.getElementById('top-3-ia');
    contenedor.innerHTML = "";
    top3.forEach(item => {
        const animal = listaAnimales.find(a => a.n === item[0]);
        contenedor.innerHTML += `
            <div class="hora-box" style="border: 1px solid #fbbf24;">
                <span class="num-ia">${item[0]}</span>
                <span style="font-size:0.6rem;">${animal.a}</span>
            </div>`;
    });

    document.getElementById('ia-razon').innerText = `Basado en el último resultado (${ultimo.num} - ${listaAnimales.find(a => a.n === ultimo.num).a}) y patrones de ${ultimo.fecha.split('-')[1]}.`;
}

// ESTUDIO DEL 75
function estudio75() {
    const salidas = historial.filter(r => r.num === "75");
    const container = document.getElementById('ciclos-historicos');
    container.innerHTML = "<strong>Ciclos pasados:</strong><br>";

    if (salidas.length > 0) {
        const ultimaFecha = new Date(salidas[salidas.length-1].fecha);
        const hoy = new Date();
        const diff = Math.floor((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));
        document.getElementById('dias-sin-75').innerText = diff;
    }
}

// FUNCIONES DE CONTROL (BOTONES Y RELOJ)
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function iniciarReloj() {
    setInterval(() => {
        const ahora = new Date();
        document.getElementById('live-clock').innerText = ahora.toLocaleTimeString();
    }, 1000);
}

// (Aquí incluirías tus funciones de registro guardarRapido(), renderizarHoras(), etc. de tu código original para no perder la funcionalidad de los botones)
