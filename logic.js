// ==========================================
// CONFIGURACIÓN SUPABASE (INTACTA)
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

async function inicializarSistema() {
    document.getElementById('fecha-analisis').value = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-busqueda-historial').value = new Date().toISOString().split('T')[0];
    generarGridBotones();
    llenarSelectorEstudio();
    await cargarHistorialRemoto();
}

async function cargarHistorialRemoto() {
    try {
        const { data } = await _supabase.from('historial_sorteos').select('*').order('fecha', { ascending: false });
        if (data) { historial = data; actualizarInterfaz(); }
    } catch (e) { console.error("Error Supabase"); }
}

// ==========================================
// NUEVO MOTOR: CACHADOR DE SECUENCIAS E INTELIGENCIA 🧠
// ==========================================

function buscarDiaGemelo() {
    const alertCont = document.getElementById('alertas-algoritmo');
    const infoAvanzada = document.getElementById('resultado-patron-avanzado');
    if (!alertCont || historial.length < 20) return;

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora)).map(r => r.num);
    if (sorteosHoy.length < 2) return;

    // AGRUPAR POR DÍAS PARA BUSCAR SECUENCIAS
    const diasPasados = {};
    historial.forEach(r => {
        if (r.fecha !== fechaHoy) {
            if (!diasPasados[r.fecha]) diasPasados[r.fecha] = [];
            diasPasados[r.fecha].push({num: r.num, hora: r.hora});
        }
    });

    let mejoresCoincidencias = [];

    for (const [fecha, datos] of Object.entries(diasPasados)) {
        const numsPasados = datos.map(d => d.num);
        let coincidencias = sorteosHoy.filter(n => numsPasados.includes(n)).length;
        
        if (coincidencias >= 2) {
            mejoresCoincidencias.push({ fecha, puntos: coincidencias, todos: numsPasados });
        }
    }

    // ORDENAR POR LAS QUE MÁS SE PARECEN A HOY
    mejoresCoincidencias.sort((a,b) => b.puntos - a.puntos);

    if (mejoresCoincidencias.length > 0) {
        const top = mejoresCoincidencias[0];
        alertCont.innerHTML = `<div class="badge bg-primary m-1">🧠 SECUENCIA DETECTADA: El día ${top.fecha} tuvo ${top.puntos} iguales a hoy</div>`;
        
        // EXTRAER QUÉ NÚMEROS SALIERON EN ESOS DÍAS QUE HOY NO HAN SALIDO
        let sugeridosPorSecuencia = top.todos.filter(n => !sorteosHoy.includes(n)).slice(0,4);
        
        if (infoAvanzada && sugeridosPorSecuencia.length > 0) {
            infoAvanzada.innerHTML = `
                <div style="background:#0f172a; border: 2px solid #3b82f6; color:white; padding:15px; border-radius:10px;">
                    <h5 style="color:#3b82f6; margin-bottom:10px;">🧠 ANALIZADOR DE HISTORIA:</h5>
                    <p>El día <b>${top.fecha}</b> salieron los mismos números. En esa ocasión, también salieron:</p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        ${sugeridosPorSecuencia.map(n => `<span style="background:#3b82f6; padding:5px 15px; border-radius:50px; font-weight:bold;">${n}</span>`).join('')}
                    </div>
                    <p style="font-size:0.8rem; margin-top:10px; color:#94a3b8;">* Estos números completaron la secuencia en el pasado.</p>
                </div>
            `;
        }
    }
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    if (!display || historial.length < 10) return;

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historial.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    if (hoy.length === 0) return;

    const ultimoNum = hoy[hoy.length - 1].num;
    
    // JALES INTELIGENTES (Ejemplo: 35 jala 08, 25)
    let jalesManuales = {
        '35': ['08', '25', '14'],
        '26': ['62', '11', '23'],
        '16': ['11', '23', '04'],
        '75': ['00', '10', '20']
    };

    let sugeridos = jalesManuales[ultimoNum] || [];

    // Si no hay jale manual, buscar en base de datos
    if (sugeridos.length === 0) {
        let f = {};
        for(let i=0; i < historial.length - 1; i++) {
            if(historial[i].num === ultimoNum) {
                let sig = historial[i+1].num;
                f[sig] = (f[sig] || 0) + 1;
            }
        }
        sugeridos = Object.entries(f).sort((a,b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    }

    display.innerHTML = sugeridos.map(n => `<span style="background:#0f172a; padding: 5px 12px; border-radius: 5px; border: 1px solid #ef4444; color:white; font-weight:bold; margin-right:5px;">${n}</span>`).join('');
}

function calcularPrediccionTotal() {
    const cont = document.getElementById('contenedor-fijos');
    if(!cont || historial.length < 10) return;

    // TRIPLETA BLINDADA (Fijos del día)
    let frec = {};
    const hoy = new Date().getDay();
    historial.filter(r => new Date(r.fecha).getDay() === hoy)
             .forEach(r => frec[r.num] = (frec[r.num] || 0) + 1);

    let tripleta = Object.entries(frec).sort((a,b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    
    // Ajuste por Deuda Histórica (El 75 y 23)
    if (!tripleta.includes('23')) tripleta[2] = '23';

    cont.innerHTML = tripleta.map(f => `<div class="dato-fijo" style="background:#ef4444; border:none; color:white; font-weight:bold;">${f}</div>`).join('');
}

// ==========================================
// REGISTRO Y UI (MANTENIDAS)
// ==========================================

async function registrarSorteo(num, animal, tipo, hora) {
    const fecha = document.getElementById('fecha-analisis').value;
    const nuevo = { fecha, hora, num: num.toString(), animal, tipo };
    const idx = historial.findIndex(r => r.fecha === fecha && r.hora === hora);
    if(idx !== -1) historial[idx] = nuevo; else historial.unshift(nuevo);
    actualizarInterfaz();
    try { await _supabase.from('historial_sorteos').upsert(nuevo, { onConflict: 'fecha,hora' }); } catch (e) { }
}

function actualizarInterfaz() {
    analizarGuacharo();
    calcularPrediccionTotal();
    actualizarJugadaSniper(); 
    buscarDiaGemelo();
    actualizarTabla();
    generarPanelDiario();
    detectarJugadasEspeciales();
}

function analizarGuacharo() {
    const hO = [...historial].sort((a,b) => b.fecha.localeCompare(a.fecha) || horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    let index75 = hO.findIndex(r => r.num === '75');
    let sorteosSin75 = index75 === -1 ? hO.length : index75;
    const display = document.getElementById('dias-sin-75');
    if(display) {
        display.innerText = sorteosSin75;
        if(sorteosSin75 > 30) display.style.color = "#ef4444";
    }
}

function actualizarTabla() {
    const c = document.getElementById('lista-historial');
    const f = document.getElementById('fecha-busqueda-historial').value;
    if(!c) return;
    c.innerHTML = '';
    historial.filter(r => r.fecha === f).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora)).forEach(r => {
        c.innerHTML += `<tr ${r.num==='75'?'class="row-guacharo"':''}><td>${r.fecha}</td><td>${r.hora}</td><td>${r.num}</td><td>${r.animal}</td></tr>`;
    });
}

function generarPanelDiario() {
    const p = document.getElementById('panel-diario-sorteos');
    const f = document.getElementById('fecha-analisis').value;
    if(!p) return;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const r = historial.find(x => x.fecha === f && x.hora === h);
        const b = document.createElement('div');
        b.className = `hora-box ${r?'jugado':''} ${h===horaSeleccionadaActiva?'active-select':''}`;
        b.innerHTML = r ? `${h}<br><b>${r.num}</b>` : h;
        b.onclick = () => { horaSeleccionadaActiva = h; generarPanelDiario(); };
        p.appendChild(b);
    });
}

function registrarPorNumero() {
    if(!horaSeleccionadaActiva) return alert("Selecciona una hora primero");
    let v = document.getElementById('num-rapido').value.padStart(2, '0').replace('000','00');
    if(v === '0' && document.getElementById('num-rapido').value !== '00') v = '0';
    const ani = listaAnimales.find(a => a.n === v);
    if(ani) registrarSorteo(ani.n, ani.a, ani.t, horaSeleccionadaActiva);
    document.getElementById('num-rapido').value = '';
}

function detectarJugadasEspeciales() {
    const alertCont = document.getElementById('alertas-algoritmo');
    const hoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === hoy).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    if(sorteosHoy.length < 2 || !alertCont) return;
    alertCont.innerHTML = '';
    const ult = sorteosHoy[sorteosHoy.length-1];
    const pen = sorteosHoy[sorteosHoy.length-2];
    if(ult.num.split('').reverse().join('').padStart(2,'0') === pen.num) alertCont.innerHTML += `<span class="badge bg-warning text-dark">🔄 ESPEJO</span>`;
    if(Math.abs(parseInt(ult.num) - parseInt(pen.num)) === 1) alertCont.innerHTML += `<span class="badge bg-info">📈 ESCALERA</span>`;
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

function openTab(evt, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(n).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function llenarSelectorEstudio() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

setInterval(() => { 
    const c = document.getElementById('live-clock');
    if(c) c.innerText = new Date().toLocaleTimeString(); 
}, 1000);

window.onload = inicializarSistema;
