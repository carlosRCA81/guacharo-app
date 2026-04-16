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

// RELOJ EN VIVO
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

async function inicializarSistema() {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha-analisis');
    if(fechaInput) {
        fechaInput.value = hoy;
        fechaInput.addEventListener('change', () => { generarPanelDiario(); ejecutarEstudio(); });
    }
    document.getElementById('fecha-busqueda-historial').value = hoy;

    generarGridBotones();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*');
    if (data) {
        historial = data;
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    generarPanelDiario();
    actualizarTabla(); 
    ejecutarEstudio();
    actualizarContadorGuacharo();
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
            box.innerHTML = `<strong>${hora}</strong><br>${reg.num}`;
        } else {
            box.innerText = hora;
        }

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.classList.remove('active-select'));
            box.classList.add('active-select');
        };
        panel.appendChild(box);
    });
}

function ejecutarEstudio() {
    const alertaDiv = document.getElementById('alerta-probabilidad');
    const hoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === hoy)
                                .sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    let html = "";
    
    // Sugerencia basada en frecuencia
    const conteo = {};
    historial.forEach(r => conteo[r.num] = (conteo[r.num] || 0) + 1);
    const top3 = Object.entries(conteo).sort((a,b) => b[1] - a[1]).slice(0,3).map(e => e[0]);
    html += `<div style="color:#fbbf24; font-size:0.75rem; margin-bottom:5px;">📊 SUGERIDOS: ${top3.join(' - ')}</div>`;

    if(sorteosHoy.length > 0) {
        const ult = sorteosHoy[sorteosHoy.length - 1];
        // Espejo
        let esp = ult.num.split('').reverse().join('').padStart(2, '0');
        if(parseInt(esp) <= 75) html += `<span class="badge espejito">ESPEJO: ${esp}</span>`;
        // Escalera
        let esc = (parseInt(ult.num) + 1).toString().padStart(2, '0');
        if(parseInt(esc) <= 75) html += `<span class="badge escalera">ESCALERA: ${esc}</span>`;
    }
    alertaDiv.innerHTML = html || "Esperando datos del día...";
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo };

    // Actualización local rápida
    historial = historial.filter(r => !(r.fecha === fecha && r.hora === hora));
    historial.push(nuevoRegistro);
    actualizarInterfaz();

    // Guardar en Supabase con el comando correcto
    const { error } = await _supabase.from('historial_sorteos').upsert(nuevoRegistro, { onConflict: 'fecha,hora' });
    if(error) alert("Error al guardar: " + error.message);
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("¡Toca una HORA primero!");
    let v = document.getElementById('num-rapido').value.trim();
    if (v.length === 1 && v !== "0") v = "0" + v;
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) {
        registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
        document.getElementById('num-rapido').value = '';
    } else {
        alert("Número no válido (0-75)");
    }
}

function generarGridBotones() {
    const c = document.getElementById('grid-container');
    c.innerHTML = '';
    listaAnimales.forEach(a => {
        const b = document.createElement('div');
        b.style = "background:#334155; padding:5px; text-align:center; border-radius:4px; cursor:pointer; font-size:0.65rem; color:white;";
        b.innerHTML = `<strong>${a.n}</strong><br>${a.a}`;
        b.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Selecciona HORA primero");
            registrarSorteo(a.n, a.a, a.t, horaSeleccionadaActiva);
        };
        c.appendChild(b);
    });
}

function actualizarTabla(datos = null) {
    const cuerpo = document.getElementById('lista-historial');
    cuerpo.innerHTML = '';
    
    // Ordenar: fecha más reciente primero, y hora más tarde primero
    const lista = datos || [...historial].sort((a, b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora)).slice(0, 30);

    lista.forEach(r => {
        const rowCls = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${rowCls}>
            <td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td>
        </tr>`;
    });
}

function buscarHistorialPorFecha() {
    const f = document.getElementById('fecha-busqueda-historial').value;
    const filtrados = historial.filter(r => r.fecha === f);
    actualizarTabla(filtrados);
}

function actualizarContadorGuacharo() {
    let sin75 = 0;
    const ord = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    for(let i = ord.length-1; i >= 0; i--) {
        if(ord[i].num === '75') break;
        sin75++;
    }
    document.getElementById('dias-sin-75').innerText = sin75;
}

function openTab(evt, name) {
    let content = document.getElementsByClassName("tab-content");
    for (let i = 0; i < content.length; i++) content[i].style.display = "none";
    let links = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < links.length; i++) links[i].classList.remove("active");
    document.getElementById(name).style.display = "block";
    evt.currentTarget.classList.add("active");
}

window.onload = inicializarSistema;
