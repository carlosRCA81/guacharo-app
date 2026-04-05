const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

const FAMILIAS = {
    "TIERRA": [1, 2, 5, 10, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 26, 27, 29, 31, 32, 34, 35, 38, 41, 44, 46, 48, 49, 61, 62, 66, 68, 69, 70, 72, 73],
    "AGUA": [0, "00", 6, 30, 33, 37, 52, 53, 55, 60, 63],
    "AIRE": [7, 9, 14, 17, 21, 25, 28, 39, 42, 45, 47, 50, 51, 64, 67, 71, 74, 75],
    "INSECTO": [3, 4, 40, 43, 54, 56, 58, 59, 65]
};

// RELOJ EN TIEMPO REAL
setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

// NAVEGACIÓN BLINDADA
function cambiarPestana(id) {
    const ids = ['registro', 'historial', 'inteligencia', 'estadistica'];
    ids.forEach(v => document.getElementById(`vista-${v}`).classList.add('hidden'));
    document.getElementById(`vista-${id}`).classList.remove('hidden');

    const tabs = { registro: 'reg', historial: 'his', inteligencia: 'int', estadistica: 'est' };
    ids.forEach(v => {
        document.getElementById(`tab-${tabs[v]}`).className = (v === id) ? 
            'flex-1 py-4 font-black text-[9px] uppercase tab-active' : 
            'flex-1 py-4 font-black text-[9px] uppercase text-slate-500';
    });

    if (id === 'registro') cargarHoy();
    if (id === 'historial') cargarTodo();
    if (id === 'inteligencia') correrAlgoritmo();
    if (id === 'estadistica') analizarPatrones();
}

async function guardarSorteo() {
    const animal = document.getElementById('animalito').value;
    const fecha = document.getElementById('fecha_input').value;
    const hora = document.getElementById('hora_input').value;
    if (!animal) return alert("Ingrese un número válido");

    await _supabase.from('control_guacharo').insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: `${hora}:00` }]);
    document.getElementById('animalito').value = "";
    cargarHoy();
}

async function cargarHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', hoy).order('hora_sorteo', { ascending: false });
    const list = document.getElementById('lista-hoy');
    list.innerHTML = data.map(s => {
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "OTRO";
        return `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center border-l-4 border-l-yellow-600">
                <div><p class="text-[7px] font-black text-slate-500 uppercase">${fam}</p><p class="text-2xl font-black">${s.animalito}</p></div>
                <span class="text-yellow-600 font-mono text-[10px] font-bold italic">${s.hora_sorteo.substring(0,5)}</span>
            </div>`;
    }).join('');
}

async function cargarTodo() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('created_at', { ascending: false });
    document.getElementById('contenedor-historial').innerHTML = data.map(s => `
        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex justify-between text-[10px] items-center">
            <span class="font-black text-white w-8">${s.animalito}</span>
            <span class="text-slate-500 font-bold">${s.fecha_sorteo}</span>
            <span class="text-yellow-600 italic font-bold">${s.hora_sorteo.substring(0,5)}</span>
        </div>`).join('');
}

async function correrAlgoritmo() {
    const { data } = await _supabase.from('control_guacharo').select('*');
    if (!data.length) return;

    const conteo = data.reduce((acc, v) => { acc[v.animalito] = (acc[v.animalito] || 0) + 1; return acc; }, {});
    const tops = Object.entries(conteo).sort((a,b) => b[1]-a[1]);
    
    document.getElementById('resultado-algoritmo').innerText = tops.slice(0,3).map(x => x[0]).join(' - ');
    
    document.getElementById('graficas-frecuencia').innerHTML = tops.slice(0,5).map(([num, cant]) => {
        const perc = ((cant / data.length) * 100).toFixed(1);
        return `<div>
            <div class="flex justify-between text-[8px] font-black uppercase"><span>Animal ${num}</span><span>${perc}%</span></div>
            <div class="bar-chart"><div class="bar-fill" style="width: ${perc}%"></div></div>
        </div>`;
    }).join('');
}

async function analizarPatrones() {
    const { data } = await _supabase.from('control_guacharo').select('*');
    const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    
    const inteligencia = data.reduce((acc, s) => {
        const d = diasSemana[new Date(s.fecha_sorteo + 'T00:00:00').getDay()];
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "OTRO";
        if (!acc[d]) acc[d] = { animales: {}, familias: {} };
        acc[d].animales[s.animalito] = (acc[d].animales[s.animalito] || 0) + 1;
        acc[d].familias[fam] = (acc[d].familias[fam] || 0) + 1;
        return acc;
    }, {});

    document.getElementById('contenedor-patrones').innerHTML = diasSemana.map(d => {
        if (!inteligencia[d]) return '';
        const domFam = Object.entries(inteligencia[d].familias).sort((a,b) => b[1]-a[1])[0][0];
        const topAnim = Object.entries(inteligencia[d].animales).sort((a,b) => b[1]-a[1]).slice(0,2).map(x => x[0]).join(' y ');
        return `
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center border-l-4 border-l-yellow-600 shadow-lg">
                <div><p class="font-black text-[10px]">${d}</p><p class="text-yellow-600 font-bold italic text-[8px] uppercase">DOMINIO: ${domFam}</p></div>
                <div class="text-right"><p class="text-[7px] text-slate-500 font-bold uppercase">Tendencia</p><p class="text-white font-black text-sm">${topAnim}</p></div>
            </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_input').value = new Date().toISOString().split('T')[0];
    cargarHoy();
});
