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

const horasSorteos = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

let historial = [];
let horaSeleccionada = null;

// ==========================================
// INICIO Y CARGA LIGERA
// ==========================================
window.onload = async function() {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Configura la fecha por defecto en los selectores
    if(document.getElementById('fecha-registro')) document.getElementById('fecha-registro').value = hoy;
    if(document.getElementById('fecha-analisis')) document.getElementById('fecha-analisis').value = hoy;
    if(document.getElementById('fecha-historial')) document.getElementById('fecha-historial').value = hoy;

    generarGridAnimales();
    await cargarDatosPorFecha(); // Carga solo lo necesario al inicio
    
    setInterval(actualizarReloj, 1000);
};

function actualizarReloj() {
    const ahora = new Date();
    if(document.getElementById('reloj')) {
        document.getElementById('reloj').innerText = ahora.toLocaleTimeString();
    }
}

// NUEVA FUNCIÓN: Carga datos específicos para evitar pesadez
async function cargarDatosPorFecha() {
    const fechaFiltro = document.getElementById('fecha-historial')?.value;
    if (!fechaFiltro) return;

    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .eq('fecha', fechaFiltro); // Solo trae los datos de la fecha seleccionada

        if (error) throw error;
        
        historial = data || [];
        actualizarInterfaz();
    } catch (err) {
        console.error("Error cargando datos:", err.message);
    }
}

function actualizarInterfaz() {
    generarPanelHoras();
    actualizarTablaHistorial();
    calcularAusenciaGuacharo();
    calcularBalanceElementos();
}

// ==========================================
// RENDERIZADO DE COMPONENTES
// ==========================================
function generarGridAnimales() {
    const grid = document.getElementById('grid-animales');
    if(!grid) return;
    grid.innerHTML = '';

    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-card';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small>${animal.a}</small>`;
        btn.onclick = () => registrarSorteo(animal);
        grid.appendChild(btn);
    });
}

function generarPanelHoras() {
    const panel = document.getElementById('panel-horas');
    if(!panel) return;
    panel.innerHTML = '';

    const fechaAct = document.getElementById('fecha-registro').value;

    horasSorteos.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        
        const registro = historial.find(r => r.fecha === fechaAct && r.hora === hora);
        
        if(registro) {
            box.classList.add('cargado');
            box.innerHTML = `<span>${hora}</span><br><strong>${registro.num}</strong>`;
        } else {
            box.innerText = hora;
        }

        if(hora === horaSeleccionada) box.classList.add('seleccionada');

        box.onclick = () => {
            horaSeleccionada = hora;
            generarPanelHoras();
        };
        panel.appendChild(box);
    });
}

// ORDENACIÓN Y FILTRADO DEL HISTORIAL
function actualizarTablaHistorial() {
    const tabla = document.getElementById('tabla-cuerpo');
    if(!tabla) return;
    tabla.innerHTML = '';

    // Ordenar por hora (más reciente arriba)
    const datosOrdenados = [...historial].sort((a, b) => {
        return horasSorteos.indexOf(b.hora) - horasSorteos.indexOf(a.hora);
    });

    if(datosOrdenados.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5">No hay datos para esta fecha</td></tr>';
        return;
    }

    datosOrdenados.forEach(reg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.fecha}</td>
            <td>${reg.hora}</td>
            <td>${reg.num}</td>
            <td>${reg.animal}</td>
            <td>${reg.tipo}</td>
        `;
        tabla.appendChild(tr);
    });
}

// ==========================================
// ACCIONES DE BASE DE DATOS
// ==========================================
async function registrarSorteo(animal) {
    if(!horaSeleccionada) {
        alert("Primero selecciona una hora");
        return;
    }

    const fecha = document.getElementById('fecha-registro').value;

    const nuevoRegistro = {
        fecha: fecha,
        hora: horaSeleccionada,
        num: animal.n,
        animal: animal.a,
        tipo: animal.t
    };

    try {
        const { error } = await _supabase
            .from('historial_sorteos')
            .upsert(nuevoRegistro);

        if(error) throw error;
        
        await cargarDatosPorFecha(); // Recarga solo el día actual
        horaSeleccionada = null; 
    } catch (err) {
        alert("Error al guardar");
    }
}

// ==========================================
// CÁLCULOS ADICIONALES
// ==========================================
function calcularAusenciaGuacharo() {
    const display = document.getElementById('dias-ausente');
    if(!display) return;

    // Aquí puedes mantener tu lógica original de conteo sobre 'historial'
    let contador = 0;
    const historialOrdenado = [...historial].sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
    
    for(let r of historialOrdenado) {
        if(r.num === '75') break;
        contador++;
    }
    display.innerText = contador;
}

function calcularBalanceElementos() {
    let counts = { TIERRA: 0, AIRE: 0, AGUA: 0 };
    historial.forEach(r => { if(counts[r.tipo] !== undefined) counts[r.tipo]++; });
    
    if(document.getElementById('val-tierra')) {
        document.getElementById('val-tierra').innerText = counts.TIERRA;
        document.getElementById('val-aire').innerText = counts.AIRE;
        document.getElementById('val-agua').innerText = counts.AGUA;
    }
}
