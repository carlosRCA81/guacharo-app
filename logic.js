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

const LISTAS_PRIORITARIAS = [
    {id: 1, nums: ['09', '0']}, {id: 2, nums: ['22', '03']},
    {id: 9, nums: ['03', '30', '33', '32', '36', '26']},
    {id: 11, nums: ['34', '19', '05']}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

// --- 🧠 MOTOR DE TRIPLETAS FIJAS (ESTABLE) ---
function generarTripletasInteligentes() {
    const cont = document.getElementById('seccion-tripletas');
    const fecha = document.getElementById('fecha-analisis').value;
    const cache = localStorage.getItem('trip_' + fecha);
    if(cache) { cont.innerHTML = cache; return; }

    const t1 = ['00', '17', '30']; 
    const t2 = ['11', '34', '09'];
    const t3 = ['02', '24', '01'];

    const html = `
        <div style="text-align:center; color:#22c55e; font-size:0.7rem; margin-bottom:10px;">PRONÓSTICO FIJO CARGADO</div>
        ${card(t1, "MAESTRA", "ALTA PROBABILIDAD")}
        ${card(t2, "PODER", "ARRANQUE SECTORIAL")}
        ${card(t3, "APOYO", "SISTEMA DE DEUDA")}
    `;
    localStorage.setItem('trip_' + fecha, html);
    cont.innerHTML = html;
}

function card(nums, tit, sub) {
    return `<div class="tripleta-card">
        <span class="badge-tripleta">${tit}</span>
        <div class="nums-tripleta">
            <div class="num-circle">${nums[0]}</div>
            <div class="num-circle">${nums[1]}</div>
            <div class="num-circle">${nums[2]}</div>
        </div>
        <small style="color:#38bdf8">${sub}</small>
    </div>`;
}

// --- 📊 FUNCIÓN DE HISTORIAL REPARADA ---
function renderHistorial() {
    const tabla = document.getElementById('lista-historial');
    const fechaBuscada = document.getElementById('fecha-busqueda-historial').value;
    if(!tabla) return;
    tabla.innerHTML = '';

    // Filtrar y ordenar por la posición en horasSorteo para que salgan en orden de tiempo
    const filtrado = historialGlobal
        .filter(r => r.fecha === fechaBuscada)
        .sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    if(filtrado.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">Sin resultados para esta fecha</td></tr>';
        return;
    }

    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num.toString().padStart(2, '0'));
        const esPrioritario = LISTAS_PRIORITARIAS.some(l => l.nums.includes(r.num));
        
        tabla.innerHTML += `
            <tr style="${esPrioritario ? 'background: rgba(251, 191, 36, 0.1);' : ''}">
                <td>${r.hora}</td>
                <td><b style="${esPrioritario ? 'color:#fbbf24;' : ''}">${r.num}</b></td>
                <td>${r.animal}</td>
                <td>${ani ? ani.s : '-'}</td>
                <td class="${r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul'}">${r.tipo}</td>
            </tr>`;
    });
}

// --- RESTO DE FUNCIONES (RESUMIDAS PARA CIERRE COMPLETO) ---
async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Selecciona una hora en el panel");
    const ani = listaAnimales.find(a => a.n === val.padStart(2, '0'));
    if(!ani) return alert("Número no válido");
    const fecha = document.getElementById('fecha-analisis').value;
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos(); // Recarga todo tras anotar
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false});
    if(!error) { 
        historialGlobal = data; 
        actualizarTodo(); 
    }
}

function actualizarTodo() {
    renderPanelHoras();
    renderHistorial();
    renderMapa();
    motorVigilante();
    generarTripletasInteligentes();
}

function renderPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const f = document.getElementById('fecha-analisis').value;
    if(!p) return;
    p.innerHTML = '';
    horasSorteo.forEach(h => {
        const r = historialGlobal.find(x => x.fecha === f && x.hora === h);
        const d = document.createElement('div');
        d.className = `hora-box ${r ? 'jugado' : ''} ${h === horaActiva ? 'active-select' : ''}`;
        d.innerHTML = r ? `${h}<br><b>${r.num}</b>` : h;
        d.onclick = () => { horaActiva = h; renderPanelHoras(); };
        p.appendChild(d);
    });
}

function renderMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    const fecha = document.getElementById('fecha-analisis').value;
    if(!mapa) return;
    mapa.innerHTML = '';
    const hoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);
    ['A','B','C','D','E','F'].forEach(s => {
        let html = `<div class="sector-block"><div class="sector-header">SECTOR ${s}</div><div class="sector-grid">`;
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            html += `<div class="mini-animal ${hoy.includes(ani.n) ? 'sensor-fijo' : ani.c.toLowerCase()}">${ani.n}</div>`;
        });
        mapa.innerHTML += html + `</div></div>`;
    });
}

function motorVigilante() {
    const hoy = historialGlobal.filter(r => r.fecha === document.getElementById('fecha-analisis').value).map(r => r.num);
    const cont = document.getElementById('contenedor-vigilancia');
    if(!cont) return;
    cont.innerHTML = '';
    LISTAS_PRIORITARIAS.forEach(l => {
        const fallan = l.nums.filter(n => !hoy.includes(n));
        const tienen = l.nums.filter(n => hoy.includes(n));
        if(tienen.length > 0 && fallan.length > 0) {
            cont.innerHTML += `<div style="border:1px solid #fbbf24; padding:8px; border-radius:8px; margin-top:5px; display:flex; justify-content:space-between; background:rgba(251,191,36,0.05);">
                <span style="color:#fff; font-size:0.75rem;">Lista ${l.id} activa</span>
                <span style="color:#22c55e; font-weight:bold;">FALTA: ${fallan.join(' - ')}</span>
            </div>`;
        }
    });
}

function openTab(e, n) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(n).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
}

async function init() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    
    // Eventos para que el historial se actualice al cambiar fechas
    document.getElementById('fecha-analisis').onchange = actualizarTodo;
    document.getElementById('fecha-busqueda-historial').onchange = renderHistorial;

    await cargarDatos();
    const grid = document.getElementById('grid-container');
    listaAnimales.forEach(a => {
        const b = document.createElement('div');
        b.className = "animal-btn";
        b.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        b.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        grid.appendChild(b);
    });
    setInterval(() => { 
        const cl = document.getElementById('live-clock');
        if(cl) cl.innerText = new Date().toLocaleTimeString(); 
    }, 1000);
}

window.onload = init;
