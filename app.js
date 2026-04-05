const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

// DICCIONARIO DE FAMILIAS PROFESIONAL
const FAMILIAS = {
    "TIERRA": [1, 2, 5, 10, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 26, 27, 29, 31, 32, 34, 35, 38, 41, 44, 46, 48, 49, 61, 62, 66, 68, 69, 70, 72, 73],
    "AGUA": [0, "00", 6, 30, 33, 37, 52, 53, 55, 60, 63],
    "AIRE": [7, 9, 14, 17, 21, 25, 28, 39, 42, 45, 47, 50, 51, 64, 67, 71, 74, 75],
    "INSECTO": [3, 4, 40, 43, 54, 56, 58, 59, 65]
};

// RELOJ
setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB'); }, 1000);

document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_hoy').value = hoy;
    document.getElementById('filtro_fecha').value = hoy;
    cargarSorteosHoy();
});

function cambiarPestana(id) {
    document.getElementById('vista-registro').classList.toggle('hidden', id !== 'registro');
    document.getElementById('vista-historial').classList.toggle('hidden', id !== 'historial');
    document.getElementById('vista-analisis').classList.toggle('hidden', id !== 'analisis');
    if (id === 'analisis') generarEsquemaPorcentajes();
}

async function registrarSorteo() {
    const num = document.getElementById('animalito').value;
    const fecha = document.getElementById('fecha_hoy').value;
    const hora = document.getElementById('hora_manual').value;
    if (!num) return alert("Reporte incompleto");
    const { error } = await _supabase.from('control_guacharo').insert([{ animalito: num, fecha_sorteo: fecha, hora_sorteo: hora }]);
    if (!error) {
        document.getElementById('animalito').value = "";
        cargarSorteosHoy();
        alert("Reporte guardado en base de datos central.");
    }
}

async function cargarSorteosHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', hoy).order('hora_sorteo', { ascending: false });
    const lista = document.getElementById('lista-hoy');
    lista.innerHTML = "";
    data.forEach(s => {
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "DESCONOCIDO";
        lista.innerHTML += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-lg border-l-4 border-l-yellow-600">
                <div>
                    <div class="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">${fam}</div>
                    <div class="text-2xl font-black">${s.animalito}</div>
                </div>
                <div class="text-right">
                    <div class="text-yellow-600 font-black text-[10px] italic">${s.hora_sorteo}</div>
                </div>
            </div>`;
    });
}

// BUSCAR POR FECHA
async function buscarPorFecha() {
    const f = document.getElementById('filtro_fecha').value;
    const { data } = await _supabase.from('control_guacharo').select('*').eq('fecha_sorteo', f).order('hora_sorteo', { ascending: false });
    const container = document.getElementById('lista-historial');
    container.innerHTML = `<h4 class="text-yellow-500 font-black text-center text-[10px] uppercase mb-4 italic tracking-widest">Reporte Histórico: ${f}</h4>`;
    if (data.length === 0) return container.innerHTML += `<p class="text-center text-slate-700 py-10 text-xs uppercase font-bold">Sin registros</p>`;
    let html = `<div class="grid grid-cols-2 gap-2">`;
    data.forEach(s => {
        html += `<div class="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center"><span class="text-lg font-black">${s.animalito}</span><span class="text-slate-500 font-mono text-[8px]">${s.hora_sorteo}</span></div>`;
    });
    container.innerHTML += html + `</div>`;
}

// MOTOR DE INTELIGENCIA PRO
async function generarEsquemaPorcentajes() {
    const franja = document.getElementById('filtro_franja').value;
    const { data } = await _supabase.from('control_guacharo').select('animalito, hora_sorteo').order('created_at', { ascending: true });
    
    if (!data || data.length === 0) return;

    let filtrados = data;
    if (franja === "MANANA") {
        filtrados = data.filter(d => parseInt(d.hora_sorteo) >= 8 && parseInt(d.hora_sorteo) <= 12);
    } else if (franja === "TARDE") {
        filtrados = data.filter(d => parseInt(d.hora_sorteo) >= 13 && parseInt(d.hora_sorteo) <= 19);
    }

    // 1. ANALISIS DE SEGUIDORES (PRO)
    const ultimo = data[data.length - 1].animalito;
    const seguidores = {};
    for (let i = 0; i < data.length - 1; i++) {
        if (data[i].animalito == ultimo) {
            const sgte = data[i + 1].animalito;
            seguidores[sgte] = (seguidores[sgte] || 0) + 1;
        }
    }
    const sugeridoSeguidor = Object.entries(seguidores).sort((a,b) => b[1]-a[1])[0];

    // 2. ANALISIS DE FAMILIA
    const famUltimo = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(ultimo)));
    
    // 3. PANTALLA DE BITÁCORA
    const bitacora = document.getElementById('bitacora-analisis');
    bitacora.innerHTML = `
        <span class="text-yellow-600">> ÚLTIMO REPORTE:</span> ${ultimo} (${famUltimo})<br>
        <span class="text-yellow-600">> TENDENCIA ACTUAL:</span> RACHA DE ${famUltimo}<br>
        <span class="text-yellow-600">> SEGUIDOR HISTÓRICO:</span> ${sugeridoSeguidor ? 'EL ' + sugeridoSeguidor[0] + ' SUELE SALIR DESPUÉS DEL ' + ultimo : 'DATOS INSUFICIENTES'}
    `;

    // 4. GRAFICOS
    const conteo = filtrados.reduce((acc, v) => { acc[v.animalito] = (acc[v.animalito] || 0) + 1; return acc; }, {});
    const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
    
    document.getElementById('pronostico-destacado').innerText = sorted.slice(0, 3).map(i => i[0]).join(' - ');

    const container = document.getElementById('graficos-porcentaje');
    container.innerHTML = "";
    sorted.slice(0, 8).forEach(([num, cant]) => {
        const porc = ((cant / filtrados.length) * 100).toFixed(1);
        const f = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(num))) || "DESCONOCIDO";
        container.innerHTML += `
            <div>
                <div class="flex justify-between text-[9px] font-black uppercase mb-1">
                    <span>${num} - <span class="opacity-50">${f}</span></span>
                    <span class="text-yellow-500">${porc}%</span>
                </div>
                <div class="bar-chart"><div class="bar-fill" style="width: ${porc}%"></div></div>
            </div>`;
    });
}
