const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

const FAMILIAS = {
    "TIERRA": [1, 2, 5, 10, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 26, 27, 29, 31, 32, 34, 35, 38, 41, 44, 46, 48, 49, 61, 62, 66, 68, 69, 70, 72, 73],
    "AGUA": [0, "00", 6, 30, 33, 37, 52, 53, 55, 60, 63],
    "AIRE": [7, 9, 14, 17, 21, 25, 28, 39, 42, 45, 47, 50, 51, 64, 67, 71, 74, 75],
    "INSECTO": [3, 4, 40, 43, 54, 56, 58, 59, 65]
};

// RELOJ
setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

// NAVEGACIÓN (Reparada)
function cambiarPestana(id) {
    const vistas = ['registro', 'historial', 'analisis', 'semanal'];
    vistas.forEach(v => document.getElementById(`vista-${v}`).classList.add('hidden'));
    document.getElementById(`vista-${id}`).classList.remove('hidden');

    // Estilo de botones
    const map = { registro: 'reg', historial: 'his', analisis: 'ana', semanal: 'sem' };
    vistas.forEach(v => {
        document.getElementById(`tab-${map[v]}`).className = (v === id) ? 
            'flex-1 py-4 font-black text-[9px] uppercase tab-active' : 
            'flex-1 py-4 font-black text-[9px] uppercase text-slate-500';
    });

    if (id === 'registro') cargarSorteosHoy();
    if (id === 'historial') cargarHistorialCompleto();
    if (id === 'analisis') generarInteligencia();
    if (id === 'semanal') generarEstadisticaSemanal();
}

async function registrarSorteo() {
    const num = document.getElementById('animalito').value;
    const fec = document.getElementById('fecha_hoy').value;
    const hor = document.getElementById('hora_manual').value;
    if (!num) return;

    await _supabase.from('control_guacharo').insert([{ animalito: num, fecha_sorteo: fec, hora_sorteo: `${hor}:00` }]);
    document.getElementById('animalito').value = "";
    cargarSorteosHoy();
}

async function cargarSorteosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', hoy).order('hora_sorteo', { ascending: false });
    const list = document.getElementById('lista-hoy');
    list.innerHTML = data.map(s => `
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center border-l-4 border-l-yellow-600 shadow-md">
            <span class="text-2xl font-black">${s.animalito}</span>
            <span class="text-yellow-600 font-mono text-[10px] font-bold italic">${s.hora_sorteo.substring(0,5)}</span>
        </div>
    `).join('');
}

async function cargarHistorialCompleto() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('created_at', { ascending: false });
    document.getElementById('lista-historial-completo').innerHTML = data.map(s => `
        <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex justify-between text-[10px] items-center">
            <span class="font-black text-white w-8">${s.animalito}</span>
            <span class="text-slate-500">${s.fecha_sorteo}</span>
            <span class="text-yellow-600 italic font-bold">${s.hora_sorteo.substring(0,5)}</span>
        </div>
    `).join('');
}

async function generarInteligencia() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('created_at', { ascending: true });
    if (!data.length) return;

    const counts = data.reduce((acc, v) => { acc[v.animalito] = (acc[v.animalito] || 0) + 1; return acc; }, {});
    const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
    
    document.getElementById('pronostico-destacado').innerText = sorted.slice(0,3).map(x => x[0]).join(' - ');
    
    document.getElementById('graficos-frecuencia').innerHTML = sorted.slice(0,6).map(([num, cant]) => {
        const porc = ((cant / data.length) * 100).toFixed(1);
        return `<div>
            <div class="flex justify-between text-[8px] font-black uppercase mb-1"><span>Animal ${num}</span><span>${porc}%</span></div>
            <div class="bar-chart"><div class="bar-fill" style="width: ${porc}%"></div></div>
        </div>`;
    }).join('');
}

async function generarEstadisticaSemanal() {
    const { data } = await _supabase.from('control_guacharo').select('*');
    const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const container = document.getElementById('contenedor-semanal');
    
    const resumen = data.reduce((acc, s) => {
        const d = dias[new Date(s.fecha_sorteo + 'T00:00:00').getDay()];
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "OTRO";
        if (!acc[d]) acc[d] = {};
        acc[d][fam] = (acc[d][fam] || 0) + 1;
        return acc;
    }, {});

    container.innerHTML = dias.map(d => {
        if (!resumen[d]) return '';
        const dom = Object.entries(resumen[d]).sort((a,b) => b[1]-a[1])[0][0];
        return `
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg">
                <span class="font-black text-[10px]">${d}</span>
                <span class="text-yellow-600 font-bold italic text-[10px]">DOMINIO: ${dom}</span>
            </div>`;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_hoy').value = new Date().toISOString().split('T')[0];
    cargarSorteosHoy();
});
