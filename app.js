const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

// DICCIONARIO DE RAZAS (Aquí es donde rompemos el algoritmo)
const RAZAS = {
    "0": { n: "Delfín", f: "AGUA", c: "bg-blue-600" },
    "00": { n: "Ballena", f: "AGUA", c: "bg-blue-800" },
    "1": { n: "Carnero", f: "TIERRA", c: "bg-amber-900" },
    "14": { n: "Paloma", f: "AIRE", c: "bg-sky-400" },
    "75": { n: "Guácharo", f: "AIRE", c: "bg-sky-600" }
};

// FUNCIÓN PARA GUARDAR (Apunta a tu tabla real)
async function registrarSorteo() {
    const num = document.getElementById('num_input').value;
    const fec = document.getElementById('fec_input').value;
    const hor = document.getElementById('hor_input').value;

    if(!num || !fec) return alert("Faltan datos");

    const info = RAZAS[num] || { n: "Animal", f: "TIERRA", c: "bg-slate-700" };
    const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const diaNom = dias[new Date(fec + 'T00:00:00').getDay()];

    const { error } = await _supabase.from('control_guacharo').insert([{
        animalito: num, 
        nombre_animal: info.n,
        familia: info.f,
        fecha_sorteo: fec,
        hora_sorteo: hor + ":00",
        dia_semana: diaNom
    }]);

    if (!error) {
        alert("¡REGISTRADO EN CONTROL_GUACHARO!");
        cargarHistorial();
    }
}

// FUNCIÓN PARA VER EL EXCEL (Historial con colores)
async function cargarHistorial() {
    const { data } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(20);

    const tabla = document.getElementById('cuerpo-tabla');
    if (!tabla) return;

    tabla.innerHTML = data.map(r => `
        <tr class="border-b border-slate-800 text-[11px] bg-slate-900/30">
            <td class="p-3 font-black text-yellow-500 text-lg">${r.animalito}</td>
            <td class="p-3 font-bold">${r.dia_semana || ''}</td>
            <td class="p-3">
                <span class="px-2 py-1 rounded font-black ${r.familia === 'AGUA' ? 'bg-blue-600' : (r.familia === 'AIRE' ? 'bg-sky-400 text-black' : 'bg-amber-800')}">
                    ${r.familia || 'TIERRA'}
                </span>
            </td>
            <td class="p-3 text-slate-500">${r.hora_sorteo.substring(0,5)}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', cargarHistorial);
