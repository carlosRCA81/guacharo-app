// --- CONFIGURACIÓN DE NÚCLEO ---
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', c:'AZUL', s:'A'}, {n:'00', a:'BALLENA', c:'AZUL', s:'D'},
    {n:'01', a:'CARNERO', c:'ROJO', s:'D'}, {n:'02', a:'TORO', c:'NEGRO', s:'A'},
    {n:'03', a:'CIEMPIES', c:'ROJO', s:'C'}, {n:'04', a:'ALACRAN', c:'ROJO', s:'F'},
    {n:'05', a:'LEON', c:'ROJO', s:'C'}, {n:'06', a:'RANA', c:'NEGRO', s:'F'},
    {n:'07', a:'PERICO', c:'ROJO', s:'B'}, {n:'08', a:'RATON', c:'NEGRO', s:'E'},
    {n:'09', a:'AGUILA', c:'ROJO', s:'A'}, {n:'10', a:'TIGRE', c:'NEGRO', s:'D'},
    {n:'11', a:'GATO', c:'NEGRO', s:'B'}, {n:'12', a:'CABALLO', c:'ROJO', s:'E'},
    {n:'13', a:'MONO', c:'NEGRO', s:'D'}, {n:'14', a:'PALOMA', c:'ROJO', s:'A'},
    {n:'15', a:'ZORRO', c:'NEGRO', s:'C'}, {n:'16', a:'OSO', c:'ROJO', s:'F'},
    {n:'17', a:'PAVO', c:'NEGRO', s:'B'}, {n:'18', a:'BURRO', c:'ROJO', s:'E'},
    {n:'19', a:'CHIVO', c:'ROJO', s:'E'}, {n:'20', a:'COCHINO', c:'NEGRO', s:'B'},
    {n:'21', a:'GALLO', c:'ROJO', s:'F'}, {n:'22', a:'CAMELLO', c:'NEGRO', s:'C'},
    {n:'23', a:'CEBRA', c:'ROJO', s:'F'}, {n:'24', a:'IGUANA', c:'NEGRO', s:'C'},
    {n:'25', a:'GALLINA', c:'ROJO', s:'D'}, {n:'26', a:'VACA', c:'NEGRO', s:'A'},
    {n:'27', a:'PERRO', c:'ROJO', s:'D'}, {n:'28', a:'ZAMURO', c:'NEGRO', s:'A'},
    {n:'29', a:'ELEFANTE', c:'NEGRO', s:'E'}, {n:'30', a:'CAIMAN', c:'ROJO', s:'B'},
    {n:'31', a:'LAPA', c:'NEGRO', s:'E'}, {n:'32', a:'ARDILLA', c:'ROJO', s:'B'},
    {n:'33', a:'PESCADO', c:'NEGRO', s:'F'}, {n:'34', a:'VENADO', c:'ROJO', s:'C'},
    {n:'35', a:'JIRAFA', c:'NEGRO', s:'A'}, {n:'36', a:'CULEBRA', c:'ROJO', s:'D'}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

// --- 🧠 MOTOR DE INTELIGENCIA (ESTUDIO AUTOMÁTICO 2026) ---
function motorInteligenciaAvanzada() {
    if (historialGlobal.length < 2) return { sugeridos: ["24", "25", "32"], tripletas: ["24-25-32"] };
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);
    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        for(let i=1; i < historialGlobal.length; i++) {
            if (historialGlobal[i].num === ultimo) { pesos[historialGlobal[i-1].num] += 100; }
        }
    }
    const ordenados = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    return { sugeridos: ordenados.slice(0, 4), tripletas: [`${ordenados[0]}-${ordenados[1]}-${ordenados[2]}`, `${ordenados[1]}-${ordenados[2]}-${ordenados[3]}`, `${ordenados[0]}-${ordenados[2]}-${ordenados[3]}`] };
}

// --- 🛠️ REPARACIÓN DE ALGORITMO (CALCULADORA) ---
function repararSelectorAlgoritmo() {
    const sel = document.getElementById('select-estudio-animal');
    if(!sel) return;
    sel.innerHTML = '<option value="">-- SELECCIONAR NÚMERO --</option>';
    listaAnimales.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.n;
        opt.innerText = `${a.n} - ${a.a}`;
        sel.appendChild(opt);
    });
}

// --- 🛠️ REPARACIÓN DE VÍNCULO (ARRASTRE) ---
function calcularArrastreCarlos() {
    const fecha = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fecha).sort((a,b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    if (hoy.length < 2) return;
    const actual = hoy[hoy.length - 1].num;
    const anterior = hoy[hoy.length - 2].num;
    const u = anterior.slice(-1) + actual.slice(-1);
    const s = (parseInt(anterior.slice(-1)) + parseInt(actual.slice(-1))).toString().padStart(2, '0');
    document.getElementById('arrastre-union').innerText = u;
    document.getElementById('arrastre-suma').innerText = s;
    document.getElementById('arrastre-vínculo').innerText = "VINCULADO ✅";
}

// --- 🛠️ REPARACIÓN DE HISTORIAL (SECTOR Y COLOR) ---
function renderizarHistorial() {
    const lista = document.getElementById('lista-historial');
    const fecha = document.getElementById('fecha-busqueda-historial').value;
    if(!lista) return;
    lista.innerHTML = '';
    const filtrado = historialGlobal.filter(r => r.fecha === fecha).sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        lista.innerHTML += `<tr>
            <td>${r.hora}</td>
            <td style="color:#fbbf24; font-weight:bold;">${r.num}</td>
            <td>${r.animal}</td>
            <td style="background:#1e293b;">${ani ? ani.s : '-'}</td>
            <td style="color:${r.tipo === 'ROJO' ? '#ef4444' : '#94a3b8'}">${r.tipo}</td>
        </tr>`;
    });
}

// --- FUNCIONES GENERALES ACTUALIZADAS ---
function actualizarTodo() {
    renderizarPanelHoras();
    renderizarHistorial();
    renderizarMapa();
    ejecutarSniper();
    calcularArrastreCarlos();
}

function ejecutarSniper() {
    const inteligencia = motorInteligenciaAvanzada();
    document.getElementById('numeros-sugeridos-directos').innerHTML = inteligencia.sugeridos.slice(0,2).map(n => `<span class="sniper-pill">${n}</span>`).join('');
    document.getElementById('radar-fijo-1').innerText = inteligencia.sugeridos[0];
    document.getElementById('radar-fijo-2').innerText = inteligencia.sugeridos[1];
    const tripCont = document.getElementById('seccion-tripletas');
    if(tripCont) {
        tripCont.innerHTML = `<h3 style="color:#fbbf24; text-align:center; font-size:0.8rem;">🎯 TRIPLETAS GANADORAS</h3>`;
        inteligencia.tripletas.forEach(t => {
            tripCont.innerHTML += `<div class="card-tripleta" style="border-left:4px solid #38bdf8; background:#020617; padding:8px; border-radius:8px; color:white; font-weight:bold; margin-bottom:5px; text-align:center; font-size:1.1rem;">${t}</div>`;
        });
    }
}

function renderizarMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    const fecha = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);
    ['A','B','C','D','E','F'].forEach(s => {
        const secDiv = document.createElement('div');
        secDiv.className = 'sector-block';
        secDiv.innerHTML = `<div class="sector-header">SECTOR ${s}</div>`;
        const grid = document.createElement('div');
        grid.className = 'sector-grid';
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            const isOut = jugadosHoy.includes(ani.n);
            grid.innerHTML += `<div class="mini-animal ${isOut ? 'sensor-fijo' : (ani.c === 'ROJO' ? 'rojo' : 'negro')}">${ani.n}</div>`;
        });
        secDiv.appendChild(grid);
        mapa.appendChild(secDiv);
    });
}

function openTab(evt, name) {
    const contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) contents[i].style.display = 'none';
    const btns = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').gte('fecha', '2026-01-01').order('fecha', {ascending: false});
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return;
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    const fecha = document.getElementById('fecha-analisis').value;
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

function renderizarPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const fecha = document.getElementById('fecha-analisis').value;
    if(!p) return;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const reg = historialGlobal.find(x => x.fecha === fecha && x.hora === h);
        const div = document.createElement('div');
        div.className = `hora-box ${reg ? 'jugado' : ''} ${h === horaActiva ? 'active-select' : ''}`;
        div.innerHTML = reg ? `${h}<br><b>${reg.num}</b>` : h;
        div.onclick = () => { horaActiva = h; renderizarPanelHoras(); };
        p.appendChild(div);
    });
}

async function inicializar() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    repararSelectorAlgoritmo();
    await cargarDatos();
    document.getElementById('Registro').style.display = 'block';
}

setInterval(() => { if(document.getElementById('live-clock')) document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializar;
