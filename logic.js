// CONEXIÓN RECUPERADA DE TU WEB ORIGINAL
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
    "31": {a:"Lapa", s:"E"}, "32": {a:"Ardilla", s:"B"}, "33": {a:"Pescado", s:"F"}, "34": {a:"Venado", s:"C"},
    "35": {a:"Jirafa", s:"A"}, "36": {a:"Culebra", s:"D"}
};

// TUS 8 GRUPOS DE VIGILANCIA
const gruposVigilancia = [
    { nombre: "Trío Principal", nums: ["12", "08", "0"] },
    { nombre: "Pareja Fuerte", nums: ["25", "07"] },
    { nombre: "Bloque 30s", nums: ["03", "30", "36", "26", "33", "32"] },
    { nombre: "Cierres", nums: ["00", "29", "26"] }
];

const hours = ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM"];
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
        const dayStr = d.toISOString().split('T')[0];
        currentWeekDays.push(dayStr);
        headerHtml += `<th>${['L','M','M','J','V','S','D'][i]}<br><small>${d.getDate()}</small></th>`;
    }
    headerRow.innerHTML = headerHtml;
    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('main-table');
    tableBody.innerHTML = "";
    hours.forEach((h, r) => {
        const row = document.createElement('tr');
        let html = `<td class="hour-cell" style="font-size:0.6rem; color:#888;">${h}</td>`;
        for (let c = 0; c < 7; c++) {
            const id = `${currentWeekDays[c]}_r${r}c${c}`;
            html += `<td><input type="text" class="cell-input" id="${id}" maxlength="2" oninput="analizarTodo()"></td>`;
        }
        row.innerHTML = html;
        tableBody.appendChild(row);
    });
    loadFromSupabase();
}

async function loadFromSupabase() {
    const { data } = await _supabase.from('resultados').select('*'); [span_6](start_span)[span_7](start_span)// Trae el historial de enero[span_6](end_span)[span_7](end_span)
    if (data) {
        data.forEach(item => {
            const el = document.getElementById(item.celda_id);
            if (el) el.value = item.valor;
        });
        analizarTodo();
    }
}

function analizarTodo() {
    const inputs = document.querySelectorAll('.cell-input');
    const hoy = document.getElementById('date-picker').value;
    const jugadosHoy = [];
    inputs.forEach(input => { if(input.id.startsWith(hoy) && input.value !== "") jugadosHoy.push(input.value); });

    // Render Sectores A-F
    const secCont = document.getElementById('sector-display');
    secCont.innerHTML = '';
    ['A','B','C','D','E','F'].forEach(s => {
        const nums = jugadosHoy.filter(n => animals[n] && animals[n].s === s);
        secCont.innerHTML += `<div class="sector-box"><h4>SEC ${s}</h4><div class="sector-nums">${nums.join(',')}</div></div>`;
    });
}

async function saveAllToSupabase() {
    const inputs = document.querySelectorAll('.cell-input');
    const dataToSave = [];
    inputs.forEach(input => {
        if (input.value !== "") dataToSave.push({ celda_id: input.id, valor: input.value });
    });
    [span_8](start_span)[span_9](start_span)const { error } = await _supabase.from('resultados').upsert(dataToSave);[span_8](end_span)[span_9](end_span)
    if (!error) alert("¡Semana sincronizada!");
}

function changeDate() { calculateWeek(document.getElementById('date-picker').value); }
window.onload = initApp;
