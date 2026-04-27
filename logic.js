const SUPABASE_URL = 'https://nwivobbeorubrotxgalr.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_SDWDL5sRPlktWzF9ghQOZA_obNCXDsJ'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const animals = { 
    "0": {a:"Delfín", s:"A"}, "00": {a:"Ballena", s:"D"}, "1": {a:"Carnero", s:"D"}, "2": {a:"Toro", s:"A"},
    "3": {a:"Ciempiés", s:"C"}, "4": {a:"Alacrán", s:"F"}, "5": {a:"León", s:"C"}, "6": {a:"Rana", s:"F"},
    "7": {a:"Perico", s:"B"}, "8": {a:"Ratón", s:"E"}, "9": {a:"Águila", s:"A"}, "10": {a:"Tigre", s:"D"},
    "11": {a:"Gato", s:"B"}, "12": {a:"Caballo", s:"E"}, "13": {a:"Mono", s:"D"}, "14": {a:"Paloma", s:"A"},
    "15": {a:"Zorro", s:"C"}, "16": {a:"Oso", s:"F"}, "17": {a:"Pavo", s:"B"}, "18": {a:"Burro", s:"E"},
    "19": {a:"Chivo", s:"E"}, "20": {a:"Cochino", s:"B"}, "21": {a:"Gallo", s:"F"}, "22": {a:"Camello", s:"C"},
    "23": {a:"Cebra", s:"F"}, "24": {a:"Iguana", s:"C"}, "25": {a:"Gallina", s:"D"}, "26": {a:"Vaca", s:"A"},
    "27": {a:"Perro", s:"D"}, "28": {a:"Zamuro", s:"A"}, "29": {a:"Elefante", s:"E"}, "30": {a:"Caimán", s:"B"},
    "31": {a:"LAPA", s:"E"}, "32": {a:"Ardilla", s:"B"}, "33": {a:"Pescado", s:"F"}, "34": {a:"Venado", s:"C"},
    "35": {a:"Jirafa", s:"A"}, "36": {a:"Culebra", s:"D"}
};

const gruposVigilancia = [
    { id: 1, nums: ["00", "26", "29"] },
    { id: 2, nums: ["03", "36", "26", "33", "32", "30"] },
    { id: 3, nums: ["25", "07"] },
    { id: 4, nums: ["20", "17"] },
    { id: 5, nums: ["05", "12", "18", "09"] },
    { id: 6, nums: ["12", "07", "0"] },
    { id: 7, nums: ["31", "10", "01"] },
    { id: 8, nums: ["18", "28", "11", "22"] }
];

const hours = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"];
const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];
let currentWeekDays = [];

function initApp() {
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
        headerHtml += `<th>${dayLabels[i]}<br><small>${d.getDate()}</small></th>`;
    }
    headerRow.innerHTML = headerHtml;
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('main-table');
    tableBody.innerHTML = "";
    hours.forEach((h, r) => {
        const row = document.createElement('tr');
        let html = `<td class="hour-cell">${h}</td>`;
        for (let c = 0; c < 7; c++) {
            const uniqueId = `${currentWeekDays[c]}_r${r}c${c}`;
            html += `<td>
                <input type="text" class="cell-input" maxlength="2" id="${uniqueId}" oninput="handleInput(this)" placeholder="-">
                <div class="animal-display" id="animal-${uniqueId}"></div>
            </td>`;
        }
        row.innerHTML = html;
        tableBody.appendChild(row);
    });
    loadWeekFromSupabase();
}

async function loadWeekFromSupabase() {
    const { data } = await _supabase.from('resultados').select('*').in('celda_id', currentWeekDays.map(d => hours.map((h,r) => `${d}_r${r}c0`)).flat()); // Simplificado para el ejemplo
    if (data) {
        data.forEach(item => {
            const el = document.getElementById(item.celda_id);
            if (el) { el.value = item.valor; updateAnimalLabel(item.celda_id, item.valor); }
        });
        analizarTodo();
    }
}

function updateAnimalLabel(id, val) {
    const div = document.getElementById('animal-' + id);
    if (animals[val]) div.innerText = animals[val].a;
}

function handleInput(input) {
    updateAnimalLabel(input.id, input.value.trim());
    analizarTodo();
}

function analizarTodo() {
    const inputs = document.querySelectorAll('.cell-input');
    const hoy = document.getElementById('date-picker').value;
    const jugadosHoy = [];
    
    // 1. Recolectar jugados de la fecha seleccionada
    inputs.forEach(input => {
        if (input.id.startsWith(hoy) && input.value.trim() !== "") jugadosHoy.push(input.value.trim());
    });

    // 2. Renderizar Sectores
    const secCont = document.getElementById('sector-display');
    secCont.innerHTML = '';
    ['A','B','C','D','E','F'].forEach(s => {
        const enSector = jugadosHoy.filter(n => animals[n] && animals[n].s === s);
        secCont.innerHTML += `<div class="sector-box"><h4>SEC ${s}</h4><div class="sector-nums">${enSector.join(',')}</div></div>`;
    });

    // 3. Renderizar Vigilancia
    const supCont = document.getElementById('contenedor-supervision');
    supCont.innerHTML = '';
    gruposVigilancia.forEach(g => {
        const encontrados = g.nums.filter(n => jugadosHoy.includes(n));
        const faltantes = g.nums.filter(n => !jugadosHoy.includes(n));
        if (encontrados.length > 0) {
            let html = `<div class="card-grupo"><b>Grupo #${g.id}</b><div class="bolitas-flex">`;
            g.nums.forEach(n => html += `<div class="bolita ${jugadosHoy.includes(n) ? 'out' : ''}">${n}</div>`);
            html += `</div>`;
            if (faltantes.length > 0) html += `<div class="alerta-faltante">Falta: ${faltantes.join(',')}</div>`;
            html += `</div>`;
            supCont.innerHTML += html;
        }
    });
}

async function saveAllToSupabase() {
    const status = document.getElementById('save-status');
    const inputs = document.querySelectorAll('.cell-input');
    const dataToSave = [];
    status.innerText = "⏳ Guardando...";
    inputs.forEach(input => {
        const val = input.value.trim();
        if (val !== "") dataToSave.push({ celda_id: input.id, valor: val });
    });
    const { error } = await _supabase.from('resultados').upsert(dataToSave);
    if (!error) status.innerText = "✅ SEMANA GUARDADA";
}

function changeDate() { calculateWeek(document.getElementById('date-picker').value); }
function resetView() { if(confirm("¿Limpiar vista?")) updateTable(); }
window.onload = initApp;
