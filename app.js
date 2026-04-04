const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

// Reloj y fecha inicial
setInterval(() => {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_hoy').value = hoy;
    document.getElementById('filtro_fecha').value = hoy;
    cargarSorteosHoy();
});

// Navegación de pestañas
function cambiarPestana(id) {
    document.getElementById('vista-registro').classList.toggle('hidden', id !== 'registro');
    document.getElementById('vista-historial').classList.toggle('hidden', id !== 'historial');
    document.getElementById('vista-analisis').classList.toggle('hidden', id !== 'analisis');

    document.getElementById('tab-reg').className = id === 'registro' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';
    document.getElementById('tab-his').className = id === 'historial' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';
    document.getElementById('tab-ana').className = id === 'analisis' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';

    if (id === 'analisis') generarEsquemaPorcentajes();
}

// Guardar nuevo resultado
async function registrarSorteo() {
    const num = document.getElementById('animalito').value;
    const fecha = document.getElementById('fecha_hoy').value;
    const hora = document.getElementById('hora_manual').value;

    if (!num) return alert("Ingresa el resultado");

    const { error } = await _supabase.from('control_guacharo').insert([{ animalito: num, fecha_sorteo: fecha, hora_sorteo: hora }]);
    
    if (!error) {
        document.getElementById('animalito').value = "";
        cargarSorteosHoy();
        alert("Guardado con éxito");
    }
}

// Cargar solo lo de hoy para la pestaña principal
async function cargarSorteosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo')
        .select('*')
        .eq('fecha_sorteo', hoy)
        .order('hora_sorteo', { ascending: false });

    const lista = document.getElementById('lista-hoy');
    lista.innerHTML = "";
    data.forEach(s => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg border-l-4 border-l-yellow-600">
                <div>
                    <div class="text-[9px] text-slate-500 font-bold">${s.fecha_sorteo}</div>
                    <div class="text-2xl font-black">${s.animalito}</div>
                </div>
                <div class="text-yellow-600 font-black text-xs italic">${s.hora_sorteo}</div>
            </div>`;
    });
}

// Buscar cualquier fecha (Almanaque)
async function buscarPorFecha() {
    const fechaBusqueda = document.getElementById('filtro_fecha').value;
    const { data } = await _supabase.from('control_guacharo')
        .select('*')
        .eq('fecha_sorteo', fechaBusqueda)
        .order('hora_sorteo', { ascending: false });

    const container = document.getElementById('lista-historial');
    container.innerHTML = `<h4 class="text-blue-500 font-black text-center text-[10px] uppercase mb-4 tracking-widest italic">Resultados del ${fechaBusqueda}</h4>`;

    if (data.length === 0) {
        container.innerHTML += `<p class="text-center text-slate-700 text-xs py-10">No hay registros para este día.</p>`;
        return;
    }

    let html = `<div class="grid grid-cols-2 gap-3">`;
    data.forEach(s => {
        html += `
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span class="text-lg font-black">${s.animalito}</span>
                <span class="text-slate-500 font-mono text-[9px]">${s.hora_sorteo.substring(0,5)}</span>
            </div>`;
    });
    html += `</div>`;
    container.innerHTML += html;
}

// Lógica de porcentajes e inteligencia
async function generarEsquemaPorcentajes() {
    const { data } = await _supabase.from('control_guacharo').select('animalito');
    const total = data.length;
    const conteo = data.reduce((acc, v) => { acc[v.animalito] = (acc[v.animalito] || 0) + 1; return acc; }, {});
    
    const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const container = document.getElementById('graficos-porcentaje');
    container.innerHTML = "";

    sorted.forEach(([num, cant]) => {
        const porc = ((cant / total) * 100).toFixed(1);
        container.innerHTML += `
            <div>
                <div class="flex justify-between text-[10px] font-black uppercase">
                    <span>Animal/Número ${num}</span>
                    <span class="text-yellow-500">${porc}%</span>
                </div>
                <div class="bar-chart"><div class="bar-fill" style="width: ${porc}%"></div></div>
            </div>`;
    });
}
