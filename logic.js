// CONFIGURACIÓN DE CONEXIÓN
const SUPABASE_URL = 'https://jvbsalpnycnokynpsexw.supabase.co';
const SUPABASE_KEY = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const animales = {"00":"Ballena","0":"Delfín","1":"Carnero","2":"Toro","3":"Ciempiés","4":"Alacrán","5":"León","6":"Rana","7":"Perico","8":"Ratón","9":"Águila","10":"Tigre","11":"Gato","12":"Caballo","13":"Mono","14":"Paloma","15":"Zorro","16":"Oso","17":"Pavo","18":"Burro","19":"Chivo","20":"Cochino","21":"Gallo","22":"Camello","23":"Cebra","24":"Iguana","25":"Gallina","26":"Vaca","27":"Perro","28":"Zamuro","29":"Elefante","30":"Caimán","31":"Lapa","32":"Ardilla","33":"Pescado","34":"Venado","35":"Jirafa","36":"Culebra","37":"Tortuga","38":"Mono","39":"Zorro","40":"Avispa","41":"Canguro","42":"Tucán","43":"Mariposa","44":"Chigüire","45":"Garza","46":"Puma","47":"Pavo Real","48":"Puercoespín","49":"Pereza","50":"Canario","51":"Pelícano","52":"Pulpo","53":"Caracol","54":"Grillo","55":"Hormiga","56":"Tiburón","57":"Puercoespín","58":"Gato","59":"Chivo","60":"Hipopótamo","61":"Gacela","62":"Gorila","63":"Mapache","64":"Camaleón","65":"Rinoceronte","66":"Oso","67":"Búho","68":"Tortuga","69":"Pájaro","70":"Pájaro","71":"Pájaro","72":"Pájaro","73":"Hipopótamo","74":"Turpial","75":"Guácharo"};

// Reloj en tiempo real
setInterval(() => {
    const clock = document.getElementById('live-clock');
    if(clock) clock.innerText = new Date().toLocaleTimeString();
}, 1000);

async function cargarDatos() {
    // 1. Llamada a la tabla exacta de tu imagen
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('fecha, hora, numero, animal') 
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });

    if (error) {
        console.error("Error cargando datos:", error.message);
        return;
    }

    if (data) {
        // 2. Pintar los resultados en el historial
        const lista = document.getElementById('lista-historial');
        if (lista) {
            lista.innerHTML = data.slice(0, 20).map(i => `
                <tr>
                    <td>${i.fecha}</td>
                    <td><b>${i.hora}</b></td>
                    <td style="color:var(--accent-gold); font-weight:bold;">${i.numero}</td>
                    <td>${i.animal}</td>
                </tr>
            `).join('');
        }

        // 3. Ejecutar análisis para predicciones
        analizarAlgoritmo(data);
    }
}

function analizarAlgoritmo(data) {
    // Frecuencia
    const counts = {};
    data.slice(0, 100).forEach(r => counts[r.numero] = (counts[r.numero] || 0) + 1);
    const sorted = Object.keys(counts).sort((a,b) => counts[b] - counts[a]);

    // Actualizar FIJAS
    if(document.getElementById('p1')) document.getElementById('p1').innerText = sorted[0] || "--";
    if(document.getElementById('p2')) document.getElementById('p2').innerText = sorted[1] || "--";
    if(document.getElementById('p3')) document.getElementById('p3').innerText = sorted[2] || "--";

    // Radar 75
    const radar = document.getElementById('guacharo-intel');
    const pos75 = data.findIndex(i => i.numero === "75");
    if (radar && pos75 !== -1) {
        radar.innerHTML = `Radar 🦅: El 75 tiene <b>${pos75}</b> sorteos sin salir.`;
    }
}

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!animales[n] || !f) { alert("Dato inválido"); return; }

    // Guardar con los nombres de columna de tu tabla
    const { error } = await _supabase.from('historial_resultados').insert([
        { fecha: f, hora: h, numero: n, animal: animales[n] }
    ]);

    if (!error) {
        document.getElementById('num').value = "";
        document.getElementById('status-msg').innerText = "✔ Sincronizado";
        cargarDatos();
    }
}

// Iniciar al cargar
window.onload = () => {
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    cargarDatos();
};
