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

const horas = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
let historialGlobal = [];
let celdaActiva = { fecha: '', hora: '' };

const gruposVigilancia = [
    { nombre: "TRÍO ACERO", nums: ["12", "08", "0"], col: "#fbbf24" },
    { nombre: "PAREJA 25-07", nums: ["25", "07"], col: "#38bdf8" },
    { nombre: "BLOQUE 30s", nums: ["03", "30", "36", "26", "33", "32"], col: "#ef4444" },
    { nombre: "ESCALERA", nums: ["22", "03"], col: "#a855f7" },
    { nombre: "TARDE", nums: ["17", "20"], col: "#22c55e" },
    { nombre: "VENADO TRÍO", nums: ["34", "13", "07"], col: "#f97316" },
    { nombre: "CIERRE", nums: ["00", "29", "26"], col: "#64748b" },
    { nombre: "TERMINAL 0", nums: ["09", "0"], col: "#ec4899" }
];

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*').gte('fecha', '2026-01-01').order('fecha', {ascending: true});
    if(!error) { historialGlobal = data; actualizarTodo(); }
}

function actualizarTodo() {
    renderizarTablaSemanal();
    renderizarSupervision();
    renderizarHistorial();
}

function getDiasSemana(fechaRef) {
    let d = new Date(fechaRef + 'T00:00:00');
    let diaSem = d.getDay();
    let diff = d.getDate() - diaSem + (diaSem == 0 ? -6 : 1); 
    let lunes = new Date(d.setDate(diff));
    let semana = [];
    for(let i=0; i<7; i++) {
        let temp = new Date(lunes);
        temp.setDate(lunes.getDate() + i);
        semana.push(temp.toISOString().split('T')[0]);
    }
    return semana;
}

function renderizarTablaSemanal() {
    const fechaAnalisis = document.getElementById('fecha-analisis').value;
    const semana = getDiasSemana(fechaAnalisis);
    const cabecera = document.getElementById('cabecera-dias');
    const cuerpo = document.getElementById('cuerpo-tabla');
    
    cabecera.innerHTML = '<th>HORA</th>' + semana.map(f => `<th>${f.split('-')[2]}</th>`).join('');
    cuerpo.innerHTML = '';

    horas.forEach(h => {
        let row = `<tr><td class="hora-label">${h}</td>`;
        semana.forEach(f => {
            const reg = historialGlobal.find(r => r.fecha === f && r.hora === h);
            const isSel = (celdaActiva.fecha === f && celdaActiva.hora === h) ? 'celda-sel' : '';
            row += `<td class="celda-num ${isSel}" onclick="seleccionarCelda('${f}','${h}')">
                ${reg ? `<span class="n-destacado" style="color:${reg.tipo === 'ROJO' ? '#ef4444' : '#fbbf24'}">${reg.num}</span>` : ''}
            </td>`;
        });
        row += `</tr>`;
        cuerpo.innerHTML += row;
    });
}

function seleccionarCelda(f, h) {
    celdaActiva = { fecha: f, hora: h };
    document.getElementById('hora-seleccionada').innerText = `${f} | ${h}`;
    renderizarTablaSemanal();
}

async function registrarPorNumero() {
    const input = document.getElementById('num-rapido');
    let val = input.value;
    if(!celdaActiva.fecha || val === "") return;
    if(val !== '0' && val !== '00') val = val.padStart(2, '0');
    const ani = listaAnimales.find(a => a.n === val);
    await _supabase.from('historial_sorteos').upsert({ 
        fecha: celdaActiva.fecha, 
        hora: celdaActiva.hora, 
        num: val, 
        animal: ani.a, 
        tipo: ani.c 
    }, { onConflict: 'fecha,hora' });
    input.value = '';
    await cargarDatos();
}

function renderizarSupervision() {
    const contenedor = document.getElementById('contenedor-supervision');
    const fecha = document.getElementById('fecha-analisis').value;
    const jugadosHoy = historialGlobal.filter(r => r.fecha === fecha).map(r => r.num);
    contenedor.innerHTML = '';

    gruposVigilancia.forEach(g => {
        const encontrados = g.nums.filter(n => jugadosHoy.includes(n));
        const faltantes = g.nums.filter(n => !jugadosHoy.includes(n));
        
        let html = `<div class="card-grupo" style="border-left: 5px solid ${g.col}">
            <div class="grupo-header"><b>${g.nombre}</b> <span>${encontrados.length}/${g.nums.length}</span></div>
            <div class="bolitas-flex">`;
        
        g.nums.forEach(n => {
            const isOut = jugadosHoy.includes(n);
            html += `<div class="bolita ${isOut ? 'out' : ''}">${n}</div>`;
        });
        
        html += `</div>`;
        if(faltantes.length === 1 && encontrados.length > 0) {
            html += `<div class="alerta-faltante">🎯 PENDIENTE: ${faltantes[0]}</div>`;
        }
        html += `</div>`;
        contenedor.innerHTML += html;
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

function renderizarHistorial() {
    const lista = document.getElementById('lista-historial');
    const fecha = document.getElementById('fecha-busqueda-historial').value;
    if(!lista) return;
    lista.innerHTML = '';
    const filtrado = historialGlobal.filter(r => r.fecha === fecha);
    filtrado.forEach(r => {
        const ani = listaAnimales.find(a => a.n === r.num);
        lista.innerHTML += `<tr><td>${r.hora}</td><td><b>${r.num}</b></td><td>${r.animal}</td><td>${ani ? ani.s : '-'}</td></tr>`;
    });
}

window.onload = () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-analisis').value = hoy;
    document.getElementById('fecha-busqueda-historial').value = hoy;
    cargarDatos();
    setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
};
