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

// 🧠 ALGORITMO LARA ACTUALIZADO (Mañana Sábado)
const algoritmoLara = {
    '21': ['12', '11', '01'], '01': ['10', '11', '25'], '16': ['33', '23', '06'],
    '36': ['26', '00', '13'], '26': ['36', '28', '14'], '25': ['35', '07', '01'],
    '03': ['33', '24', '15'], '34': ['15', '22', '05'], '17': ['20', '32', '11'],
    '06': ['16', '33', '21'], '07': ['25', '32', '11'], '12': ['21', '05', '19']
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
    calcularArrastreCarlos();
    ejecutarRadarCritico();
}

function calcularArrastreCarlos() {
    const fecha = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fecha).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    if (hoy.length < 1) return;
    const actual = hoy[0].num;
    const anterior = hoy[1] ? hoy[1].num : actual;
    const d1 = anterior.slice(-1);
    const d2 = actual.slice(-1);
    const unionVal = d1 + d2;
    const sumaVal = (parseInt(d1) + parseInt(d2)).toString().padStart(2, '0');
    const aniUnion = listaAnimales.find(a => a.n === unionVal);
    const aniSuma = listaAnimales.find(a => a.n === sumaVal);
    document.getElementById('arrastre-union').innerText = unionVal;
    document.getElementById('arrastre-suma').innerText = sumaVal;
    if(aniUnion) document.getElementById('arrastre-animal').innerText = aniUnion.a;
    else if (aniSuma) document.getElementById('arrastre-animal').innerText = aniSuma.a;
    else document.getElementById('arrastre-animal').innerText = "CALCULANDO...";
}

// 📡 MOTOR DE REBOTE: RADAR CRÍTICO SÁBADO (Detección de Volteados)
function ejecutarRadarCritico() {
    const fecha = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fecha).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    if (hoy.length < 1) {
        // Sugerencia de apertura basada en cierre de hoy (21)
        document.getElementById('radar-fijo-1').innerText = "11"; 
        document.getElementById('radar-fijo-2').innerText = "12";
        return;
    }

    const ultimo = hoy[0].num;
    
    // FIJO 1: REGLA DE ESPEJO (Si salió 21, busca el 12)
    let invertido = ultimo.split('').reverse().join('');
    if (ultimo.length === 1) invertido = ultimo + "0";
    const sug1 = listaAnimales.find(a => a.n === invertido || a.n === parseInt(invertido).toString());
    document.getElementById('radar-fijo-1').innerText = sug1 ? sug1.n : "33";

    // FIJO 2: DEUDA DE SECTOR FRÍO
    const conteoSectores = {A:0, B:0, C:0, D:0, E:0, F:0};
    hoy.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        if(ani) conteoSectores[ani.s]++;
    });
    const sectorFrio = Object.keys(conteoSectores).reduce((a, b) => conteoSectores[a] < conteoSectores[b] ? a : b);
    const sug2 = listaAnimales.find(a => a.s === sectorFrio && !hoy.some(r => r.num === a.n));
    document.getElementById('radar-fijo-2').innerText = sug2 ? sug2.n : "35";
}

// 🎯 SNIPER SÁBADO: FILTRO DE PRECISIÓN QUIRÚRGICA
function ejecutarSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const tripCont = document.getElementById('seccion-tripletas');
    const fecha = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fecha).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    if(hoy.length === 0) {
        display.innerHTML = `<span class="sniper-pill">11</span><span class="sniper-pill">12</span>`;
        return;
    }
    
    const ultimo = hoy[0].num;
    let sugeridos = algoritmoLara[ultimo] || ["33", "35", "10"];

    // Si el día está muy repetitivo, forzamos números de deuda
    if (hoy.length > 5 && new Set(hoy.map(x=>x.num)).size < 4) {
        sugeridos = ["08", "29", "19"];
    }

    display.innerHTML = sugeridos.slice(0,2).map(n => `<span class="sniper-pill">${n}</span>`).join('');
    
    // TRIPLETA FINA: BASADA EN ARRASTRE SEMANAL
    const t1 = sugeridos.join('-');
    const t2 = "33-35-12"; // La tripleta de oro (deuda acumulada)
    const t3 = "11-01-21"; // La racha del terminal 1
    
    const tripletas = [t1, t2, t3];
    let html = `<h3 style="color:#fbbf24; text-align:center; font-size:0.8rem; margin-bottom:10px;">🎯 TRIPLETA FINA SÁBADO</h3>`;
    tripletas.forEach((t, i) => {
        html += `<div class="card-tripleta" style="border-left:4px solid ${i==0?'#38bdf8':i==1?'#fbbf24':'#22c55e'}; margin-bottom:8px; background:#020617; padding:10px; border-radius:8px;">
                    <small style="color:#94a3b8; font-size:0.6rem;">OPCIÓN ${i+1}</small>
                    <div style="font-size:1.2rem; font-weight:bold; letter-spacing:2px; color:white;">${t}</div>
                 </div>`;
    });
    if(tripCont) tripCont.innerHTML = html;
}

// RESTO DE FUNCIONES MANTENIDAS PARA NO DAÑAR EL DISEÑO
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

function estudiarAlgoritmo() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-maestro');
    if (!val) return res.innerHTML = '';
    const sugeridos = algoritmoLara[val] || ["S/D"];
    res.innerHTML = `<div class="maestro-card"><small>SIGUIENTE:</small><div class="maestro-nums">${sugeridos.map(n => `<span class="pill-maestra">${n}</span>`).join('')}</div></div>`;
}

function llenarSelectorAlgoritmo() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
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
        const claseColor = r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul';
        lista.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td><td class="${claseColor}">${r.tipo}</td></tr>`;
    });
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!horaActiva || val === "") return alert("Seleccionar Hora");
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

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

setInterval(() => { const clock = document.getElementById('live-clock'); if(clock) clock.innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializar;
