/* LÓGICA INTEGRAL ANALIZADOR CRCA - VERSIÓN OPTIMIZADA CON ALMANAQUE */

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
let historial = []; // Historial filtrado que se muestra en pantalla
let horaSeleccionadaActiva = null;

// RELOJ EN VIVO
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

// NAVEGACIÓN
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// INICIALIZACIÓN (Solo carga lo de HOY para ser rápido)
async function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha-analisis');
    const fechaHistorial = document.getElementById('fecha-consulta-historial');

    if(fechaInput) {
        fechaInput.value = hoy;
        fechaInput.addEventListener('change', generarPanelDiario);
    }
    if(fechaHistorial) {
        fechaHistorial.value = hoy;
    }

    // Carga inicial optimizada
    await consultarFechaEspecifica(); 
}

// ALMANAQUE: CONSULTA INTELIGENTE POR FECHA
async function consultarFechaEspecifica() {
    const fechaSeleccionada = document.getElementById('fecha-consulta-historial').value;
    const cuerpo = document.getElementById('lista-historial');
    
    if(!cuerpo) return;
    cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Cargando día seleccionado...</td></tr>';

    try {
        // Consultamos a la nube filtrando solo por la fecha del almanaque
        const respuesta = await fetch(`https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/historial?fecha=${fechaSeleccionada}`);
        let datos = await respuesta.json();

        if (datos && datos.length > 0) {
            // ORDEN AUTOMÁTICO: Ordenamos por la posición en la lista de horasSorteo
            datos.sort((a, b) => {
                return horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora);
            });

            historial = datos; // Actualizamos el historial local con los datos del día
            actualizarTabla();
            analizarGuacharo();
        } else {
            cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#ef4444;">Sin resultados para esta fecha</td></tr>';
            historial = [];
            analizarGuacharo();
        }
    } catch (error) {
        console.error("Error en consulta:", error);
        cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:#ef4444;">Error de red</td></tr>';
    }
}

// ACTUALIZAR TABLA (Solo dibuja lo filtrado)
function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    
    historial.forEach(r => {
        const filaEspecial = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `
            <tr ${filaEspecial}>
                <td>${r.fecha}</td>
                <td>${r.hora}</td>
                <td>${r.num}</td>
                <td>${r.animal}</td>
                <td>${r.tipo}</td>
            </tr>`;
    });
}

// REGISTRO DE SORTEOS (Envío a la nube)
async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo };

    // Actualización visual rápida en el panel diario
    const existeIdx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (existeIdx !== -1) historial.splice(existeIdx, 1);
    historial.unshift(nuevoRegistro);
    
    // Re-ordenar y actualizar vistas
    historial.sort((a, b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    actualizarInterfaz();

    try {
        await fetch('https://analizador-crca-cloud-main-pzhkdp.free.laravel.cloud/api/guardar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuevoRegistro)
        });
    } catch (error) {
        console.error("Error guardando sorteo:", error);
    }
}

// FUNCIONES COMPLEMENTARIAS
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

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            document.querySelectorAll('.hora-box').forEach(b => b.style.border = '1px solid #475569');
            box.style.border = '2px solid #38bdf8';
        };
        panel.appendChild(box);
    });
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
            if (!horaSeleccionadaActiva) return alert("Selecciona una HORA primero");
            registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        };
        container.appendChild(btn);
    });
}

function registrarPorNumero() {
    if (!horaSeleccionadaActiva) return alert("Selecciona una HORA primero");
    const input = document.getElementById('num-rapido');
    let n = input.value.trim();
    if(n !== "0" && n !== "00" && n.length === 1) n = "0" + n;
    const animal = listaAnimales.find(a => a.n === n);
    if (animal) {
        registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        input.value = '';
    } else {
        alert("Número no válido");
    }
}

function actualizarInterfaz() {
    if(historial.length > 0) {
        const ult = historial[0];
        document.getElementById('last-num').innerText = `${ult.num} - ${ult.animal}`;
    }
    actualizarTabla();
    analizarGuacharo();
    generarPanelDiario();
}

function analizarGuacharo() {
    let sin75 = 0;
    const display = document.getElementById('dias-sin-75');
    if(!display) return;
    // Esta lógica asume que el historial tiene todos los datos para contar, 
    // si no, se puede ajustar para pedir el conteo a la API.
    for(let i = 0; i < historial.length; i++) {
        if(historial[i].num === '75') break;
        sin75++;
    }
    display.innerText = sin75;
}

function llenarSelectEstudio() {
    const sel = document.getElementById('select-animal-estudio');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- Elige Animal --</option>';
    listaAnimales.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.n;
        opt.innerText = `${a.n} - ${a.a}`;
        sel.appendChild(opt);
    });
}

// Inicializar al cargar
window.onload = inicializarSistema;
