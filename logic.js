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

// Inicio del sistema
async function inicializarSistema() {
    generarGridBotones();
    llenarSelectEstudio();
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-historial').value = hoy;
    
    // Conectar el botón BUSCAR del historial
    const btnBuscarHistorial = document.querySelector('.tab-content button[onclick="cargarHistorialPorFecha()"]') || document.querySelector('button.btn-buscar');
    if(btnBuscarHistorial) btnBuscarHistorial.onclick = cargarHistorialPorFecha;

    // Conectar botón VER de patrones
    const btnVerPatrones = document.querySelector('button[onclick="verPatrones()"]');
    if(btnVerPatrones) btnVerPatrones.onclick = analizarPatrones;

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
        };
        panel.appendChild(box);
    });
}

// CARGAR HISTORIAL (Esta es la que te fallaba)
async function cargarHistorialPorFecha() {
    const fechaBusqueda = document.getElementById('fecha-historial').value;
    const tabla = document.getElementById('lista-historial');
    if(!tabla) return;
    
    tabla.innerHTML = '<tr><td colspan="5">Buscando en base de datos...</td></tr>';

    const { data, error } = await _supabase
        .from('historial_sorteos')
        .select('*')
        .eq('fecha', fechaBusqueda)
        .order('hora', { ascending: true });

    if (error) {
        tabla.innerHTML = '<tr><td colspan="5">Error al cargar datos</td></tr>';
        return;
    }

    if (data.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5">No hay resultados para esta fecha</td></tr>';
    } else {
        tabla.innerHTML = '';
        data.forEach(r => {
            const esGuacharo = r.num === '75' ? 'style="background: rgba(255, 179, 0, 0.2);"' : '';
            tabla.innerHTML += `
                <tr ${esGuacharo}>
                    <td>${r.fecha}</td>
                    <td>${r.hora}</td>
                    <td><strong>${r.num}</strong></td>
                    <td>${r.animal}</td>
                    <td>${r.tipo}</td>
                </tr>`;
        });
    }
}

async function cargarHistorialRecuperacion() {
    const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false}).limit(500);
    if (data) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    if(historial.length > 0) {
        const sorted = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
        const last = document.getElementById('last-num');
        if(last) last.innerText = `${sorted[0].num} - ${sorted[0].animal}`;
    }
    analizarGuacharo();
    generarPanelDiario();
    calcularBalanceElementos();
    detectarDormidos();
}

function analizarGuacharo() {
    let sin75 = 0;
    let total75 = 0;
    const sorted = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    sorted.forEach(r => { if(r.num === '75') total75++; });

    for(let i = sorted.length-1; i >= 0; i--) {
        if(sorted[i].num === '75') break;
        sin75++;
    }
    
    const diasAusente = document.getElementById('dias-sin-75');
    if(diasAusente) diasAusente.innerText = sin75;

    const display = document.getElementById('analisis-jugada');
    if(display) {
        display.innerHTML = `
            <div style="color:#ffb300; font-size:1.1em;">Apariciones totales del 75: <b>${total75}</b></div>
            <hr style="border-color: #333;">
            <div style="color:#00e676;">🎯 SUGERIDOS: 75 - 59 - 44</div>
        `;
    }
}

function analizarPatrones() {
    const numSel = document.getElementById('select-animal-estudio').value;
    const display = document.getElementById('analisis-jugada');
    
    if(!numSel) return alert("Selecciona un animal");

    let rastro = [];
    const sorted = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    for(let i = 0; i < sorted.length - 1; i++) {
        if(sorted[i].num === numSel) {
            rastro.push(`<b>${sorted[i+1].num}</b> (${sorted[i+1].animal})`);
        }
    }

    if(display) {
        display.innerHTML = rastro.length > 0 
            ? `<strong>Después del ${numSel} han salido:</strong><br>${[...new Set(rastro)].join(', ')}`
            : "No hay datos suficientes para crear un patrón.";
    }
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num, animal, tipo };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (idx !== -1) historial.splice(idx, 1);
    historial.push(nuevo);
    actualizarInterfaz();
    await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' });
}

function calcularBalanceElementos() {
    const fecha = document.getElementById('fecha-analisis').value;
    let counts = { TIERRA: 0, AIRE: 0, AGUA: 0 };
    historial.filter(r => r.fecha === fecha).forEach(r => { counts[r.tipo]++; });
    if(document.getElementById('val-tierra')) document.getElementById('val-tierra').innerText = counts.TIERRA;
    if(document.getElementById('val-aire')) document.getElementById('val-aire').innerText = counts.AIRE;
    if(document.getElementById('val-agua')) document.getElementById('val-agua').innerText = counts.AGUA;
}

function detectarDormidos() {
    let dormidos = [];
    listaAnimales.forEach(ani => {
        if(!historial.some(r => r.num === ani.n)) dormidos.push(ani.n);
    });
    const lista = document.getElementById('lista-dormidos');
    if(lista) lista.innerText = dormidos.slice(0,12).join(', ') + "...";
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- Selecciona --</option>';
    listaAnimales.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.n; opt.innerText = `${a.n} - ${a.a}`; sel.appendChild(opt);
    });
}

window.onload = inicializarSistema;
