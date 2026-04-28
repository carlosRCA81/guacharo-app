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
    {id: 1, nums: ['09', '0']},
    {id: 2, nums: ['22', '03']},
    {id: 3, nums: ['20', '17']},
    {id: 4, nums: ['12', '08', '0']},
    {id: 5, nums: ['05', '09', '12', '18']},
    {id: 6, nums: ['10', '31', '01']},
    {id: 7, nums: ['25', '07']},
    {id: 8, nums: ['35', '08']},
    {id: 9, nums: ['03', '30', '33', '32', '36', '26']},
    {id: 10, nums: ['00', '29', '26']},
    {id: 11, nums: ['34', '19', '05']}
];

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

// --- 🎯 MONITOR DE SECTORES (MAPA) ---
function renderizarMapa() {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    
    const fecha = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);

    ['A','B','C','D','E','F'].forEach(s => {
        const secDiv = document.createElement('div');
        secDiv.className = 'sector-block';
        secDiv.innerHTML = `<div class="sector-header">SECTOR ${s}</div>`;
        
        const grid = document.createElement('div');
        grid.className = 'sector-grid';
        
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            const yaSalio = sorteosHoy.includes(ani.n);
            const item = document.createElement('div');
            // Si ya salió, le ponemos la clase sensor-fijo (Verde)
            item.className = `mini-animal ${yaSalio ? 'sensor-fijo' : ani.c.toLowerCase()}`;
            item.innerText = ani.n;
            grid.appendChild(item);
        });
        
        secDiv.appendChild(grid);
        mapa.appendChild(secDiv);
    });
}

function motorVigilante() {
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historialGlobal.filter(r => r.fecha === fechaHoy).map(r => r.num);
    const contenedor = document.getElementById('contenedor-vigilancia');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    LISTAS_PRIORITARIAS.forEach(lista => {
        const encontrados = lista.nums.filter(n => sorteosHoy.includes(n));
        const faltantes = lista.nums.filter(n => !sorteosHoy.includes(n));
        if (encontrados.length > 0 && faltantes.length > 0) {
            contenedor.innerHTML += `
                <div style="background: rgba(251, 191, 36, 0.1); border: 1px solid #fbbf24; padding: 12px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="text-align: left;">
                        <span style="color: #fbbf24; font-size: 0.65rem; font-weight: bold;">LISTA #${lista.id} ACTIVA</span><br>
                        <span style="color: white; font-size: 0.85rem;">Salió: <b>${encontrados.join(', ')}</b></span>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #ef4444; font-size: 0.65rem; font-weight: bold;">FALTA:</span><br>
                        <span style="color: #22c55e; font-size: 1.1rem; font-weight: bold;">${faltantes.join(' - ')}</span>
                    </div>
                </div>`;
        }
    });
}

async function inicializar() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    await cargarDatos();
    generarBotones();
    llenarSelectorAlgoritmo();
    document.getElementById('fecha-analisis').onchange = actualizarTodo;
    document.getElementById('fecha-busqueda-historial').onchange = renderizarHistorial;
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').order('fecha', {ascending: false});
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

function actualizarTodo() {
    renderizarPanelHoras();
    renderizarHistorial();
    renderizarMapa();
    motorVigilante();
    ejecutarSniper();
}

function ejecutarSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const fechaHoy = document.getElementById('fecha-analisis').value;
    const sorteosHoy = historialGlobal.filter(r => r.fecha === fechaHoy).map(r => r.num);
    let sugeridos = [];
    LISTAS_PRIORITARIAS.forEach(l => {
        if(l.nums.some(n => sorteosHoy.includes(n))) sugeridos.push(...l.nums.filter(n => !sorteosHoy.includes(n)));
    });
    const finales = [...new Set(sugeridos)].slice(0, 3);
    display.innerHTML = (finales.length > 0 ? finales : ["08", "00", "05"]).map(n => `<span class="sniper-pill">${n}</span>`).join('');
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Selecciona Hora");
    const ani = listaAnimales.find(a => a.n === val);
    if(!ani) return;
    const fecha = document.getElementById('fecha-analisis').value;
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

function generarBotones() {
    const cont = document.getElementById('grid-container');
    if(!cont) return;
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = "animal-btn";
        btn.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        btn.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        cont.appendChild(btn);
    });
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

function renderizarHistorial() {
    const lista = document.getElementById('lista-historial');
    const fecha = document.getElementById('fecha-busqueda-historial').value;
    if(!lista) return;
    lista.innerHTML = '';
    const filtrado = historialGlobal.filter(r => r.fecha === fecha).sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        const esPrioritario = LISTAS_PRIORITARIAS.some(l => l.nums.includes(r.num));
        lista.innerHTML += `<tr style="${esPrioritario ? 'background: rgba(251, 191, 36, 0.1);' : ''}"><td>${r.hora}</td><td><b style="${esPrioritario ? 'color:#fbbf24;' : ''}">${r.num} ${esPrioritario ? '★' : ''}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td><td class="${r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul'}">${r.tipo}</td></tr>`;
    });
}

function llenarSelectorAlgoritmo() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Ver Listas --</option>';
    LISTAS_PRIORITARIAS.forEach(l => s.innerHTML += `<option value="${l.id}">Lista #${l.id}: ${l.nums.join('-')}</option>`);
}

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

// Reloj y Reinicio Automático a las 12:00 AM
setInterval(() => { 
    const ahora = new Date();
    const clock = document.getElementById('live-clock'); 
    if(clock) clock.innerText = ahora.toLocaleTimeString(); 
    
    // Reinicio a medianoche
    if(ahora.getHours() === 0 && ahora.getMinutes() === 0 && ahora.getSeconds() === 0) {
        inicializar(); 
    }
}, 1000);

window.onload = inicializar;
