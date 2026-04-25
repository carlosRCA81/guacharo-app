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

const algoritmoLara = {
    '21': ['12', '11', '01'], '01': ['10', '11', '25'], '16': ['33', '23', '06'],
    '36': ['26', '00', '13'], '26': ['36', '28', '14'], '25': ['35', '07', '01']
};

const horasSorteo = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let horaActiva = null;

// --- 🌌 MOTOR DE MATRIZ CUÁNTICA UNIVERSAL ---
function motorProbabilidadMaestra() {
    if (historialGlobal.length === 0) return { sugeridos: ["11", "22", "33"], unico: "11" };

    const fechaHoy = document.getElementById('fecha-analisis').value;
    const hoy = historialGlobal.filter(r => r.fecha === fechaHoy).sort((a,b) => horasSorteo.indexOf(b.hora) - horasSorteo.indexOf(a.hora));
    
    let pesos = {};
    listaAnimales.forEach(a => pesos[a.n] = 0);

    const columnas = [
        ['01','04','07','10','13','16','19','22','25','28','31','34'],
        ['02','05','08','11','14','17','20','23','26','29','32','35'],
        ['03','06','09','12','15','18','21','24','27','30','33','36','0','00']
    ];

    if (hoy.length > 0) {
        const ultimo = hoy[0].num;
        const penultimo = hoy[1] ? hoy[1].num : null;

        // 1. LÓGICA DE PAREJAS HISTÓRICAS (Conexión 03-22, 32-33, etc.)
        const parejas = {'03':'22', '22':'03', '32':'33', '33':'32', '16':'33', '21':'12', '08':'10', '35':'26'};
        if(parejas[ultimo]) pesos[parejas[ultimo]] += 60;

        // 2. LÓGICA DE COLUMNA Y FILA
        columnas.forEach(col => {
            if (col.includes(ultimo)) {
                col.forEach(n => { if(n !== ultimo) pesos[n] += 30; });
            }
        });

        // 3. ANÁLISIS DE SALTOS Y SUMAS (Matemática Pura)
        if (penultimo) {
            const salto = Math.abs(parseInt(ultimo) - parseInt(penultimo));
            const sigSuma = (parseInt(ultimo) + salto) % 37;
            const sigResta = Math.abs(parseInt(ultimo) - salto) % 37;
            [sigSuma, sigResta].forEach(s => {
                let nStr = s.toString().padStart(2,'0');
                if(pesos[nStr] !== undefined) pesos[nStr] += 45;
            });
        }

        // 4. CORRELACIÓN HISTÓRICA (Desde Enero)
        for (let i = 0; i < historialGlobal.length - 1; i++) {
            if (historialGlobal[i+1].num === ultimo) {
                const sig = historialGlobal[i].num;
                if(pesos[sig] !== undefined) pesos[sig] += 20;
            }
        }
    }

    // El número que no ha salido hoy tiene un pequeño bono por "deuda"
    listaAnimales.forEach(a => {
        if (!hoy.some(r => r.num === a.n)) pesos[a.n] += 10;
    });

    const ordenados = Object.keys(pesos).sort((a, b) => pesos[b] - pesos[a]);
    return { sugeridos: ordenados.slice(0, 4), unico: ordenados[0] };
}

// --- FUNCIONES DE INTERFAZ ACTUALIZADAS ---
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
    renderizarAlertaCuantica(); // Nueva función
}

function renderizarAlertaCuantica() {
    const contenedor = document.getElementById('alerta-cuantica-panel');
    if(!contenedor) return;
    const datos = motorProbabilidadMaestra();
    const animal = listaAnimales.find(a => a.n === datos.unico);
    
    contenedor.innerHTML = `
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 2px solid #fbbf24; border-radius: 15px; padding: 20px; text-align: center; box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);">
            <small style="color: #fbbf24; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">⚠️ PRÓXIMA JUGADA: ALERTA CUÁNTICA</small>
            <div style="font-size: 3.5rem; font-weight: 900; color: #fff; margin: 10px 0; text-shadow: 2px 2px #000;">${datos.unico}</div>
            <div style="font-size: 1.2rem; color: #94a3b8; font-weight: bold;">${animal ? animal.a : ''}</div>
            <div style="margin-top: 10px; font-size: 0.7rem; color: #38bdf8;">Basado en Matriz de Columnas + Parejas Históricas</div>
        </div>
    `;
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
    
    const t1 = datos.sugeridos.slice(0,3).join('-');
    const t2 = "33-35-22"; // Tripleta de Deuda Fija
    
    const tripletas = [t1, t2];
    let html = `<h3 style="color:#fbbf24; text-align:center; font-size:0.8rem; margin-bottom:10px;">🎯 TRIPLETAS DE MATRIZ</h3>`;
    tripletas.forEach((t, i) => {
        html += `<div class="card-tripleta" style="border-left:4px solid #38bdf8; margin-bottom:8px; background:#020617; padding:10px; border-radius:8px;">
                    <div style="font-size:1.2rem; font-weight:bold; letter-spacing:2px; color:white;">${t}</div>
                 </div>`;
    });
    if(tripCont) tripCont.innerHTML = html;
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
    document.getElementById('arrastre-union').innerText = unionVal;
    document.getElementById('arrastre-suma').innerText = "CUÁNTICA";
    document.getElementById('arrastre-animal').innerText = "CALCULANDO...";
}

// RESTO DE FUNCIONES (Mapa, Historial, Registro) SE MANTIENEN IGUAL
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
    const datos = motorProbabilidadMaestra();
    res.innerHTML = `<div class="maestro-card"><small>SIGUIENTE:</small><div class="maestro-nums">${datos.sugeridos.map(n => `<span class="pill-maestra">${n}</span>`).join('')}</div></div>`;
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
