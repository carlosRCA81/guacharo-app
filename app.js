const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function cambiarPestana(vista) {
    document.getElementById('vista-registro').classList.toggle('hidden', vista !== 'registro');
    document.getElementById('vista-historial').classList.toggle('hidden', vista !== 'historial');
    document.getElementById('vista-analisis').classList.toggle('hidden', vista !== 'analisis');
    
    document.getElementById('tab-reg').className = vista === 'registro' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';
    document.getElementById('tab-his').className = vista === 'historial' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';
    document.getElementById('tab-ana').className = vista === 'analisis' ? 'flex-1 py-4 font-black text-[10px] tab-active' : 'flex-1 py-4 font-black text-[10px] text-slate-500';
    
    if(vista === 'analisis') calcularPorcentajes();
    if(vista === 'historial') cargarHistorialSemanal();
}

setInterval(() => {
    document.getElementById('reloj-digital').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);

document.addEventListener('DOMContentLoaded', () => {
    cargarHoy();
});

async function registrarSorteo() {
    const animal = document.getElementById('animalito').value.trim();
    let hora = document.getElementById('hora_manual').value;
    const hoy = new Date().toISOString().split('T')[0];

    if (hora === "AUTO") {
        const h = new Date().getHours();
        hora = `${h < 10 ? '0'+h : h}:00`;
    }

    if (!animal) return alert("Ingresa el número");

    const { error } = await _supabase.from('control_guacharo').insert([{ animalito: animal, fecha_sorteo: hoy, hora_sorteo: hora }]);
    if (!error) {
        document.getElementById('animalito').value = "";
        cargarHoy();
    }
}

async function cargarHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', hoy).order('hora_sorteo', { ascending: false });
    
    const lista = document.getElementById('lista-hoy');
    lista.innerHTML = data.length === 0 ? "<p class='text-center text-slate-600 text-[10px]'>Esperando resultados de hoy...</p>" : "";
    data.forEach(item => {
        lista.innerHTML += `<div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-md">
            <span class="text-2xl font-black">${item.animalito}</span>
            <span class="text-yellow-600 font-mono font-bold text-xs">${item.hora_sorteo}</span>
        </div>`;
    });
}

async function cargarHistorialSemanal() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('fecha_sorteo', { ascending: false }).order('hora_sorteo', { ascending: false }).limit(84);
    const container = document.getElementById('lista-historial-completo');
    container.innerHTML = "";

    // Agrupar por fecha
    const grupos = data.reduce((r, a) => {
        r[a.fecha_sorteo] = r[a.fecha_sorteo] || [];
        r[a.fecha_sorteo].push(a);
        return r;
    }, {});

    Object.entries(grupos).forEach(([fecha, sorteos]) => {
        let html = `<div class="bg-slate-900/50 p-2 rounded-xl border border-slate-800/50">
            <h4 class="text-blue-500 font-black text-[10px] mb-3 border-b border-slate-800 pb-1 uppercase">${fecha}</h4>
            <div class="grid grid-cols-4 gap-2">`;
        sorteos.forEach(s => {
            html += `<div class="text-center bg-slate-800 p-2 rounded">
                <div class="text-white font-black text-sm">${s.animalito}</div>
                <div class="text-[7px] text-slate-500">${s.hora_sorteo.substring(0,5)}</div>
            </div>`;
        });
        html += `</div></div>`;
        container.innerHTML += html;
    });
}

async function calcularPorcentajes() {
    const { data } = await _supabase.from('control_guacharo').select('animalito').limit(200);
    const total = data.length;
    const conteo = data.reduce((acc, val) => { acc[val.animalito] = (acc[val.animalito] || 0) + 1; return acc; }, {});
    
    const esquema = document.getElementById('esquema-porcentaje');
    esquema.innerHTML = `<h3 class="text-[10px] font-black text-slate-500 uppercase text-left mb-2 tracking-widest">Esquema de Salida (%)</h3>`;
    
    const ordenados = Object.entries(conteo).sort((a,b) => b[1] - a[1]);
    
    ordenados.slice(0, 6).forEach(([num, cant]) => {
        const porc = ((cant / total) * 100).toFixed(1);
        esquema.innerHTML += `
            <div class="text-left">
                <div class="flex justify-between text-[10px] font-bold mb-1">
                    <span>${num}</span>
                    <span class="text-yellow-500">${porc}%</span>
                </div>
                <div class="bar-chart"><div class="bar-fill" style="width: ${porc}%"></div></div>
            </div>`;
    });

    document.getElementById('num-caliente').innerText = ordenados[0] ? ordenados[0][0] : "--";
    document.getElementById('num-frio').innerText = ordenados[ordenados.length-1] ? ordenados[ordenados.length-1][0] : "--";
}
