const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const listaAnimales = [
    {n:'0', a:'DELFIN', s:'A'}, {n:'00', a:'BALLENA', s:'D'}, {n:'01', a:'CARNERO', s:'D'}, {n:'02', a:'TORO', s:'A'},
    {n:'03', a:'CIEMPIES', s:'C'}, {n:'04', a:'ALACRAN', s:'F'}, {n:'05', a:'LEON', s:'C'}, {n:'06', a:'RANA', s:'F'},
    {n:'07', a:'PERICO', s:'B'}, {n:'08', a:'RATON', s:'E'}, {n:'09', a:'AGUILA', s:'A'}, {n:'10', a:'TIGRE', s:'D'},
    {n:'11', a:'GATO', s:'B'}, {n:'12', a:'CABALLO', s:'E'}, {n:'13', a:'MONO', s:'D'}, {n:'14', a:'PALOMA', s:'A'},
    {n:'15', a:'ZORRO', s:'C'}, {n:'16', a:'OSO', s:'F'}, {n:'17', a:'PAVO', s:'B'}, {n:'18', a:'BURRO', s:'E'},
    {n:'19', a:'CHIVO', s:'E'}, {n:'20', a:'COCHINO', s:'B'}, {n:'21', a:'GALLO', s:'F'}, {n:'22', a:'CAMELLO', s:'C'},
    {n:'23', a:'CEBRA', s:'F'}, {n:'24', a:'IGUANA', s:'C'}, {n:'25', a:'GALLINA', s:'D'}, {n:'26', a:'VACA', s:'A'},
    {n:'27', a:'PERRO', s:'D'}, {n:'28', a:'ZAMURO', s:'A'}, {n:'29', a:'ELEFANTE', s:'E'}, {n:'30', a:'CAIMAN', s:'B'},
    {n:'31', a:'LAPA', s:'E'}, {n:'32', a:'ARDILLA', s:'B'}, {n:'33', a:'PESCADO', s:'F'}, {n:'34', a:'VENADO', s:'C'},
    {n:'35', a:'JIRAFA', s:'A'}, {n:'36', a:'CULEBRA', s:'D'}
];

const gruposVigilancia = [
    { id: 1, nums: ["00", "26", "29"], col: "#64748b" },
    { id: 2, nums: ["03", "36", "26", "33", "32", "30"], col: "#ef4444" },
    { id: 3, nums: ["25", "07"], col: "#38bdf8" },
    { id: 3, nums: ["20", "17"], col: "#38bdf8" }, // Mismo ID para no ligar pero mantener tipo
    { id: 4, nums: ["05", "12", "18", "09"], col: "#fbbf24" },
    { id: 5, nums: ["12", "07", "0"], col: "#f97316" },
    { id: 5, nums: ["09", "0"], col: "#f97316" },
    { id: 6, nums: ["31", "10", "01"], col: "#a855f7" },
    { id: 7, nums: ["22", "03"], col: "#ec4899" },
    { id: 8, nums: ["18", "28", "11", "22"], col: "#22c55e" }
];

let historialGlobal = [];
let celdaActiva = { fecha: '', hora: '' };

async function cargarDatos() {
    const fecha = document.getElementById('fecha-analisis').value;
    const { data, error } = await _supabase.from('historial_sorteos').select('*').gte('fecha', '2026-01-01');
    if(!error) { 
        historialGlobal = data; 
        actualizarTodo(); 
    }
}

function actualizarTodo() {
    renderizarSectores();
    renderizarSupervision();
    renderizarTabla();
}

function renderizarSectores() {
    const cont = document.getElementById('sector-display');
    const fecha = document.getElementById('fecha-analisis').value;
    const jugados = historialGlobal.filter(r => r.fecha === fecha);
    const sectores = ['A', 'B', 'C', 'D', 'E', 'F'];
    cont.innerHTML = '';

    sectores.forEach(s => {
        const numsSector = jugados.filter(r => {
            const ani = listaAnimales.find(a => a.n === r.num);
            return ani && ani.s === s;
        });
        let html = `<div class="sector-box"><h4>SECTOR ${s}</h4><div class="sector-nums">`;
        numsSector.forEach(n => html += `<span class="n-mini">${n.num}</span>`);
        html += `</div></div>`;
        cont.innerHTML += html;
    });
}

function renderizarSupervision() {
    const cont = document.getElementById('contenedor-supervision');
    const fecha = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);
    cont.innerHTML = '';

    gruposVigilancia.forEach(g => {
        const encontrados = g.nums.filter(n => jugadosHoy.includes(n));
        const faltantes = g.nums.filter(n => !jugadosHoy.includes(n));
        
        if(encontrados.length > 0) {
            let html = `<div class="card-grupo" style="border-left: 3px solid ${g.col}">
                <b>Grupo #${g.id}</b>
                <div class="bolitas-flex">`;
            g.nums.forEach(n => html += `<div class="bolita ${jugadosHoy.includes(n) ? 'out' : ''}">${n}</div>`);
            html += `</div>`;
            if(faltantes.length > 0 && faltantes.length <= 2) {
                html += `<div class="alerta-faltante">FALTA: ${faltantes.join(', ')}</div>`;
            }
            html += `</div>`;
            cont.innerHTML += html;
        }
    });
}

function renderizarTabla() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const cabecera = document.getElementById('cabecera-dias');
    const fechaRef = document.getElementById('fecha-analisis').value;
    
    // Configura 1 día para vista rápida en móvil
    cabecera.innerHTML = `<th>HORA</th><th>${fechaRef.split('-')[2]}</th>`;
    cuerpo.innerHTML = '';

    ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].forEach(h => {
        const reg = historialGlobal.find(r => r.fecha === fechaRef && r.hora === h);
        const isSel = (celdaActiva.hora === h) ? 'celda-sel' : '';
        cuerpo.innerHTML += `<tr>
            <td class="hora-label">${h}</td>
            <td class="celda-num ${isSel}" onclick="seleccionarCelda('${fechaRef}','${h}')">
                ${reg ? `<span class="n-destacado" style="color:#39ff14">${reg.num}</span>` : ''}
            </td>
        </tr>`;
    });
}

function seleccionarCelda(f, h) {
    celdaActiva = { fecha: f, hora: h };
    document.getElementById('hora-seleccionada').innerText = `${h}`;
    renderizarTabla();
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!celdaActiva.hora || val === "") return;
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    
    const ani = listaAnimales.find(a => a.n === val);
    const { error } = await _supabase.from('historial_sorteos').upsert({ 
        fecha: celdaActiva.fecha, 
        hora: celdaActiva.hora, 
        num: val, 
        animal: ani ? ani.a : 'S/N', 
        tipo: ani ? (ani.s === 'A' || ani.s === 'C' ? 'ROJO' : 'NEGRO') : 'NEGRO'
    }, { onConflict: 'fecha,hora' });

    if(!error) {
        input.value = '';
        cargarDatos();
    }
}

window.onload = () => {
    document.getElementById('fecha-analisis').value = new Date().toISOString().split('T')[0];
    cargarDatos();
    setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};
