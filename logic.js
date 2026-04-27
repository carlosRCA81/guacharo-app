// CONEXIÓN QUE RESPETA TUS DATOS DE ENERO
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
let currentWeekDays = [];

async function inicializar() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-picker').value = today;
    calculateWeek(today);
    setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
}

function calculateWeek(dateStr) {
    const date = new Date(dateStr + "T12:00:00");
    const dayOfWeek = date.getDay(); 
    const diff = date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    currentWeekDays = [];
    const headerRow = document.getElementById('header-days');
    let headerHtml = '<th>HORA</th>';
    for (let i = 0; i < 7; i++) {
        const d = new Date(date); d.setDate(diff + i);
        const dayString = d.toISOString().split('T')[0];
        currentWeekDays.push(dayString);
        headerHtml += `<th>${['L','M','M','J','V','S','D'][i]}<br><small>${d.getDate()}</small></th>`;
    }
    headerRow.innerHTML = headerHtml;
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('main-table');
    tableBody.innerHTML = "";
    horasSorteo.forEach((h, r) => {
        const row = document.createElement('tr');
        let html = `<td style="font-size:0.5rem; color:#666;">${h}</td>`;
        for (let c = 0; c < 7; c++) {
            const id = `${currentWeekDays[c]}_r${r}c${c}`;
            html += `<td><input type="text" class="cell-input" id="${id}" maxlength="2" oninput="analizarEnCaliente()"></td>`;
        }
        row.innerHTML = html;
        tableBody.appendChild(row);
    });
    cargarDesdeSupabase();
}

async function cargarDesdeSupabase() {
    const { data, error } = await _supabase.from('historial_sorteos').select('*');
    if (!error && data) {
        data.forEach(reg => {
            // Buscamos la celda que coincida con la fecha y la hora
            const colIndex = currentWeekDays.indexOf(reg.fecha);
            const rowIndex = horasSorteo.indexOf(reg.hora);
            if (colIndex !== -1 && rowIndex !== -1) {
                const input = document.getElementById(`${reg.fecha}_r${rowIndex}c${colIndex}`);
                if (input) input.value = reg.num;
            }
        });
        analizarEnCaliente();
    }
}

function analizarEnCaliente() {
    const fecha = document.getElementById('date-picker').value;
    const hoy = [];
    horasSorteo.forEach((h, r) => {
        const val = document.getElementById(`${fecha}_r${r}c${currentWeekDays.indexOf(fecha)}`)?.value;
        if(val) hoy.push({num: val, hora: h});
    });

    // LÓGICA DE CARLOS
    if (hoy.length > 0) {
        const actual = hoy[hoy.length-1].num;
        const anterior = hoy.length > 1 ? hoy[hoy.length-2].num : actual;
        const d1 = anterior.slice(-1);
        const d2 = actual.slice(-1);
        document.getElementById('arrastre-union').innerText = d1 + d2;
        document.getElementById('arrastre-suma').innerText = (parseInt(d1) + parseInt(d2)).toString().padStart(2, '0');
        const vinc = listaAnimales.find(a => a.n === (parseInt(d1+d2)%37).toString().padStart(2,'0'));
        document.getElementById('arrastre-animal').innerText = vinc ? vinc.a : "---";
    }
    renderizarMapa(hoy.map(h => h.num));
}

function renderizarMapa(jugados) {
    const mapa = document.getElementById('mapa-ruleta');
    if(!mapa) return;
    mapa.innerHTML = '';
    ['A','B','C','D','E','F'].forEach(s => {
        let html = `<div class="sector-block"><div class="sector-header">SECTOR ${s}</div><div class="sector-grid">`;
        listaAnimales.filter(a => a.s === s).forEach(ani => {
            html += `<div class="mini-animal ${jugados.includes(ani.n) ? 'sensor-fijo' : ''}">${ani.n}</div>`;
        });
        mapa.innerHTML += html + `</div></div>`;
    });
}

async function saveAllToSupabase() {
    const inputs = document.querySelectorAll('.cell-input');
    const dataToSave = [];
    inputs.forEach(input => {
        if (input.value !== "") {
            const [fecha, pos] = input.id.split('_');
            const rowIndex = pos.match(/r(\d+)/)[1];
            const ani = listaAnimales.find(a => a.n === input.value);
            dataToSave.push({
                fecha: fecha,
                hora: horasSorteo[rowIndex],
                num: input.value,
                animal: ani ? ani.a : '',
                tipo: ani ? ani.c : ''
            });
        }
    });
    const { error } = await _supabase.from('historial_sorteos').upsert(dataToSave, { onConflict: 'fecha,hora' });
    if (!error) alert("Historial sincronizado con Supabase");
}

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

function changeDate() { calculateWeek(document.getElementById('date-picker').value); }
window.onload = inicializar;
