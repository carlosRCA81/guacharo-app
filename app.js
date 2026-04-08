// Configuración Blindada de Supabase
const SUPABASE_URL = 'https://z3ze6gkwckh91s9ybnacqa.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC'; 

// Diccionario Maestro CRCA (Basado en imagen 51372)
const animales = {
    "00": "Ballena", "0": "Delfín", "01": "Carnero", "02": "Toro", "03": "Ciempiés",
    "04": "Alacrán", "05": "León", "06": "Rana", "07": "Perico", "08": "Ratón",
    "09": "Águila", "10": "Tigre", "11": "Gato", "12": "Caballo", "13": "Mono",
    "14": "Paloma", "15": "Zorro", "16": "Oso", "17": "Pavo", "18": "Burro",
    "19": "Chivo", "20": "Cochino", "21": "Gallo", "22": "Camello", "23": "Cebra",
    "24": "Iguana", "25": "Gallina", "26": "Vaca", "27": "Perro", "28": "Zamuro",
    "29": "Elefante", "30": "Caimán", "31": "Lapa", "32": "Ardilla", "33": "Pescado",
    "34": "Venado", "35": "Jirafa", "36": "Culebra", "37": "Tortuga", "38": "Búfalo",
    "39": "Lechuza", "40": "Avispa", "41": "Canguro", "42": "Tucán", "43": "Mariposa",
    "44": "Chigüire", "45": "Garza", "46": "Puma", "47": "Pavo Real", "48": "Puercoespín",
    "49": "Pereza", "50": "Canario", "51": "Pantera", "52": "Pulpo", "53": "Caracol",
    "54": "Grillo", "55": "Ardilla", "56": "Oso Frontino", "57": "Gato", "58": "Tucán",
    "59": "Chivo", "60": "Cascabelear", "61": "Panda", "62": "Cachicamo", "63": "Cangrejo",
    "64": "Gavilán", "65": "Araña", "66": "Lobo", "67": "Avestruz", "68": "Jaguar",
    "69": "Conejo", "70": "Bisonte", "71": "Guacamaya", "72": "Gorila", "73": "Hipopótamo",
    "74": "Turpial", "75": "GUÁCHARO"
};

// Función para cambiar de ventana (Tabs)
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active-tab');
    
    if(tabId === 'estudio' || tabId === 'radar') cargarDatos();
}

// Guardar en la Base de Datos
async function guardarResultado() {
    const fecha = document.getElementById('fecha_registro').value;
    const hora = document.getElementById('hora').value;
    const num = document.getElementById('numero').value.padStart(2, '0').replace('000', '00');
    
    if(!fecha || !num || !animales[num]) {
        alert("Número o fecha inválida");
        return;
    }

    const animal = animales[num];

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/resultados`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ fecha, hora, numero: num, animal })
        });

        if (response.ok) {
            alert(`Registrado: ${num} - ${animal}`);
            document.getElementById('numero').value = '';
            cargarDatos(); // Refrescar vista
        } else {
            alert("Error al conectar con el cerebro");
        }
    } catch (err) {
        console.error(err);
    }
}

// Cargar y mostrar datos en las tablas
async function cargarDatos() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/resultados?order=fecha.desc,hora.desc&limit=10`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const datos = await response.json();
        
        const tabla = document.getElementById('tabla-hoy');
        tabla.innerHTML = '';
        
        datos.forEach(item => {
            tabla.innerHTML += `
                <tr class="border-b border-slate-800">
                    <td class="p-2 text-slate-400 font-bold">${item.hora}</td>
                    <td class="p-2 text-center text-white font-black">${item.numero}</td>
                    <td class="p-2 text-right text-blue-400 italic">${item.animal}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Error cargando historial");
    }
}

// Inicializar fecha de hoy
document.getElementById('fecha_registro').valueAsDate = new Date();
cargarDatos();
