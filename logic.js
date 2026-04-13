// CONFIGURACIÓN DE CONEXIÓN - DATOS DE TU TABLA
const SUPABASE_URL = 'https://jvbsalpnycnokynpsexw.supabase.co';
const SUPABASE_KEY = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DICCIONARIO CRCA COMPLETO
const DATA_ANIMALES = {
    "00": "BALLENA", "0": "DELFÍN", "1": "CARNERO", "2": "TORO", "3": "CIEMPIÉS",
    "4": "ALACRÁN", "5": "LEÓN", "6": "RANA", "7": "PERICO", "8": "RATÓN",
    "9": "ÁGUILA", "10": "TIGRE", "11": "GATO", "12": "CABALLO", "13": "MONO",
    "14": "PALOMA", "15": "ZORRO", "16": "OSO", "17": "PAVO", "18": "BURRO",
    "19": "CHIVO", "20": "COCHINO", "21": "GALLO", "22": "CAMELLO", "23": "CEBRA",
    "24": "IGUANA", "25": "GALLINA", "26": "VACA", "27": "PERRO", "28": "ZAMURO",
    "29": "ELEFANTE", "30": "CAIMÁN", "31": "LAPA", "32": "ARDILLA", "33": "PESCADO",
    "34": "VENADO", "35": "JIRAFA", "36": "CULEBRA", "37": "TORTUGA", "38": "MONO",
    "39": "ZORRO", "40": "AVISPA", "41": "CANGURO", "42": "TUCÁN", "43": "MARIPOSA",
    "44": "CHIGÜIRE", "45": "GARZA", "46": "PUMA", "47": "PAVO REAL", "48": "PUERCOESPÍN",
    "49": "PEREZA", "50": "CANARIO", "51": "PELÍCANO", "52": "PULPO", "53": "CARACOL",
    "54": "GRILLO", "55": "HORMIGA", "56": "TIBURÓN", "57": "PUERCOESPÍN", "58": "GATO",
    "59": "CHIVO", "60": "HIPOPÓTAMO", "61": "GACELA", "62": "GORILA", "63": "MAPACHE",
    "64": "CAMALEÓN", "65": "RINOCERONTE", "66": "OSO", "67": "BÚHO", "68": "TORTUGA",
    "69": "PÁJARO", "70": "PÁJARO", "71": "PÁJARO", "72": "PÁJARO", "73": "HIPOPÓTAMO",
    "74": "TURPIAL", "75": "GUÁCHARO"
};

async function cargarDatos() {
    console.log("Sincronizando con historial_resultados...");
    
    // Leemos la tabla historial_resultados
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('fecha, hora, numero, animal') // Nombres exactos de tu imagen
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });

    if (error) {
        console.error("Error de conexión:", error.message);
        return;
    }

    if (data) {
        console.log("Datos recibidos:", data.length);
        renderizarHistorial(data);
        motorAnalisis(data);
    }
}

function renderizarHistorial(data) {
    const tabla = document.getElementById('lista-historial');
    if (!tabla) return;

    // Limpiamos y llenamos con los datos de Supabase
    tabla.innerHTML = data.slice(0, 30).map(reg => `
        <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 8px;">${reg.fecha}</td>
            <td style="padding: 8px;"><b>${reg.hora}</b></td>
            <td style="padding: 8px; color: #fbbf24; font-weight: bold;">${reg.numero}</td>
            <td style="padding: 8px;">${reg.animal}</td>
        </tr>
    `).join('');
}

function motorAnalisis(data) {
    // Cálculo de Frecuencia para las Fijas
    const conteo = {};
    data.slice(0, 100).forEach(r => {
        conteo[r.numero] = (conteo[r.numero] || 0) + 1;
    });

    const ordenados = Object.keys(conteo).sort((a, b) => conteo[b] - conteo[a]);

    // Actualizar UI de predicciones
    if(document.getElementById('p1')) document.getElementById('p1').innerText = ordenados[0] || "--";
    if(document.getElementById('p2')) document.getElementById('p2').innerText = ordenados[1] || "--";
    if(document.getElementById('p3')) document.getElementById('p3').innerText = ordenados[2] || "--";

    // Radar del 75
    const radar = document.getElementById('guacharo-intel');
    const pos75 = data.findIndex(i => i.numero === "75");
    if (radar && pos75 !== -1) {
        radar.innerHTML = `El 75 (Guácharo) tiene <b>${pos75}</b> sorteos sin salir.`;
    }
}

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!DATA_ANIMALES[n] || !f) {
        alert("Por favor, ingresa fecha y número válido.");
        return;
    }

    // Insertar usando los nombres de columna de tu tabla
    const { error } = await _supabase.from('historial_resultados').insert([
        { 
            fecha: f, 
            hora: h, 
            numero: n, 
            animal: DATA_ANIMALES[n] // Aquí usamos 'animal' como en tu tabla
        }
    ]);

    if (!error) {
        document.getElementById('num').value = "";
        document.getElementById('status-msg').innerText = "¡Guardado!";
        cargarDatos(); // Recargar historial automáticamente
    } else {
        alert("Error al guardar: " + error.message);
    }
}
