const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

const FAMILIAS = {
    "TIERRA": [1, 2, 5, 10, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 26, 27, 29, 31, 32, 34, 35, 38, 41, 44, 46, 48, 49, 61, 62, 66, 68, 69, 70, 72, 73],
    "AGUA": [0, "00", 6, 30, 33, 37, 52, 53, 55, 60, 63],
    "AIRE": [7, 9, 14, 17, 21, 25, 28, 39, 42, 45, 47, 50, 51, 64, 67, 71, 74, 75],
    "INSECTO": [3, 4, 40, 43, 54, 56, 58, 59, 65]
};

// Reloj en tiempo real
setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_hoy').value = new Date().toISOString().split('T')[0];
    cargarSorteosHoy();
});

function cambiarPestana(id) {
    const vistas = ['registro', 'historial', 'analisis', 'semanal'];
    vistas.forEach(v => document.getElementById(`vista-${v}`)?.classList.toggle('hidden', v !== id));
    
    // Estética de botones
    const tabs = { 'registro': 'reg', 'historial': 'his', 'analisis': 'ana', 'semanal': 'sem' };
    Object.entries(tabs).forEach(([key, val]) => {
        document.getElementById(`tab-${val}`).className = (key === id) ? 
            'flex-1 py-4 font-black text-[9px] tab-active text-center' : 
            'flex-1 py-4 font-black text-[9px] text-slate-500 text-center';
    });

    if (id === 'analisis') generarEsquemaPorcentajes();
    if (id === 'semanal') generarEstadisticaSemanal();
}

async function registrarSorteo() {
    const num = document.getElementById('animalito').value;
    const fecha = document.getElementById('fecha_hoy').value;
    const hora = document.getElementById('hora_manual').value;
    if (!num) return;

    const { error } = await _supabase.from('control_guacharo').insert([{ 
        animalito: num, fecha_sorteo: fecha, hora_sorteo: `${hora}:00` 
    }]);

    if (!error) {
        document.getElementById('animalito').value = "";
        cargarSorteosHoy();
        alert("Información procesada.");
    }
}

async function generarEsquemaPorcentajes() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('created_at', { ascending: true });
    if (!data || data.length === 0) return;

    // Lógica de Seguidores Históricos
    const ultimo = data[data.length - 1].animalito;
    const seguidores = {};
    for (let i = 0; i < data.length - 1; i++) {
        if (data[i].animalito == ultimo) {
            const sgte = data[i + 1].animalito;
            seguidores[sgte] = (seguidores[sgte] || 0) + 1;
        }
    }
    const sugerido = Object.entries(seguidores).sort((a,b) => b[1]-a[1])[0];

    // Mostrar en Bitácora
    document.getElementById('bitacora-analisis').innerHTML = `
        <div class="text-yellow-500 font-black">> ÚLTIMO: ${ultimo}</div>
        <div class="text-white mt-1">> SEGUIDOR MÁS PROBABLE: ${sugerido ? 'El histórico indica salto al <b>' + sugerido[0] + '</b>' : 'Recopilando datos...'}</div>
    `;

    // Gráficos de frecuencia
    const conteo = data.reduce((acc, v) => { acc[v.animalito] = (acc[v.animalito] || 0) + 1; return acc; }, {});
    const sorted = Object.entries(conteo).sort((a,b) => b[1]-a[1]);
    document.getElementById('pronostico-destacado').innerText = sorted.slice(0, 3).map(i => i[0]).join(' - ');

    const container = document.getElementById('graficos-porcentaje');
    container.innerHTML = "";
    sorted.slice(0, 6).forEach(([num, cant]) => {
        const porc = ((cant / data.length) * 100).toFixed(1);
        container.innerHTML += `
            <div>
                <div class="flex justify-between text-[9px] font-black uppercase mb-1"><span>Animal ${num}</span><span>${porc}%</span></div>
                <div class="bar-chart"><div class="bar-fill" style="width: ${porc}%"></div></div>
            </div>`;
    });
}

async function generarEstadisticaSemanal() {
    const { data } = await _supabase.from('control_guacharo').select('*');
    if (!data) return;

    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const resumen = {};

    data.forEach(s => {
        const d = new Date(s.fecha_sorteo + 'T00:00:00').getDay();
        const diaNombre = dias[d];
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "OTRO";
        
        if (!resumen[diaNombre]) resumen[diaNombre] = {};
        resumen[diaNombre][fam] = (resumen[diaNombre][fam] || 0) + 1;
    });

    const container = document.getElementById('contenedor-semanal');
    container.innerHTML = "";
    dias.forEach(dia => {
        if (resumen[dia]) {
            const dom = Object.entries(resumen[dia]).sort((a,b) => b[1]-a[1])[0];
            container.innerHTML += `
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span class="font-black text-[10px] uppercase">${dia}</span>
                    <span class="text-yellow-600 font-bold italic text-[10px]">Dominio: ${dom[0]}</span>
                </div>`;
        }
    });
}

async function cargarSorteosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', hoy).order('hora_sorteo', { ascending: false });
    const lista = document.getElementById('lista-hoy');
    lista.innerHTML = "";
    data?.forEach(s => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center border-l-4 border-l-yellow-600 shadow">
                <span class="text-2xl font-black">${s.animalito}</span>
                <span class="text-yellow-600 font-mono text-[10px] font-bold">${s.hora_sorteo.substring(0,5)}</span>
            </div>`;
    });
}
