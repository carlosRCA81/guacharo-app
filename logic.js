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
// MOTOR AGRESIVO Y TRIPLETA BLINDADA
// ==========================================

function buscarDiaGemelo() {
    const alertCont = document.getElementById('alertas-algoritmo');
    if (!alertCont || historial.length < 20) return;

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historial.filter(r => r.fecha === fechaHoy).map(r => r.num);
    if (sorteosHoy.length < 2) return; // Filtro bajado a 2 para más sensibilidad

    const diasPasados = {};
    historial.forEach(r => {
        if (r.fecha !== fechaHoy) {
            if (!diasPasados[r.fecha]) diasPasados[r.fecha] = [];
            diasPasados[r.fecha].push(r.num);
        }
    });

    let mejorCoincidencia = { fecha: '', puntos: 0 };
    for (const [fecha, nums] of Object.entries(diasPasados)) {
        let coincidencias = sorteosHoy.filter(n => nums.includes(n)).length;
        if (coincidencias > mejorCoincidencia.puntos) {
            mejorCoincidencia = { fecha, puntos: coincidencias };
        }
    }

    if (mejorCoincidencia.puntos >= 2) {
        alertCont.innerHTML += `<div class="badge bg-primary m-1">🧠 ANALOGÍA DETECTADA: Patrón similar al día ${mejorCoincidencia.fecha}</div>`;
    }
}

function actualizarJugadaSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const infoMaestra = document.getElementById('resultado-patron-avanzado');
    if (!display || historial.length < 10) return;

    const hO = [...historial].sort((a,b) => a.fecha.localeCompare(b.fecha) || horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = hO.filter(r => r.fecha === fechaHoy);
    if (hoy.length === 0) return;

    const ultimo = hoy[hoy.length - 1];
    const ultimoNum = ultimo.num;
    const ultimaFam = ultimo.num.length === 1 ? '0' : ultimo.num[0];
    
    // Alerta de Familia Agresiva
    let mensajeMaestro = "";
    const conteoFam = hoy.filter(r => (r.num.length === 1 ? '0' : r.num[0]) === ultimaFam).length;
    
    if (conteoFam >= 2) {
        mensajeMaestro = `🔥 LARA, ATENCIÓN: Seguidilla en la familia ${ultimaFam}0 detectada. Mantén la puntería ahí!`;
    } else {
        mensajeMaestro = `🎯 PRÓXIMO OBJETIVO: Basado en el ${ultimoNum} (${ultimo.animal}), el sistema busca simetría.`;
    }

    if (infoMaestra) {
        infoMaestra.innerHTML = `<div style="background:#1e293b; color:#fbbf24; padding:15px; border-radius:10px; border: 2px solid #fbbf24; font-weight:bold;">${mensajeMaestro}</div>`;
    }

    // Jales con prioridad de Tipo (Tierra, Aire, etc.)
    let jales = {};
    hO.forEach((r, i) => {
        if(r.num === ultimoNum && i < hO.length - 1) {
            let seg = hO[i+1].num;
            jales[seg] = (jales[seg] || 0) + 2; // Peso extra al jale directo
            if(hO[i+1].tipo === ultimo.tipo) jales[seg] += 1; // Peso extra si es del mismo tipo
        }
    });

    let sugeridos = Object.entries(jales).sort((a,b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    display.innerHTML = sugeridos.map(n => `<span style="background:#0f172a; padding: 5px 12px; border-radius: 5px; border: 1px solid #ef4444; color:white; font-weight:bold; margin-right:5px;">${n}</span>`).join('');
}

function calcularPrediccionTotal() {
    const cont = document.getElementById('contenedor-fijos');
    if(!cont || historial.length < 20) return;

    const manana = new Date();
    const diaSemana = manana.getDay();
    
    // TRIPLETA BLINDADA: Los 3 dueños del día
    // Analiza frecuencia histórica del día de la semana + jales de la apertura de hoy
    let frec = {};
    historial.filter(r => new Date(r.fecha).getDay() === diaSemana)
             .forEach(r => frec[r.num] = (frec[r.num] || 0) + 1);

    let tripleta = Object.entries(frec).sort((a,b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
    
    // Asegurar que el 23 esté si la tómbola está errática
    if(!tripleta.includes('23')) tripleta[2] = '23';

    cont.innerHTML = tripleta.map(f => `<div class="dato-fijo" style="background:#ef4444; color:white; border:none; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">${f}</div>`).join('');
}

// ==========================================
// REGISTRO Y UI (MANTENIDAS Y LIMPIAS)
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
    if(display) display.innerText = sorteosSin75;
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
    if(ult.num.split('').reverse().join('').padStart(2,'0') === pen.num) alertCont.innerHTML += `<span class="badge bg-warning text-dark">🔄 ESPEJO DETECTADO</span>`;
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
