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

// Algoritmo refinado con datos históricos para cruces y espejos
const algoritmoLara = {
    '07': ['25', '32', '11'], '04': ['13', '14', '10'], '00': ['26', '29', '09'], 
    '10': ['08', '13', '36'], '12': ['05', '18', '19'], '05': ['12', '11', '34'], 
    '09': ['00', '14', '0'], '36': ['13', '26', '00'], '32': ['07', '11', '30'], 
    '0': ['09', '14', '28'], '08': ['10', '29', '12'], '25': ['07', '14', '01'],
    '11': ['07', '32', '20'], '20': ['17', '11', '32'], '14': ['09', '25', '04'], 
    '26': ['00', '36', '28'], '17': ['20', '11', '32'], '34': ['05', '15', '22']
};

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

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
    ejecutarSniper();
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
            const item = document.createElement('div');
            item.className = `mini-animal ${isOut ? 'sensor-fijo' : ani.c === 'ROJO' ? 'rojo' : ani.c === 'AZUL' ? 'azul' : 'negro'}`;
            item.innerText = ani.n;
            grid.appendChild(item);
        });
        secDiv.appendChild(grid);
        mapa.appendChild(secDiv);
    });
}

// Lógica Maestra de Tripletas para mañana (7:00 PM)
function calcularProyeccionManana(hoy) {
    if (hoy.length === 0) return ["01-10-25", "07-14-32", "00-26-36"];

    const ultimo = hoy[0].num;
    const primero = hoy[hoy.length - 1].num;
    
    // Cruce de sectores: Buscar el sector que menos salió hoy
    const conteoSectores = {A:0, B:0, C:0, D:0, E:0, F:0};
    hoy.forEach(r => {
        const s = listaAnimales.find(a => a.n === r.num).s;
        conteoSectores[s]++;
    });
    const sectorFrio = Object.keys(conteoSectores).reduce((a, b) => conteoSectores[a] < conteoSectores[b] ? a : b);

    // Tripleta 1: Basada en el cierre (Espejo del último)
    const t1 = algoritmoLara[ultimo] ? algoritmoLara[ultimo].join('-') : "04-13-14";
    // Tripleta 2: Basada en la apertura (Resorte del primero)
    const t2 = algoritmoLara[primero] ? algoritmoLara[primero].join('-') : "10-08-29";
    // Tripleta 3: Basada en el Sector Frío (La caída obligatoria)
    const t3 = listaAnimales.filter(a => a.s === sectorFrio).slice(0,3).map(a => a.n).join('-');

    return [t1, t2, t3];
}

function ejecutarSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const tripCont = document.getElementById('seccion-tripletas');
    const fecha = document.getElementById('fecha-analisis').value;
    
    const hoy = historialGlobal
        .filter(r => r.fecha === fecha)
        .sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));

    if(hoy.length === 0) {
        display.innerText = "ESPERANDO...";
        tripCont.innerHTML = "<p style='text-align:center; font-size:0.7rem;'>ANOTA EL PRIMER SORTEO</p>";
        return;
    }

    const ultimo = hoy[0].num;
    const esCierre = hoy[0].hora === '7:00 PM';

    // 1-2 números de máxima precisión
    let sugeridos = algoritmoLara[ultimo] || ["01", "25", "36"];
    display.innerHTML = sugeridos.slice(0,2).map(n => `<span class="sniper-pill">${n}</span>`).join('');

    // Mostrar Tripletas (Si es las 7pm, muestra PROYECCIÓN MAÑANA)
    const tripletas = calcularProyeccionManana(hoy);
    let html = `<h3 style="color:#fbbf24; text-align:center; font-size:0.8rem; margin-bottom:10px;">${esCierre ? '🚀 PROYECCIÓN PARA MAÑANA' : '🎯 TRIPLETAS DEL DÍA'}</h3>`;
    
    tripletas.forEach((t, i) => {
        html += `<div class="card-tripleta" style="border-left:4px solid ${i==0?'#38bdf8':i==1?'#fbbf24':'#22c55e'}; margin-bottom:8px; background:#020617; padding:10px; border-radius:8px;">
                    <small style="color:#94a3b8; font-size:0.6rem;">${esCierre ? 'GOLPE MAESTRO' : 'OPCIÓN'} ${i+1}</small>
                    <div style="font-size:1.2rem; font-weight:bold; letter-spacing:2px; color:white;">${t}</div>
                 </div>`;
    });
    tripCont.innerHTML = html;
}

function estudiarAlgoritmo() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-maestro');
    if (!val) return res.innerHTML = '';
    const sugeridos = algoritmoLara[val] || ["S/D"];
    res.innerHTML = `<div class="maestro-card"><small>SIGUIENTE GOLPE:</small><div class="maestro-nums">${sugeridos.map(n => `<span class="pill-maestra">${n}</span>`).join('')}</div></div>`;
}

function llenarSelectorAlgoritmo() {
    const s = document.getElementById('select-estudio-animal');
    s.innerHTML = '<option value="">-- ¿Qué número salió? --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

function renderizarPanelHoras() {
    const p = document.getElementById('panel-diario-sorteos');
    const fecha = document.getElementById('fecha-analisis').value;
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
    lista.innerHTML = '';
    const filtrado = historialGlobal
        .filter(r => r.fecha === fecha)
        .sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));

    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        const claseColor = r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul';
        lista.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td><td class="${claseColor}">${r.tipo}</td></tr>`;
    });
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Selecciona Hora");
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    if(!ani) return;
    const fecha = document.getElementById('fecha-analisis').value;
    await _supabase.from('historial_sorteos').upsert({ fecha, hora: horaActiva, num: val, animal: ani.a, tipo: ani.c }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

function generarBotones() {
    const cont = document.getElementById('grid-container');
    cont.innerHTML = '';
    listaAnimales.forEach(a => {
        const btn = document.createElement('div');
        btn.className = "animal-btn";
        btn.innerHTML = `<b>${a.n}</b><br><small>${a.a}</small>`;
        btn.onclick = () => { document.getElementById('num-rapido').value = a.n; registrarPorNumero(); };
        cont.appendChild(btn);
    });
}

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializar;
