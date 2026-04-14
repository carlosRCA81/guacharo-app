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
let historial = []; // Historial filtrado/actual
let horaSeleccionadaActiva = null;

async function inicializarSistema() {
    generarPanelDiario();
    generarGridBotones();
    llenarSelectEstudio();
    
    const fechaInput = document.getElementById('fecha-analisis');
    const hoy = new Date();
    if(fechaInput) {
        fechaInput.value = hoy.toISOString().split('T')[0];
        fechaInput.addEventListener('change', generarPanelDiario);
    }

    // Ajustar filtros de historial al mes actual
    document.getElementById('filtro-mes').value = String(hoy.getMonth() + 1).padStart(2, '0');
    
    await cargarHistorialRemoto(); // Carga inicial
}

function generarGridBotones() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    listaAnimales.forEach(animal => {
        const btn = document.createElement('div');
        btn.className = 'animal-btn';
        btn.innerHTML = `<strong>${animal.n}</strong><br><small style="font-size:0.6rem;">${animal.a}</small>`;
        btn.onclick = () => {
            if (!horaSeleccionadaActiva) return alert("Selecciona una HORA arriba");
            registrarSorteo(animal.n, animal.a, animal.t, horaSeleccionadaActiva);
        };
        container.appendChild(btn);
    });
}

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevoRegistro = { fecha, hora, num, animal, tipo };

    // Optimización: Solo insertamos en la nube
    try {
        const { error } = await _supabase.from('historial_sorteos').upsert(nuevoRegistro, { onConflict: 'fecha,hora' });
        if(error) throw error;
        
        // Actualizamos lista local para ver el cambio
        const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
        if(idx !== -1) historial[idx] = nuevoRegistro;
        else historial.push(nuevoRegistro);
        
        actualizarInterfaz();
    } catch (err) { alert("Error al guardar: " + err.message); }
}

async function cargarHistorialRemoto() {
    const mes = document.getElementById('filtro-mes').value;
    const anio = document.getElementById('filtro-anio').value;
    const inicio = `${anio}-${mes}-01`;
    const fin = `${anio}-${mes}-31`;

    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .gte('fecha', inicio)
            .lte('fecha', fin)
            .order('fecha', { ascending: false });

        if (error) throw error;
        historial = data || [];
        actualizarInterfaz();
    } catch (err) { console.error("Error cargando datos"); }
}

function cargarHistorialFiltrado() {
    cargarHistorialRemoto();
}

function actualizarInterfaz() {
    // Ordenar para cálculos (de más viejo a más nuevo)
    const sorted = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    
    if(sorted.length > 0) {
        const ult = sorted[sorted.length-1];
        document.getElementById('last-num').innerText = `${ult.num} - ${ult.animal}`;
    }

    actualizarTabla();
    analizarGuacharo(sorted);
    generarPanelDiario();
}

function actualizarTabla() {
    const cuerpo = document.getElementById('lista-historial');
    if(!cuerpo) return;
    cuerpo.innerHTML = '';
    
    // En la tabla queremos lo más reciente arriba
    [...historial].sort((a, b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora))
    .forEach(r => {
        const rowClass = r.num === '75' ? 'class="row-guacharo"' : '';
        cuerpo.innerHTML += `<tr ${rowClass}><td>${r.fecha.split('-').slice(1).join('/')}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
    });
}

function generarPanelDiario() {
    const panel = document.getElementById('panel-diario-sorteos');
    const fechaSel = document.getElementById('fecha-analisis').value;
    if(!panel) return;
    panel.innerHTML = '';

    horasSorteo.forEach(hora => {
        const box = document.createElement('div');
        box.className = 'hora-box';
        const reg = historial.find(r => r.fecha === fechaSel && r.hora === hora);
        
        if (reg) {
            box.classList.add('jugado');
            box.innerText = `${hora}\n(${reg.num})`;
        } else {
            box.innerText = hora;
        }

        if(hora === horaSeleccionadaActiva) box.classList.add('active-select');

        box.onclick = () => {
            horaSeleccionadaActiva = hora;
            generarPanelDiario(); // Refrescar selección visual
            document.getElementById('num-rapido').focus();
        };
        panel.appendChild(box);
    });
}

function analizarGuacharo(sortedData) {
    let sin75 = 0;
    for(let i = sortedData.length-1; i >= 0; i--) {
        if(sortedData[i].num === '75') break;
        sin75++;
    }
    document.getElementById('dias-sin-75').innerText = sin75;

    const resEstudio = document.getElementById('resultado-patrones-guacharo');
    const alertaProb = document.getElementById('alerta-probabilidad');

    let anunciantes = {};
    sortedData.forEach((reg, idx) => {
        if (reg.num === '75' && idx > 0) {
            const ant = sortedData[idx-1].num + " - " + sortedData[idx-1].animal;
            anunciantes[ant] = (anunciantes[ant] || 0) + 1;
        }
    });

    const keys = Object.keys(anunciantes);
    if(keys.length > 0) {
        const masFrec = keys.reduce((a, b) => anunciantes[a] > anunciantes[b] ? a : b);
        resEstudio.innerHTML = `<div class="stat-card-mini" style="border-left:4px solid #fbbf24; background:#1e293b; padding:10px; border-radius:8px;">
            <h4 style="color:#fbbf24; margin:0;">ANUNCIANTE (75)</h4>
            <p style="margin:5px 0; font-size:0.8rem;">Suele avisar al Guácharo: <strong>${masFrec}</strong></p>
        </div>`;
        
        const ultimo = sortedData[sortedData.length-1];
        if(ultimo && (ultimo.num + " - " + ultimo.animal) === masFrec) {
            alertaProb.innerHTML = '<span class="probabilidad-alta">🔥 ¡SEÑAL DETECTADA! Guácharo cerca.</span>';
        } else {
            alertaProb.innerText = "Esperando anunciante...";
        }
    }
}

function registrarPorNumero() {
    const val = document.getElementById('num-rapido').value.trim();
    if(!val) return;
    let num = val;
    if(num !== "0" && num !== "00" && num.length === 1) num = "0" + num;
    const ani = listaAnimales.find(a => a.n === num);
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    else alert("Número no existe");
    document.getElementById('num-rapido').value = '';
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

window.onload = inicializarSistema;
