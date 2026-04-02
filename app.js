// CONEXIÓN SUPABASE
const SUPABASE_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DICCIONARIO MAESTRO CORREGIDO (00-75)
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

// GUARDAR
async function guardarResultado() {
    const animal = document.getElementById('animalito').value.trim();
    const hora = document.getElementById('hora').value;

    if (!animal || !hora) {
        alert("Faltan datos");
        return;
    }

    const { error } = await _supabase
        .from('control_guacharo')
        .insert([{ 
            animalito: animal, 
            hora_sorteo: hora,
            fecha_sorteo: new Date().toISOString().split('T')[0]
        }]);

    if (error) { alert("Error: " + error.message); }
    else {
        alert("¡Anotado! 🦜");
        document.getElementById('animalito').value = "";
        cargarResultados();
    }
}

// CARGAR LISTA
async function cargarResultados() {
    const lista = document.getElementById('lista-resultados');
    const { data, error } = await _supabase
        .from('control_guacharo')
        .select('*')
        .order('id', { ascending: false })
        .limit(10);

    if (error) { lista.innerHTML = "Error de conexión"; return; }

    lista.innerHTML = "<h3 class='text-yellow-500 font-bold mb-3'>Últimos sorteos:</h3>";
    data.forEach(res => {
        lista.innerHTML += `
            <div class="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-600 flex justify-between items-center">
                <span class="font-bold uppercase text-sm">${res.animalito}</span>
                <div class="text-right text-xs">
                    <span class="text-gray-300 block">${res.hora_sorteo}</span>
                    <span class="text-gray-500">${res.fecha_sorteo}</span>
                </div>
            </div>`;
    });
}

// ALGORITMO MODO ANALISTA (7 DÍAS)
async function ejecutarAnalisis() {
    const grid = document.getElementById('grid-analisis');
    const seccion = document.getElementById('seccion-analisis');
    seccion.classList.remove('hidden');
    grid.innerHTML = "<p class='col-span-2 text-center text-blue-300'>Analizando tendencia semanal...</p>";

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
        let texto = "Frecuencia: " + veces;

        if (veces >= 3) {
            bg = "bg-red-900 caliente";
            extra = "🔥 REPETIDO";
        } else if (veces === 0) {
            bg = "bg-blue-900";
            extra = "❄️ POR SALIR";
        }

        grid.innerHTML += `
            <div class="${bg} p-2 rounded border border-gray-700 text-center transition-all">
                <div class="text-yellow-500 font-bold text-lg">${num}</div>
                <div class="text-[10px] uppercase font-semibold text-white">${RULETA[num]}</div>
                <div class="text-[9px] text-gray-400">${texto}</div>
                <div class="text-[9px] font-black text-white mt-1">${extra}</div>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', cargarResultados);
