const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const RULETA = {
    "00": "Ballena", "0": "Delfín", "1": "Carnero", "2": "Toro", "3": "Ciempiés", "4": "Alacrán", "5": "León",
    "6": "Rana", "7": "Perico", "8": "Ratón", "9": "Águila", "10": "Tigre", "11": "Gato", "12": "Caballo",
    "13": "Mono", "14": "Paloma", "15": "Zorro", "16": "Oso", "17": "Pavo", "18": "Burro", "19": "Chivo",
    "20": "Cochino", "21": "Gallo", "22": "Camello", "23": "Cebra", "24": "Iguana", "25": "Gallina",
    "26": "Vaca", "27": "Perro", "28": "Zamuro", "29": "Elefante", "30": "Caimán", "31": "Lapa",
    "32": "Ardilla", "33": "Pescado", "34": "Venado", "35": "Jirafa", "36": "Culebra", "37": "Tortuga",
    "38": "Lechuza", "39": "Avispa", "40": "Canguro", "41": "Tucán", "42": "Mariposa", "43": "Chigüire",
    "44": "Garza", "45": "Puma", "46": "Pavo Real", "47": "Puercoespín", "48": "Pereza", "49": "Pereza",
    "50": "Canario", "51": "Pelícano", "52": "Pulpo", "53": "Caracol", "54": "Grillo", "55": "Oso Hormiguero",
    "56": "Tiburón", "57": "Pavo Real", "58": "Hormiga", "59": "Pantera", "60": "Camaleón", "61": "Panda",
    "62": "Cachicamo", "63": "Cangrejo", "64": "Gavilán", "65": "Araña", "66": "Lobo", "67": "Avestruz",
    "68": "Jaguar", "69": "Conejo", "70": "Bisonte", "71": "Guacamaya", "72": "Gorila", "73": "Hipopótamo",
    "74": "Turpial", "75": "GUÁCHARO"
};

function establecerFechaHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_manual').value = hoy;
}

async function guardarResultado() {
    const id = document.getElementById('edit-id').value;
    const animal = document.getElementById('animalito').value.trim();
    const fecha = document.getElementById('fecha_manual').value;
    const hora = document.getElementById('hora').value;

    if (!animal || !fecha || !hora) { alert("Faltan datos"); return; }

    let response;
    if (id) {
        // MODO EDITAR
        response = await _supabase
            .from('control_guacharo')
            .update({ animalito: animal, hora_sorteo: hora, fecha_sorteo: fecha })
            .eq('id', id);
    } else {
        // MODO NUEVO
        response = await _supabase
            .from('control_guacharo')
            .insert([{ animalito: animal, hora_sorteo: hora, fecha_sorteo: fecha }]);
    }

    if (response.error) { 
        alert("Error: " + response.error.message); 
    } else {
        cancelarEdicion();
        cargarResultados();
    }
}

function prepararEdicion(id, animal, fecha, hora) {
    document.getElementById('edit-id').value = id;
    document.getElementById('animalito').value = animal;
    document.getElementById('fecha_manual').value = fecha;
    document.getElementById('hora').value = hora;
    
    document.getElementById('titulo-form').innerText = "✏️ EDITANDO REGISTRO";
    document.getElementById('btn-guardar').innerText = "✅ ACTUALIZAR AHORA";
    document.getElementById('btn-cancelar').classList.remove('hidden');
    window.scrollTo(0,0);
}

function cancelarEdicion() {
    document.getElementById('edit-id').value = "";
    document.getElementById('animalito').value = "";
    establecerFechaHoy();
    document.getElementById('hora').value = "";
    
    document.getElementById('titulo-form').innerText = "ANOTAR RESULTADO";
    document.getElementById('btn-guardar').innerText = "💾 GUARDAR RESULTADO";
    document.getElementById('btn-cancelar').classList.add('hidden');
}

async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

    if (error) return;

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-3 text-sm'>Últimos sorteos registrados:</h3>";
    data.forEach(res => {
        lista.innerHTML += `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 flex justify-between items-center mb-2 shadow">
                <div class="flex items-center gap-3">
                    <button onclick="prepararEdicion('${res.id}', '${res.animalito}', '${res.fecha_sorteo}', '${res.hora_sorteo}')" class="bg-blue-900/30 p-2 rounded-full active:bg-blue-600 transition-colors">
                        📝
                    </button>
                    <span class="font-bold uppercase text-sm text-white">${res.animalito}</span>
                </div>
                <div class="text-right text-[10px]">
                    <span class="text-gray-300 block font-bold">${res.hora_sorteo}</span>
                    <span class="text-gray-500 italic">${res.fecha_sorteo}</span>
                </div>
            </div>`;
    });
}

async function ejecutarAnalisis() {
    const grid = document.getElementById('grid-analisis');
    const seccion = document.getElementById('seccion-analisis');
    seccion.classList.remove('hidden');
    grid.innerHTML = "<p class='col-span-2 text-center text-blue-300 text-xs'>Calculando algoritmo...</p>";

    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
    const fechaLimite = sieteDiasAtras.toISOString().split('T')[0];

    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('animalito')
        .gte('fecha_sorteo', fechaLimite);

    if (error) return;

    const conteo = {};
    data.forEach(item => {
        const nombre = item.animalito.toLowerCase();
        conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    grid.innerHTML = "";
    Object.keys(RULETA).forEach(num => {
        const nombre = RULETA[num].toLowerCase();
        const veces = conteo[nombre] || 0;
        
        let bg = "bg-gray-800";
        let extra = "";
        if (veces >= 3) { bg = "bg-red-900/80 caliente"; extra = "🔥 CALIENTE"; }
        else if (veces === 0) { bg = "bg-blue-900/40"; extra = "❄️ FRÍO"; }

        grid.innerHTML += `
            <div class="${bg} p-2 rounded border border-gray-700 text-center shadow-inner">
                <div class="text-yellow-500 font-black text-lg leading-none">${num}</div>
                <div class="text-[8px] uppercase font-bold text-white truncate mb-1">${RULETA[num]}</div>
                <div class="text-[7px] text-gray-400 font-mono">VISTO: ${veces}</div>
                <div class="text-[8px] font-black text-white mt-1 tracking-tighter">${extra}</div>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    establecerFechaHoy();
    cargarResultados();
});
