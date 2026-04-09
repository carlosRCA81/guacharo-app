// Limpiamos las credenciales de cualquier espacio accidental al copiar
const supabaseUrl = 'https://jvbsalpnycnokynpsexw.supabase.co'.trim();
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2YnNhbHBueWNub2t5bnBzZXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NzE5OTMsImV4cCI6MjAyODI0Nzk5M30.4TzbkkVeUnL_H8_S_Y8H-vM-S9_vW_D_Tz-V_S'.trim(); 

// Inicializamos el cliente
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

const DATA_GUACHARO = {
    "00":{n:"Ballena",g:"Agua"}, "0":{n:"Delfín",g:"Agua"}, "1":{n:"Carnero",g:"Tierra"}, "2":{n:"Toro",g:"Tierra"},
    "3":{n:"Ciempiés",g:"Tierra"}, "4":{n:"Alacrán",g:"Tierra"}, "5":{n:"León",g:"Tierra"}, "6":{n:"Rana",g:"Agua"},
    "7":{n:"Perico",g:"Aire"}, "8":{n:"Ratón",g:"Tierra"}, "9":{n:"Águila",g:"Aire"}, "10":{n:"Tigre",g:"Tierra"},
    "11":{n:"Gato",g:"Tierra"}, "12":{n:"Caballo",g:"Tierra"}, "13":{n:"Mono",g:"Tierra"}, "14":{n:"Paloma",g:"Aire"},
    "15":{n:"Zorro",g:"Tierra"}, "16":{n:"Oso",g:"Tierra"}, "17":{n:"Pavo",g:"Aire"}, "18":{n:"Burro",g:"Tierra"},
    "19":{n:"Chivo",g:"Tierra"}, "20":{n:"Cochino",g:"Tierra"}, "21":{n:"Gallo",g:"Tierra"}, "22":{n:"Camello",g:"Tierra"},
    "23":{n:"Cebra",g:"Tierra"}, "24":{n:"Iguana",g:"Tierra"}, "25":{n:"Gallina",g:"Tierra"}, "26":{n:"Vaca",g:"Tierra"},
    "27":{n:"Perro",g:"Tierra"}, "28":{n:"Zamuro",g:"Aire"}, "29":{n:"Elefante",g:"Tierra"}, "30":{n:"Caimán",g:"Agua"},
    "31":{n:"Lapa",g:"Tierra"}, "32":{n:"Ardilla",g:"Tierra"}, "33":{n:"Pescado",g:"Agua"}, "34":{n:"Venado",g:"Tierra"},
    "35":{n:"Jirafa",g:"Tierra"}, "36":{n:"Culebra",g:"Tierra"}, "37":{n:"Tortuga",g:"Agua"}, "38":{n:"Búfalo",g:"Tierra"},
    "39":{n:"Lechuza",g:"Aire"}, "40":{n:"Avispa",g:"Aire"}, "41":{n:"Canguro",g:"Tierra"}, "42":{n:"Tucán",g:"Aire"},
    "43":{n:"Mariposa",g:"Aire"}, "44":{n:"Chigüire",g:"Tierra"}, "45":{n:"Garza",g:"Aire"}, "46":{n:"Puma",g:"Tierra"},
    "47":{n:"Pavo Real",g:"Aire"}, "48":{n:"Puercoespín",g:"Tierra"}, "49":{n:"Pereza",g:"Tierra"}, "50":{n:"Canario",g:"Aire"},
    "51":{n:"Pelícano",g:"Aire"}, "52":{n:"Pulpo",g:"Agua"}, "53":{n:"Caracol",g:"Agua"}, "54":{n:"Grillo",g:"Tierra"},
    "55":{n:"Oso Hormiguero",g:"Tierra"}, "56":{n:"Tiburón",g:"Agua"}, "57":{n:"Pato",g:"Agua"}, "58":{n:"Hormiga",g:"Tierra"},
    "59":{n:"Pantera",g:"Tierra"}, "60":{n:"Camaleón",g:"Tierra"}, "61":{n:"Panda",g:"Tierra"}, "62":{n:"Cachicamo",g:"Tierra"},
    "63":{n:"Cangrejo",g:"Agua"}, "64":{n:"Gavilán",g:"Aire"}, "65":{n:"Araña",g:"Tierra"}, "66":{n:"Lobo",g:"Tierra"},
    "67":{n:"Avestruz",g:"Aire"}, "68":{n:"Jaguar",g:"Tierra"}, "69":{n:"Conejo",g:"Tierra"}, "70":{n:"Bisonte",g:"Tierra"},
    "71":{n:"Guacamaya",g:"Aire"}, "72":{n:"Gorila",g:"Tierra"}, "73":{n:"Hipopótamo",g:"Agua"}, "74":{n:"Turpial",g:"Aire"},
    "75":{n:"GUÁCHARO",g:"Especial"}
};

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!DATA_GUACHARO[n]) return alert("Número Inválido");

    const { error } = await _supabase.from('historial_resultados').insert([
        { fecha: f, hora: h, numero: n, nombre_animal: DATA_GUACHARO[n].n, grupo: DATA_GUACHARO[n].g }
    ]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("¡Éxito!");
        document.getElementById('num').value = "";
        cargarDatos();
    }
}

async function cargarDatos() {
    const { data, error } = await _supabase.from('historial_resultados').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);

    const container = document.getElementById('lista-movil');
    if (container && data) {
        container.innerHTML = data.slice(0, 10).map(i => `
            <div style="border-bottom:1px solid #333; padding:10px; display:flex; align-items:center; gap:15px;">
                <div style="background:#00d2ff; color:#000; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">${i.numero}</div>
                <div><div style="font-weight:bold; color:#fff;">${i.nombre_animal}</div><div style="font-size:12px; color:#aaa;">${i.hora} | ${i.fecha}</div></div>
                <div style="margin-left:auto; font-size:12px; color:#00d2ff;">${i.grupo}</div>
            </div>
        `).join('');
    }
}

function actualizarReloj() {
    const ahora = new Date();
    const reloj = document.getElementById('reloj');
    if (reloj) reloj.textContent = ahora.toLocaleTimeString();
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    cargarDatos();
});
