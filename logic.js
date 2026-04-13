// ==========================================
// CONFIGURACIÓN SUPABASE - CONEXIÓN REAL
// ==========================================
const SUPABASE_URL = 'https://jvbsalpnycnokynpsexw.supabase.co';
const SUPABASE_KEY = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DICCIONARIO MAESTRO CRCA (00-75)
const DATA_GUACHARO = {
    "00":{a:"BALLENA",t:"AGUA"}, "0":{a:"DELFÍN",t:"AGUA"}, "1":{a:"CARNERO",t:"TIERRA"}, "2":{a:"TORO",t:"TIERRA"}, "3":{a:"CIEMPIÉS",t:"TIERRA"}, "4":{a:"ALACRÁN",t:"TIERRA"}, "5":{a:"LEÓN",t:"TIERRA"}, "6":{a:"RANA",t:"AGUA"}, "7":{a:"PERICO",t:"AIRE"}, "8":{a:"RATÓN",t:"TIERRA"}, "9":{a:"ÁGUILA",t:"AIRE"}, "10":{a:"TIGRE",t:"TIERRA"}, "11":{a:"GATO",t:"TIERRA"}, "12":{a:"CABALLO",t:"TIERRA"}, "13":{a:"MONO",t:"TIERRA"}, "14":{a:"PALOMA",t:"AIRE"}, "15":{a:"ZORRO",t:"TIERRA"}, "16":{a:"OSO",t:"TIERRA"}, "17":{a:"PAVO",t:"AIRE"}, "18":{a:"BURRO",t:"TIERRA"}, "19":{a:"CHIVO",t:"TIERRA"}, "20":{a:"COCHINO",t:"TIERRA"}, "21":{a:"GALLO",t:"AIRE"}, "22":{a:"CAMELLO",t:"TIERRA"}, "23":{a:"CEBRA",t:"TIERRA"}, "24":{a:"IGUANA",t:"TIERRA"}, "25":{a:"GALLINA",t:"AIRE"}, "26":{a:"VACA",t:"TIERRA"}, "27":{a:"PERRO",t:"TIERRA"}, "28":{a:"ZAMURO",t:"AIRE"}, "29":{a:"ELEFANTE",t:"TIERRA"}, "30":{a:"CAIMÁN",t:"AGUA"}, "31":{a:"LAPA",t:"TIERRA"}, "32":{a:"ARDILLA",t:"TIERRA"}, "33":{a:"PESCADO",t:"AGUA"}, "34":{a:"VENADO",t:"TIERRA"}, "35":{a:"JIRAFA",t:"TIERRA"}, "36":{a:"CULEBRA",t:"TIERRA"}, "37":{a:"TORTUGA",t:"AGUA"}, "38":{a:"MONO",t:"TIERRA"}, "39":{a:"ZORRO",t:"TIERRA"}, "40":{a:"AVISPA",t:"AIRE"}, "41":{a:"CANGURO",t:"TIERRA"}, "42":{a:"TUCÁN",t:"AIRE"}, "43":{a:"MARIPOSA",t:"AIRE"}, "44":{a:"CHIGÜIRE",t:"TIERRA"}, "45":{a:"GARZA",t:"AIRE"}, "46":{a:"PUMA",t:"TIERRA"}, "47":{a:"PAVO REAL",t:"AIRE"}, "48":{a:"PUERCOESPÍN",t:"TIERRA"}, "49":{a:"PEREZA",t:"TIERRA"}, "50":{a:"CANARIO",t:"AIRE"}, "51":{a:"PELÍCANO",t:"AIRE"}, "52":{a:"PULPO",t:"AGUA"}, "53":{a:"CARACOL",t:"AGUA"}, "54":{a:"GRILLO",t:"TIERRA"}, "55":{a:"HORMIGA",t:"TIERRA"}, "56":{a:"TIBURÓN",t:"AGUA"}, "57":{a:"PUERCOESPÍN",t:"TIERRA"}, "58":{a:"GATO",t:"TIERRA"}, "59":{a:"CHIVO",t:"TIERRA"}, "60":{a:"HIPOPÓTAMO",t:"AGUA"}, "61":{a:"GACELA",t:"TIERRA"}, "62":{a:"GORILA",t:"TIERRA"}, "63":{a:"MAPACHE",t:"TIERRA"}, "64":{a:"CAMALEÓN",t:"TIERRA"}, "65":{a:"RINOCERONTE",t:"TIERRA"}, "66":{a:"OSO",t:"TIERRA"}, "67":{a:"BÚHO",t:"AIRE"}, "68":{a:"TORTUGA",t:"AGUA"}, "69":{a:"PÁJARO",t:"AIRE"}, "70":{a:"PÁJARO",t:"AIRE"}, "71":{a:"PÁJARO",t:"AIRE"}, "72":{a:"PÁJARO",t:"AIRE"}, "73":{a:"HIPOPÓTAMO",t:"AGUA"}, "74":{a:"TURPIAL",t:"AIRE"}, "75":{a:"GUÁCHARO",t:"AIRE"}
};

let baseDeDatos = [];

// ==========================================
// FUNCIÓN PRINCIPAL DE CARGA (DESDE ENERO)
// ==========================================
async function cargarDatos() {
    console.log("Conectando con historial_resultados...");
    const { data, error } = await _supabase
        .from('historial_resultados')
        .select('fecha, hora, numero, animal')
        .order('fecha', { ascending: false })
        .order('hora', { ascending: false });

    if (error) {
        console.error("Error Supabase:", error.message);
        return;
    }

    if (data) {
        baseDeDatos = data;
        actualizarTodo();
    }
}

function actualizarTodo() {
    renderHistorial();
    motorPrediccion();
    analizarDormidos();
    estudiar75();
}

// 1. DIBUJAR TABLA DE RESULTADOS
function renderHistorial() {
    const lista = document.getElementById('lista-historial');
    if (!lista) return;

    lista.innerHTML = baseDeDatos.slice(0, 50).map(i => `
        <tr>
            <td>${i.fecha}</td>
            <td><b>${i.hora}</b></td>
            <td style="color:#fbbf24; font-weight:bold;">${i.numero}</td>
            <td>${i.animal}</td>
            <td><small>${DATA_GUACHARO[i.numero] ? DATA_GUACHARO[i.numero].t : '---'}</small></td>
        </tr>
    `).join('');
}

// 2. MOTOR DE PREDICCIÓN (LAS 3 FIJAS)
function motorPrediccion() {
    const freq = {};
    // Analizamos los últimos 100 para ver tendencias
    baseDeDatos.slice(0, 100).forEach(r => {
        freq[r.numero] = (freq[r.numero] || 0) + 1;
    });

    const sugeridos = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);

    if(document.getElementById('p1')) document.getElementById('p1').innerText = sugeridos[0] || "--";
    if(document.getElementById('p2')) document.getElementById('p2').innerText = sugeridos[1] || "--";
    if(document.getElementById('p3')) document.getElementById('p3').innerText = sugeridos[2] || "--";
}

// 3. ANIMALES DORMIDOS (MÁS ATRASADOS)
function analizarDormidos() {
    const dormidosDiv = document.getElementById('lista-dormidos');
    if (!dormidosDiv) return;

    const todosLosNumeros = Object.keys(DATA_GUACHARO);
    let atrasos = [];

    todosLosNumeros.forEach(num => {
        const index = baseDeDatos.findIndex(r => r.numero === num);
        atrasos.push({ num: num, animal: DATA_GUACHARO[num].a, gap: index === -1 ? 999 : index });
    });

    // Ordenar por el que tiene más tiempo sin salir
    atrasos.sort((a, b) => b.gap - a.gap);

    dormidosDiv.innerHTML = atrasos.slice(0, 5).map(d => 
        `<div>${d.num} - ${d.animal} (Atraso: ${d.gap})</div>`
    ).join('');
}

// 4. RADAR ESPECÍFICO DEL 75
function estudiar75() {
    const radar = document.getElementById('guacharo-intel');
    if (!radar) return;

    const pos = baseDeDatos.findIndex(i => i.numero === "75");
    if (pos !== -1) {
        const previo = baseDeDatos[pos + 1] ? baseDeDatos[pos + 1].numero : "---";
        radar.innerHTML = `🦅 Guácharo (75) atrasado: <b>${pos}</b> sorteos. Último anunciante: <b>${previo}</b>`;
    }
}

// 5. GUARDAR NUEVO DATO
async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!DATA_GUACHARO[n] || !f) {
        alert("Número o fecha no válida.");
        return;
    }

    const { error } = await _supabase.from('historial_resultados').insert([
        { 
            fecha: f, 
            hora: h, 
            numero: n, 
            animal: DATA_GUACHARO[n].a 
        }
    ]);

    if (!error) {
        document.getElementById('num').value = "";
        document.getElementById('status-msg').innerText = "✔ Sincronizado";
        cargarDatos();
        setTimeout(() => document.getElementById('status-msg').innerText = "", 3000);
    } else {
        alert("Error de red: " + error.message);
    }
}

// INICIALIZACIÓN POR DEFECTO
window.onload = () => {
    if(document.getElementById('fecha')) {
        document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    }
};
