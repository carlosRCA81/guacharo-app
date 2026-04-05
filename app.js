const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

// EL CEREBRO: Mapeo de Razas (Ajusta los que faltan aquí)
const RAZAS = {
    "0": { n: "Delfín", f: "AGUA" },
    "00": { n: "Ballena", f: "AGUA" },
    "1": { n: "Carnero", f: "TIERRA" },
    "14": { n: "Paloma", f: "AIRE" },
    "75": { n: "Guácharo", f: "AIRE" }
};

// FUNCIÓN PARA GUARDAR EN TU TABLA REAL
async function registrarSorteo() {
    const num = document.getElementById('num_input').value; // ID de tu input de número
    const fec = document.getElementById('fec_input').value; // ID de tu input de fecha
    const hor = document.getElementById('hor_input').value; // ID de tu select de hora

    const info = RAZAS[num] || { n: "Animal", f: "TIERRA" };
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
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
        alert("¡REGISTRO EXITOSO EN CONTROL_GUACHARO!");
        location.reload();
    } else {
        console.log(error);
    }
}

// FUNCIÓN PARA QUE LA WEB MUESTRE LOS DATOS (MATRIZ)
async function cargarDatos() {
    const { data } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false });

    if (data) {
        const tabla = document.getElementById('cuerpo-tabla'); // El ID de tu <tbody>
        tabla.innerHTML = data.map(r => `
            <tr class="border-b border-slate-800 text-[10px]">
                <td class="p-2 font-black text-yellow-500">${r.animalito}</td>
                <td class="p-2">${r.nombre_animal || '---'}</td>
                <td class="p-2 uppercase font-bold">${r.dia_semana || '---'}</td>
                <td class="p-2"><span class="px-2 py-0.5 rounded ${r.familia === 'AGUA' ? 'bg-blue-600' : 'bg-amber-700'}">${r.familia || 'TIERRA'}</span></td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', cargarDatos);
