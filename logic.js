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

// --- 🧠 MOTOR DE INTELIGENCIA AUTÓNOMA (SISTEMA SOBRE SISTEMA) ---
function motorProbabilidadMaestra() {
    if (historialGlobal.length === 0) return { sugeridos: ["11", "22", "33"], unico: "11", serieAlert: "S/N" };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        
        // 1. ESCANEO PROFUNDO HISTÓRICO (Deep History Scan)
        // El sistema busca CADA VEZ que salió el número actual y ve qué salió después en toda la historia
        historialGlobal.forEach((reg, i) => {
            if (reg.num === ultimo && i > 0) {
                const siguienteEnEseMomento = historialGlobal[i-1].num;
                pesos[siguienteEnEseMomento] += 50; // Gran peso por repetición histórica de patrón
            }
        });

        // 2. DETECCIÓN DE SERIES POR PRESIÓN (Sector Heat)
        let conteoSectores = { 'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'F':0 };
        hoy.forEach(r => {
            const ani = listaAnimales.find(a => a.n === r.num);
            if(ani) conteoSectores[ani.s]++;
        });

        // Identificar sector con "Deuda Crítica" (El que no ha salido o tiene menos carga)
        const sectorDeuda = Object.keys(conteoSectores).reduce((a, b) => conteoSectores[a] < conteoSectores[b] ? a : b);
        listaAnimales.filter(a => a.s === sectorDeuda).forEach(a => pesos[a.n] += 35);

        // 3. ANÁLISIS DE COLUMNAS MATEMÁTICAS
        const columnas = [['01','04','07','10','13','16','19','22','25','28','31','34'],['02','05','08','11','14','17','20','23','26','29','32','35'],['03','06','09','12','15','18','21','24','27','30','33','36','0','00']];
        columnas.forEach(col => {
            if (col.includes(ultimo)) {
                col.forEach(n => { if(n !== ultimo) pesos[n] += 25; });
            }
        });
    }

    const ordenados = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    
    // Detectar Serie Alerta (Ej: Si los últimos 3 fueron del mismo color o sector)
    let serieMsg = "ESTABLE";
    if (hoy.length >= 2) {
        const s1 = listaAnimales.find(a => a.n === hoy[0].num).s;
        const s2 = listaAnimales.find(a => a.n === hoy[1].num).s;
        if(s1 === s2) serieMsg = `PRESIÓN EN SECTOR ${s1}`;
    }

    return { sugeridos: ordenados.slice(0, 4), unico: ordenados[0], serieAlert: serieMsg };
}

// --- PANEL DE ALERTA CUÁNTICA MEJORADO ---
function renderizarAlertaCuantica() {
    const contenedor = document.getElementById('alerta-cuantica-panel');
    if(!contenedor) return;
    const datos = motorProbabilidadMaestra();
    const animal = listaAnimales.find(a => a.n === datos.unico);
    
    contenedor.innerHTML = `
        <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border: 2px solid #38bdf8; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 0 25px rgba(56, 189, 248, 0.2);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <small style="color: #38bdf8; font-weight: bold; font-size: 0.6rem;">IA AUTÓNOMA ACTIVA</small>
                <small style="color: #f59e0b; font-weight: bold; font-size: 0.6rem;">${datos.serieAlert}</small>
            </div>
            <h2 style="color: #fff; font-size: 0.8rem; margin: 0; opacity: 0.7;">TIRO DE PRECISIÓN</h2>
            <div style="font-size: 4.5rem; font-weight: 900; color: #fff; text-shadow: 0 0 15px #38bdf8; margin: 5px 0;">${datos.unico}</div>
            <div style="color: #38bdf8; font-size: 1.2rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">${animal ? animal.a : ''}</div>
            <div style="margin-top: 15px; padding: 5px; background: rgba(56,189,248,0.1); border-radius: 5px; font-size: 0.6rem; color: #94a3b8;">
                Sincronizado con historial global: ${historialGlobal.length} registros analizados
            </div>
        </div>
    `;
}

// --- ARRASTRE DE CARLOS INTELIGENTE ---
function calcularArrastreCarlos() {
    const fecha = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fecha).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    if (hoy.length < 1) return;
    
    const actual = hoy[0].num;
    const terminal = actual.slice(-1);
    const datos = motorProbabilidadMaestra();
    const animalPrediccion = listaAnimales.find(a => a.n === datos.sugeridos[0]);

    document.getElementById('arrastre-union').innerText = "T-" + terminal;
    document.getElementById('arrastre-suma').innerText = "INERCIA " + actual;
    document.getElementById('arrastre-animal').innerText = animalPrediccion ? animalPrediccion.n + " - " + animalPrediccion.a : "ESPERANDO";
}

// --- ACTUALIZACIÓN Y CARGA ---
async function inicializar() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    await cargarDatos();
    generarBotones();
    llenarSelectorAlgoritmo();
    document.getElementById('fecha-analisis').onchange = actualizarTodo;
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
    renderizarAlertaCuantica();
}

function ejecutarRadarCritico() {
    const datos = motorProbabilidadMaestra();
    document.getElementById('radar-fijo-1').innerText = datos.sugeridos[0];
    document.getElementById('radar-fijo-2').innerText = datos.sugeridos[1];
}

function ejecutarSniper() {
    const display = document.getElementById('numeros-sugeridos-directos');
    const tripCont = document.getElementById('seccion-tripletas');
    const datos = motorProbabilidadMaestra();
    
    display.innerHTML = datos.sugeridos.slice(0,2).map(n => `<span class="sniper-pill">${n}</span>`).join('');
    
    const tripletas = [`${datos.sugeridos[0]}-${datos.sugeridos[1]}-${datos.sugeridos[2]}`, `${datos.sugeridos[1]}-${datos.sugeridos[3]}-${datos.sugeridos[0]}`];
    let html = `<h3 style="color:#fbbf24; text-align:center; font-size:0.8rem; margin-bottom:10px;">🎯 TRIPLETAS IA</h3>`;
    tripletas.forEach(t => {
        html += `<div class="card-tripleta" style="border-left:4px solid #38bdf8; margin-bottom:8px; background:#020617; padding:10px; border-radius:8px; color:white; font-weight:bold;">${t}</div>`;
    });
    if(tripCont) tripCont.innerHTML = html;
}

// --- FUNCIONES DE RENDERIZADO (SE MANTIENEN TODAS) ---
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
            item.className = `mini-animal ${isOut ? 'sensor-fijo' : ani.c === 'ROJO' ? 'rojo' : 'negro'}`;
            item.innerText = ani.n;
            grid.appendChild(item);
        });
        secDiv.appendChild(grid);
        mapa.appendChild(secDiv);
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
    const fecha = document.getElementById('fecha-busqueda-historial').value || document.getElementById('fecha-analisis').value;
    if(!lista) return;
    lista.innerHTML = '';
    const filtrado = historialGlobal.filter(r => r.fecha === fecha).sort((a, b) => horasSorteo.indexOf(a.hora) - horasSorteo.indexOf(b.hora));
    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        lista.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td><td class="${r.tipo === 'ROJO' ? 'txt-rojo' : 'txt-azul'}">${r.tipo}</td></tr>`;
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

function llenarSelectorAlgoritmo() {
    const s = document.getElementById('select-estudio-animal');
    if(!s) return;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    listaAnimales.forEach(a => s.innerHTML += `<option value="${a.n}">${a.n} - ${a.a}</option>`);
}

function estudiarAlgoritmo() {
    const val = document.getElementById('select-estudio-animal').value;
    const res = document.getElementById('resultado-maestro');
    if (!val) return res.innerHTML = '';
    const datos = motorProbabilidadMaestra();
    res.innerHTML = `<div class="maestro-card"><small>PREDICCIÓN IA:</small><div class="maestro-nums">${datos.sugeridos.map(n => `<span class="pill-maestra">${n}</span>`).join('')}</div></div>`;
}

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

setInterval(() => { const clock = document.getElementById('live-clock'); if(clock) clock.innerText = new Date().toLocaleTimeString(); }, 1000);
window.onload = inicializar;
