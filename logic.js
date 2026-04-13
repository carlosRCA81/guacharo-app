// CREDENCIALES ORIGINALES - NO TOCAR
const supabaseUrl = 'https://jvbsalpnycnokynpsexw.supabase.co';
const supabaseKey = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const animales = { "00": "Ballena", "0": "Delfín", "1": "Carnero", "2": "Toro", "3": "Ciempiés", "4": "Alacrán", "5": "León", "6": "Rana", "7": "Perico", "8": "Ratón", "9": "Águila", "10": "Tigre", "11": "Gato", "12": "Caballo", "13": "Mono", "14": "Paloma", "15": "Zorro", "16": "Oso", "17": "Pavo", "18": "Burro", "19": "Chivo", "20": "Cochino", "21": "Gallo", "22": "Camello", "23": "Cebra", "24": "Iguana", "25": "Gallina", "26": "Vaca", "27": "Perro", "28": "Zamuro", "29": "Elefante", "30": "Caimán", "31": "Lapa", "32": "Ardilla", "33": "Pescado", "34": "Venado", "35": "Jirafa", "36": "Culebra", "37": "Tortuga", "38": "Mono", "39": "Zorro", "40": "Avispa", "41": "Canguro", "42": "Tucán", "43": "Mariposa", "44": "Chigüire", "45": "Garza", "46": "Puma", "47": "Pavo Real", "48": "Puercoespín", "49": "Pereza", "50": "Canario", "51": "Pelícano", "52": "Pulpo", "53": "Caracol", "54": "Grillo", "55": "Hormiga", "56": "Tiburón", "57": "Puercoespín", "58": "Gato", "59": "Chivo", "60": "Hipopótamo", "61": "Gacela", "62": "Gorila", "63": "Mapache", "64": "Camaleón", "65": "Rinoceronte", "66": "Oso", "67": "Búho", "68": "Tortuga", "69": "Pájaro", "70": "Pájaro", "71": "Pájaro", "72": "Pájaro", "73": "Hipopótamo", "74": "Turpial", "75": "Guácharo" };

// RELOJ DIGITAL
setInterval(() => { 
    const c = document.getElementById('live-clock');
    if(c) c.innerText = new Date().toLocaleTimeString(); 
}, 1000);

// CARGA DE DATOS E INTELIGENCIA
async function cargarDatos() {
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        renderHistorial(data);
        motorAlgoritmo(data);
        radarGuacharo(data);
    }
}

function renderHistorial(data) {
    const lista = document.getElementById('lista-historial');
    if(!lista) return;
    lista.innerHTML = data.slice(0, 10).map(i => `
        <tr>
            <td><b>${i.hora}</b></td>
            <td style="color:#fbbf24; font-weight:bold;">${i.numero}</td>
            <td>${i.nombre_animal}</td>
            <td style="font-size:0.65rem; color:#94a3b8;">${i.fecha}</td>
        </tr>
    `).join('');
}

// MOTOR DE PREDICCIÓN (Algoritmo de Frecuencia y Ciclos)
function motorAlgoritmo(data) {
    const freq = {};
    // Analizar solo los últimos 60 sorteos para detectar calor actual
    data.slice(0, 60).forEach(r => {
        freq[r.numero] = (freq[r.numero] || 0) + 1;
    });

    // Ordenar números por frecuencia
    const sugeridos = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

    // Mostrar las 3 Fijas
    document.getElementById('p1').innerText = sugeridos[0] || "??";
    document.getElementById('p2').innerText = sugeridos[1] || "??";
    document.getElementById('p3').innerText = sugeridos[2] || "??";
}

// ESTUDIO ESPECÍFICO DEL 75 (EL GUÁCHARO)
function radarGuacharo(data) {
    const intel = document.getElementById('guacharo-intel');
    const pos = data.findIndex(i => i.numero === "75");
    
    if (pos === -1) {
        intel.innerHTML = "📡 Guácharo: Sin registros recientes.";
    } else {
        // Encontrar el animal que salió justo antes del Guácharo la última vez
        const anunciante = data[pos + 1] ? `${data[pos + 1].numero} (${data[pos + 1].nombre_animal})` : "Desconocido";
        intel.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <span>🦅 Atraso Guácharo: <b>${pos} sorteos</b></span>
                <span>📡 Anunciante: <b>${anunciante}</b></span>
            </div>
        `;
    }
}

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!animales[n] || !f) return alert("Verifica el número y la fecha");

    const { error } = await _supabase.from('historial_resultados').insert([
        { fecha: f, hora: h, numero: n, nombre_animal: animales[n] }
    ]);

    if (!error) {
        document.getElementById('status-msg').innerText = "✔ Sincronizado correctamente";
        document.getElementById('num').value = "";
        cargarDatos();
        setTimeout(() => document.getElementById('status-msg').innerText = "", 3000);
    } else {
        alert("Error de conexión con Supabase");
    }
}

// INICIALIZACIÓN
window.onload = () => {
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    cargarDatos();
};
