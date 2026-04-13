/**
 * CRCA ELITE v3 - Motor de Lógica y Conexión Directa
 * Sin dependencias de PHP / Servidor externo
 */

// 1. CONFIGURACIÓN DE CONEXIÓN (Client-Side)
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. DATA_GUACHARO: Diccionario de 75 Animales
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

// 3. PERSISTENCIA Y SINCRONIZACIÓN
async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .order('fecha', { ascending: true });
        
        if (data) {
            historial = data;
            actualizarTodo();
        }
    } catch (err) {
        console.error("Error al sincronizar:", err);
    }
}

async function guardarEnNube(registro) {
    const { error } = await _supabase
        .from('historial_sorteos')
        .upsert(registro, { onConflict: 'fecha,hora' });
    
    if (error) console.error("Error al guardar:", error.message);
}

// 4. LÓGICA DE REGISTRO
function registrarSorteo(n, animal, tipo, hora) {
    if (!hora) return alert("Seleccione una HORA en el panel superior");
    
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num: n, animal, tipo };

    // Actualizar localmente
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);
    
    historial.push(nuevoRegistro);
    guardarEnNube(nuevoRegistro);
    actualizarTodo();
}

// 5. INTELIGENCIA DE DATOS (PATRONES)
function analizarGuacharo() {
    const displayDias = document.getElementById('dias-sin-75');
    const resEstudio = document.getElementById('resultado-patrones-guacharo');
    
    if (!displayDias) return;

    // Ordenar historial cronológicamente
    const historialOrdenado = [...historial].sort((a,b) => 
        a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)
    );

    // Calcular días/sorteos sin el 75
    let contador = 0;
    for (let i = historialOrdenado.length - 1; i >= 0; i--) {
        if (historialOrdenado[i].num === '75') break;
        contador++;
    }
    displayDias.innerText = contador;

    // Detectar "Anunciantes" (¿Qué animal sale antes del 75?)
    let anunciantes = {};
    historialOrdenado.forEach((reg, i) => {
        if (reg.num === '75' && i > 0) {
            let previo = historialOrdenado[i-1].num + " - " + historialOrdenado[i-1].animal;
            anunciantes[previo] = (anunciantes[previo] || 0) + 1;
        }
    });

    // Mostrar el anunciante más frecuente
    const masFrecuente = Object.keys(anunciantes).reduce((a, b) => anunciantes[a] > anunciantes[b] ? a : b, "Ninguno");
    if (resEstudio) {
        resEstudio.innerHTML = `<strong>Frecuente antes del 75:</strong><br>${masFrecuente}`;
    }
}

function calcularBalanceElementos() {
    const cuenta = { AIRE: 0, TIERRA: 0, AGUA: 0 };
    historial.forEach(r => {
        if (cuenta[r.tipo] !== undefined) cuenta[r.tipo]++;
    });

    if (document.getElementById('val-aire')) {
        document.getElementById('val-aire').innerText = cuenta.AIRE;
        document.getElementById('val-tierra').innerText = cuenta.TIERRA;
        document.getElementById('val-agua').innerText = cuenta.AGUA;
    }
}

// 6. ACTUALIZACIÓN DE INTERFAZ
function actualizarTodo() {
    generarPanelDiario(); // Refresca los botones de horas
    actualizarTablaHistorial();
    analizarGuacharo();
    calcularBalanceElementos();
    
    // Actualizar indicador del último resultado
    if (historial.length > 0) {
        const ult = historial[historial.length - 1];
        const lastNumDisp = document.getElementById('last-num');
        if (lastNumDisp) lastNumDisp.innerText = `${ult.num} (${ult.animal})`;
    }
}

function actualizarTablaHistorial() {
    const tbody = document.getElementById('lista-historial');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    [...historial].reverse().slice(0, 20).forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.fecha.split('-').reverse().join('/')}</td>
                <td>${r.hora}</td>
                <td><strong>${r.num}</strong></td>
                <td>${r.animal}</td>
                <td>${r.tipo}</td>
            </tr>`;
    });
}
