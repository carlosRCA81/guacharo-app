// ==========================================
// CONFIGURACIÓN Y LLAVES BLINDADAS
// ==========================================
const URL = 'https://z3ze6gkwckh91s9ybnacqa.supabase.co/rest/v1/resultados';
const KEY = 'sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC';

// ==========================================
// DICCIONARIO OFICIAL (VERIFICADO 100%)
// ==========================================
const ANIMALES = {
    "00": "Ballena", "0": "Delfín", "01": "Carnero", "02": "Toro", "03": "Ciempiés", "04": "Alacrán",
    "05": "León", "06": "Rana", "07": "Perico", "08": "Ratón", "09": "Águila", "10": "Tigre",
    "11": "Gato", "12": "Caballo", "13": "Mono", "14": "Paloma", "15": "Zorro", "16": "Oso",
    "17": "Pavo", "18": "Burro", "19": "Chivo", "20": "Cochino", "21": "Gallo", "22": "Camello",
    "23": "Cebra", "24": "Iguana", "25": "Gallina", "26": "Vaca", "27": "Perro", "28": "Zamuro",
    "29": "Elefante", "30": "Caimán", "31": "Lapa", "32": "Ardilla", "33": "Pescado", "34": "Venado",
    "35": "Jirafa", "36": "Culebra", "37": "Tortuga", "38": "Búfalo", "39": "Lechuza", "40": "Avispa",
    "41": "Canguro", "42": "Tucán", "43": "Mariposa", "44": "Chigüire", "45": "Garza", "46": "Puma",
    "47": "Pavo Real", "48": "Puercoespín", "49": "Pereza", "50": "Canario", "51": "Pelícano", "52": "Pulpo",
    "53": "Caracol", "54": "Grillo", "55": "Araña", "56": "Lobo", "57": "Avestruz", "58": "Jaguar",
    "59": "Conejo", "60": "Bisonte", "61": "Panda", "62": "Cachicamo", "63": "Cangrejo", "64": "Gavilán",
    "65": "Oso Hormiguero", "66": "Tiburón", "67": "Jaguar", "68": "Conejo", "69": "Grillo", "70": "Bisonte",
    "71": "Guacamaya", "72": "Gorila", "73": "Hipopótamo", "74": "Turpial", "75": "Guácharo"
};

// ==========================================
// SISTEMA DE NAVEGACIÓN (TABS)
// ==========================================
function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
    
    document.getElementById(id).classList.add('active');
    document.getElementById('btn-' + id).classList.add('active-tab');
    
    // Al cambiar de pestaña, refrescar datos
    if (id !== 'anotar') cargarDatos();
}

// ==========================================
// MOTOR DE GUARDADO
// ==========================================
async function guardarDato() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const numRaw = document.getElementById('numero').value.trim();
    
    // Normalizar formato (0, 00, o 01-75)
    let num = (numRaw === "0" || numRaw === "00") ? numRaw : numRaw.padStart(2, '0');

    if (!ANIMALES[num]) {
        alert("Número no existe en el tablero de Guácharo Activo");
        return;
    }

    try {
        const res = await fetch(URL, {
            method: 'POST',
            headers: { 
                'apikey': KEY, 
                'Authorization': `Bearer ${KEY}`, 
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' 
            },
            body: JSON.stringify({ fecha, hora, numero: num, animal: ANIMALES[num] })
        });

        if (res.ok) {
            alert(`Anotado con éxito: ${num} - ${ANIMALES[num]}`);
            document.getElementById('numero').value = '';
            cargarDatos();
        } else {
            alert("Error de conexión con el servidor");
        }
    } catch (e) {
        alert("Falla crítica de red");
    }
}

// ==========================================
// CARGA Y ANÁLISIS DE ALGORITMO
// ==========================================
async function cargarDatos() {
    try {
        const res = await fetch(`${URL}?order=fecha.desc,hora.desc&limit=50`, {
            headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
        });
        const datos = await res.json();
        
        actualizarHistorial(datos);
        analizarRadar75(datos);
    } catch (e) {
        console.error("Error al sincronizar datos");
    }
}

function actualizarHistorial(datos) {
    const tbody = document.getElementById('lista-historial');
    if (!tbody) return;

    tbody.innerHTML = datos.map(d => `
        <tr class="border-b border-slate-800">
            <td class="p-3 text-slate-500 font-bold">${d.hora}</td>
            <td class="p-3 font-black text-white text-lg">${d.numero}</td>
            <td class="p-3 text-blue-400 italic font-medium">${d.animal}</td>
        </tr>
    `).join('');
}

// ==========================================
// RADAR DE INTELIGENCIA 75
// ==========================================
function analizarRadar75(datos) {
    const radarContainer = document.getElementById('estudio-75');
    if (!radarContainer) return;

    // Filtrar apariciones del 75
    const apariciones75 = datos.filter(d => d.numero === "75");
    
    if (apariciones75.length === 0) {
        radarContainer.innerHTML = `
            <div class="text-center p-10 text-slate-600">
                <i class="fas fa-search text-3xl mb-2"></i>
                <p class="text-xs">No hay datos del 75 en los últimos 50 sorteos.</p>
            </div>`;
        return;
    }

    let html = `<h3 class="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Movimientos Detectados</h3>`;
    
    datos.forEach((d, i) => {
        if (d.numero === "75") {
            // El que salió antes (en el tiempo es el siguiente en la lista desc)
            const antes = datos[i + 1] ? `${datos[i+1].numero} (${datos[i+1].animal})` : "---";
            // El que salió después (en el tiempo es el anterior en la lista desc)
            const despues = datos[i - 1] ? `${datos[i-1].numero} (${datos[i-1].animal})` : "---";

            html += `
                <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-3 border-l-4 border-l-yellow-600 shadow-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded font-bold">${d.fecha}</span>
                        <span class="text-white font-black">${d.hora}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-2 bg-slate-900 rounded">
                            <p class="text-[9px] text-slate-500 uppercase font-bold">Llamador (Antes)</p>
                            <p class="text-green-400 font-bold text-xs">${antes}</p>
                        </div>
                        <div class="text-center p-2 bg-slate-900 rounded">
                            <p class="text-[9px] text-slate-500 uppercase font-bold">Seguidor (Después)</p>
                            <p class="text-red-400 font-bold text-xs">${despues}</p>
                        </div>
                    </div>
                </div>`;
        }
    });

    radarContainer.innerHTML = html;
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_registro').valueAsDate = new Date();
    cargarDatos();
});
