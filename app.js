const supabaseUrl = 'https://jvbsalpnycnokynpsexw.supabase.co';
const supabaseKey = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Diccionario de Guácharo Activo (Números y Elementos)
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
    "35":{n:"Jirafa",g:"Tierra"}, "36":{n:"Culebra",g:"Tierra"}, "37":{n:"Tortuga",g:"Agua"}, "38":{n:"Mono",g:"Tierra"},
    "39":{n:"Zorro",g:"Tierra"}, "40":{n:"Avispa",g:"Aire"}, "41":{n:"Canguro",g:"Tierra"}, "42":{n:"Tucán",g:"Aire"},
    "43":{n:"Mariposa",g:"Aire"}, "44":{n:"Chigüire",g:"Tierra"}, "45":{n:"Garza",g:"Aire"}, "46":{n:"Puma",g:"Tierra"},
    "47":{n:"Pavo Real",g:"Aire"}, "48":{n:"Puercoespín",g:"Tierra"}, "49":{n:"Pereza",g:"Tierra"}, "50":{n:"Canario",g:"Aire"},
    "51":{n:"Pelícano",g:"Aire"}, "52":{n:"Pulpo",g:"Agua"}, "53":{n:"Caracol",g:"Agua"}, "54":{n:"Grillo",g:"Tierra"},
    "55":{n:"Hormiga",g:"Tierra"}, "56":{n:"Tiburón",g:"Agua"}, "57":{n:"Puercoespín",g:"Tierra"}, "58":{n:"Gato",g:"Tierra"},
    "59":{n:"Chivo",g:"Tierra"}, "60":{n:"Hipopótamo",g:"Agua"}, "61":{n:"Gacela",g:"Tierra"}, "62":{n:"Gorila",g:"Tierra"},
    "63":{n:"Mapache",g:"Tierra"}, "64":{n:"Camaleón",g:"Tierra"}, "65":{n:"Rinoceronte",g:"Tierra"}, "66":{n:"Oso",g:"Tierra"},
    "67":{n:"Búho",g:"Aire"}, "68":{n:"Tortuga",g:"Agua"}, "69":{n:"Pájaro",g:"Aire"}, "70":{n:"Bisonte",g:"Tierra"},
    "71":{n:"Guacamaya",g:"Aire"}, "72":{n:"Panda",g:"Tierra"}, "73":{n:"Cachicamo",g:"Tierra"}, "74":{n:"Turpial",g:"Aire"},
    "75":{n:"GUÁCHARO",g:"Aire"}
};

function verificarAcceso() {
    const p = prompt("CRCA ELITE LOGIN:");
    if (p !== "continuemos") { document.body.innerHTML = "BLOQUEADO"; }
    else { 
        cargarDatos(); 
        setInterval(() => {
            const n = new Date();
            document.getElementById('reloj').innerText = n.getHours() + ":" + (n.getMinutes()<10?'0':'') + n.getMinutes();
        }, 1000);
    }
}

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!DATA_GUACHARO[n]) return alert("Número Inválido");

    const { error } = await _supabase.from('resultados_guacharo').insert([
        { fecha: f, hora: h, numero: n, nombre_animal: DATA_GUACHARO[n].n, grupo: DATA_GUACHARO[n].g }
    ]);

    if (error) {
        console.error(error);
        alert("Error de conexión: Revisa el nombre de la tabla en Supabase.");
    } else {
        document.getElementById('num').value = "";
        cargarDatos();
    }
}

async function cargarDatos() {
    const { data } = await _supabase.from('resultados_guacharo').select('*').order('created_at', { ascending: false });
    
    if (data) {
        document.getElementById('count-75').innerText = data.filter(i => i.numero === "75").length;
        
        const container = document.getElementById('lista-movil');
        container.innerHTML = data.slice(0, 10).map(i => `
            <div class="item-row">
                <div class="circle-n">${i.numero}</div>
                <div class="item-info">
                    <div style="font-weight:bold">${i.nombre_animal}</div>
                    <div style="font-size:10px; color:#666">${i.hora} | ${i.fecha}</div>
                </div>
                <button onclick="borrar('${i.id}')" style="background:none; border:none; color:#f85149;">✕</button>
            </div>
        `).join('');

        if (data.length > 0) {
            document.getElementById('prediccion').innerText = "TENDENCIA";
            document.getElementById('animal-sugerido').innerText = data[0].grupo.toUpperCase();
        }
    }
}

async function borrar(id) {
    if(confirm("¿Eliminar?")) {
        await _supabase.from('resultados_guacharo').delete().eq('id', id);
        cargarDatos();
    }
}
