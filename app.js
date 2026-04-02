const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- NAVEGACIÓN ---
function cambiarPestana(vista) {
    document.getElementById('vista-registro').classList.toggle('hidden', vista !== 'registro');
    document.getElementById('vista-analisis').classList.toggle('hidden', vista !== 'analisis');
    document.getElementById('tab-reg').className = vista === 'registro' ? 'flex-1 py-4 font-black text-xs tab-active' : 'flex-1 py-4 font-black text-xs text-slate-500';
    document.getElementById('tab-ana').className = vista === 'analisis' ? 'flex-1 py-4 font-black text-xs tab-active' : 'flex-1 py-4 font-black text-xs text-slate-500';
    if(vista === 'analisis') calcularEstadisticas();
}

// --- RELOJ Y SORTEO AUTOMÁTICO ---
function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj-digital').innerText = ahora.toLocaleTimeString('en-GB');
}
setInterval(actualizarReloj, 1000);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_manual').value = new Date().toISOString().split('T')[0];
    obtenerSecuencia();
});

// --- BASE DE DATOS ---
async function registrarSorteo() {
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    let hora = document.getElementById('hora_manual').value;

    if (hora === "AUTO") {
        const h = new Date().getHours();
        hora = `${h < 10 ? '0'+h : h}:00`;
    }

    if (!animal) return alert("Escribe el resultado");

    const { error } = await _supabase.from('control_guacharo').insert([{ animalito: animal, fecha_sorteo: fecha, hora_sorteo: hora }]);
    if (!error) {
        document.getElementById('animalito').value = "";
        obtenerSecuencia();
    }
}

async function obtenerSecuencia() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('fecha_sorteo', { ascending: false }).order('hora_sorteo', { ascending: false }).limit(12);
    const lista = document.getElementById('lista-resultados');
    lista.innerHTML = "";
    data.forEach(item => {
        lista.innerHTML += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                <div><span class="block text-[8px] text-slate-600 font-bold">${item.fecha_sorteo}</span><span class="text-xl font-black">${item.animalito}</span></div>
                <div class="text-yellow-600 font-mono font-bold text-xs">${item.hora_sorteo}</div>
            </div>`;
    });
}

// --- ALGORITMO DE INTELIGENCIA ---
async function calcularEstadisticas() {
    const { data } = await _supabase.from('control_guacharo').select('*').order('id', { ascending: false }).limit(100);
    if (!data) return;

    const conteo = {};
    const parejas = {};
    
    data.forEach((item, index) => {
        // Contar frecuencia
        conteo[item.animalito] = (conteo[item.animalito] || 0) + 1;
        
        // Detectar parejas (si salió este, ¿cuál salió justo antes en el tiempo?)
        if (index < data.length - 1) {
            const actual = item.animalito;
            const previo = data[index + 1].animalito;
            if (!parejas[previo]) parejas[previo] = {};
            parejas[previo][actual] = (parejas[previo][actual] || 0) + 1;
        }
    });

    // Mostrar Caliente y Frío
    const ordenados = Object.entries(conteo).sort((a,b) => b[1] - a[1]);
    document.getElementById('num-caliente').innerText = ordenados[0] ? ordenados[0][0] : "--";
    document.getElementById('num-frio').innerText = ordenados[ordenados.length-1] ? ordenados[ordenados.length-1][0] : "--";

    // Mostrar Secuencias (Parejas frecuentes)
    const patronesDiv = document.getElementById('patrones-secuencia');
    patronesDiv.innerHTML = "";
    Object.entries(parejas).slice(0, 5).forEach(([prev, sigs]) => {
        const masProbable = Object.entries(sigs).sort((a,b) => b[1] - a[1])[0][0];
        patronesDiv.innerHTML += `
            <div class="flex justify-between bg-slate-800/50 p-2 rounded">
                <span>Si sale <b class="text-white">${prev}</b></span>
                <span class="text-yellow-500">➜ viene <b class="text-yellow-400 text-lg">${masProbable}</b></span>
            </div>`;
    });
}
