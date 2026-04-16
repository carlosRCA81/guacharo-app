// ==========================================
// CONFIGURACIÓN SUPABASE (SE MANTIENE INTACTA)
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

// Inicialización profesional
async function inicializarSistema() {
    const fAnalisis = document.getElementById('fecha-analisis');
    const fHistorial = document.getElementById('fecha-busqueda-historial');
    const hoy = new Date().toISOString().split('T')[0];
    
    if(fAnalisis) fAnalisis.value = hoy;
    if(fHistorial) fHistorial.value = hoy;

    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

// Carga optimizada
async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (data) {
            historial = data;
            actualizarInterfaz();
        }
    } catch (err) { console.log("Error de red"); }
}

// ESTUDIO DEL ALGORITMO (Antes y Después)
function estudiarAnimalPatron() {
    const numBuscado = document.getElementById('select-estudio-animal').value;
    const resDiv = document.getElementById('resultado-patron-avanzado');
    if(!numBuscado) return;

    let antes = {};
    let despues = {};

    // Ordenar historial cronológicamente para el estudio
    const hOrdenado = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    hOrdenado.forEach((reg, idx) => {
        if(reg.num === numBuscado) {
            if(idx > 0) {
                let ant = hOrdenado[idx-1].num + " - " + hOrdenado[idx-1].animal;
                antes[ant] = (antes[ant] || 0) + 1;
            }
            if(idx < hOrdenado.length - 1) {
                let sig = hOrdenado[idx+1].num + " - " + hOrdenado[idx+1].animal;
                despues[sig] = (despues[sig] || 0) + 1;
            }
        }
    });

    const obtenerTop = (obj) => Object.entries(obj).sort((a,b) => b[1]-a[1])[0] || ["N/A", 0];
    const topAntes = obtenerTop(antes);
    const topDespues = obtenerTop(despues);

    resDiv.innerHTML = `
        <div class="card-estudio">
            <p>💡 Cuando sale el <b>${numBuscado}</b>:</p>
            <p>Suele salir ANTES: <b>${topAntes[0]}</b> (${topAntes[1]} veces)</p>
            <p>Suele salir DESPUÉS: <b>${topDespues[0]}</b> (${topDespues[1]} veces)</p>
        </div>
    `;
}

// DETECTOR DE JUGADAS ESPECIALES (Algoritmo en tiempo real)
function detectarJugadasEspeciales() {
    const alertCont = document.getElementById('alertas-algoritmo');
    if(!alertCont) return;
    alertCont.innerHTML = '';

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    if(sorteosHoy.length < 2) return;

    const ult = sorteosHoy[sorteosHoy.length - 1];
    const penult = sorteosHoy[sorteosHoy.length - 2];

    // 1. Detectar Espejo (ej. 12 y 21)
    const revUlt = ult.num.split('').reverse().join('');
    if(revUlt === penult.num && ult.num !== penult.num) {
        alertCont.innerHTML += `<span class="badge bg-espejo">🔄 ESPEJO DETECTADO (${penult.num} -> ${ult.num})</span>`;
    }

    // 2. Detectar Escalera (ej. 05 y 06)
    const n1 = parseInt(ult.num);
    const n2 = parseInt(penult.num);
    if(Math.abs(n1 - n2) === 1) {
        alertCont.innerHTML += `<span class="badge bg-escalera">📈 POSIBLE ESCALERA</span>`;
    }

    // 3. Detectar Repetición de Elemento
    if(ult.tipo === penult.tipo) {
        alertCont.innerHTML += `<span class="badge bg-repetido">🔥 SEGUIDILLA DE ${ult.tipo}</span>`;
    }
}

// REGISTRO (CON TU CONEXIÓN SUPABASE ORIGINAL)
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num: num.toString(), animal, tipo };

    // Update local
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevoRegistro; else historial.push(nuevoRegistro);
    
    actualizarInterfaz();

    try {
        await _supabase.from('historial_sorteos').upsert(nuevoRegistro, { onConflict: 'fecha,hora' });
    } catch (e) { console.error("Error nube"); }
}

// TABLA CON FILTRO DE FECHA (Para velocidad)
function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    const filtroFecha = document.getElementById('fecha-busqueda-historial').value;
    if(!cuerpo) return;
    cuerpo.innerHTML = '';

    historial
        .filter(r => r.fecha === filtroFecha) // AQUÍ ESTÁ EL FILTRO QUE LA HACE RÁPIDA
        .sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora))
        .forEach(r => {
            const guacharoClass = r.num === '75' ? 'class="row-guacharo"' : '';
            cuerpo.innerHTML += `<tr ${guacharoClass}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
        });
}

// FUNCIONES AUXILIARES
function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    const fechaActual = document.getElementById('fecha-analisis').value;
    if(!panel) return;
    panel.innerHTML = '';

    horasSorteo.forEach(hora => {
        const reg = historial.find(r => r.fecha === fechaActual && r.hora === hora);
        const box = document.createElement('div');
        box.className = `hora-box ${reg ? 'jugado' : ''} ${hora === horaSeleccionadaActiva ? 'active-select' : ''}`;
        box.innerHTML = reg ? `${hora}<br><b>${reg.num}</b>` : hora;
        box.onclick = () => { horaSeleccionadaActiva = hora; generarPanelDiario(); };
        panel.appendChild(box);
    });
}

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Elige una HORA");
    const val = document.getElementById('num-rapido').value.padStart(2, '0').replace('000', '00');
    const ani = listaAnimales.find(a => a.n === val || (val === '0' && a.n === '0'));
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function llenarSelectorEstudio() {
    const sel = document.getElementById('select-estudio-animal');
    if(!sel) return;
    listaAnimales.forEach(a => {
        sel.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`;
    });
}

function analizarGuacharo() {
    let sin75 = 0;
    const hO = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    for(let i = hO.length-1; i >= 0; i--) { if(hO[i].num === '75') break; sin75++; }
    document.getElementById('dias-sin-75').innerText = sin75;
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla();
    analizarGuacharo();
    detectarJugadasEspeciales();
}

function openTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function generarGridBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const d = document.createElement('div');
        d.className = 'animal-btn';
        d.innerHTML = `<b>${a.n}</b><br>${a.a}`;
        d.onclick = () => { if(horaSeleccionadaActiva) registrarSorteo(a.n, a.a, a.t, horaSeleccionadaActiva); };
        cont.appendChild(d);
    });
}

setInterval(() => {
    const c = document.getElementById('live-clock');
    if(c) c.innerText = new Date().toLocaleTimeString();
}, 1000);

window.onload = inicializarSistema;
