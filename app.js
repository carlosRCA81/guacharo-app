const supabaseUrl = 'https://jvbsalpnycnokynpsexw.supabase.co';
const supabaseKey = 'sb_publisible_hurtMxONK9ce5XNemgTYFg_4TzbkkVe';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// LISTA OFICIAL CRCA (Nombres, Números y Elementos)
const listaAnimales = {
    "00":{n:"Ballena",e:"Agua"}, "0":{n:"Delfín",e:"Agua"}, "1":{n:"Carnero",e:"Tierra"}, "2":{n:"Toro",e:"Tierra"},
    "3":{n:"Ciempiés",e:"Tierra"}, "4":{n:"Alacrán",e:"Tierra"}, "5":{n:"León",e:"Tierra"}, "6":{n:"Rana",e:"Agua"},
    "7":{n:"Perico",e:"Aire"}, "8":{n:"Ratón",e:"Tierra"}, "9":{n:"Águila",e:"Aire"}, "10":{n:"Tigre",e:"Tierra"},
    "11":{n:"Gato",e:"Tierra"}, "12":{n:"Caballo",e:"Tierra"}, "13":{n:"Mono",e:"Tierra"}, "14":{n:"Paloma",e:"Aire"},
    "15":{n:"Zorro",e:"Tierra"}, "16":{n:"Oso",e:"Tierra"}, "17":{n:"Pavo",e:"Aire"}, "18":{n:"Burro",e:"Tierra"},
    "19":{n:"Chivo",e:"Tierra"}, "20":{n:"Cochino",e:"Tierra"}, "21":{n:"Gallo",e:"Tierra"}, "22":{n:"Camello",e:"Tierra"},
    "23":{n:"Cebra",e:"Tierra"}, "24":{n:"Iguana",e:"Tierra"}, "25":{n:"Gallina",e:"Tierra"}, "26":{n:"Vaca",e:"Tierra"},
    "27":{n:"Perro",e:"Tierra"}, "28":{n:"Zamuro",e:"Aire"}, "29":{n:"Elefante",e:"Tierra"}, "30":{n:"Caimán",e:"Agua"},
    "31":{n:"Lapa",e:"Tierra"}, "32":{n:"Ardilla",e:"Tierra"}, "33":{n:"Pescado",e:"Agua"}, "34":{n:"Venado",e:"Tierra"},
    "35":{n:"Jirafa",e:"Tierra"}, "36":{n:"Culebra",e:"Tierra"}, "37":{n:"Tortuga",e:"Agua"}, "38":{n:"Mono",e:"Tierra"},
    "39":{n:"Zorro",e:"Tierra"}, "40":{n:"Avispa",e:"Aire"}, "41":{n:"Canguro",e:"Tierra"}, "42":{n:"Tucán",e:"Aire"},
    "43":{n:"Mariposa",e:"Aire"}, "44":{n:"Chigüire",e:"Tierra"}, "45":{n:"Garza",e:"Aire"}, "46":{n:"Puma",e:"Tierra"},
    "47":{n:"Pavo Real",e:"Aire"}, "48":{n:"Puercoespín",e:"Tierra"}, "49":{n:"Pereza",e:"Tierra"}, "50":{n:"Canario",e:"Aire"},
    "51":{n:"Pelícano",e:"Aire"}, "52":{n:"Pulpo",e:"Agua"}, "53":{n:"Caracol",e:"Agua"}, "54":{n:"Grillo",e:"Tierra"},
    "55":{n:"Hormiga",e:"Tierra"}, "56":{n:"Tiburón",e:"Agua"}, "57":{n:"Puercoespín",e:"Tierra"}, "58":{n:"Gato",e:"Tierra"},
    "59":{n:"Chivo",e:"Tierra"}, "60":{n:"Hipopótamo",e:"Agua"}, "61":{n:"Gacela",e:"Tierra"}, "62":{n:"Gorila",e:"Tierra"},
    "63":{n:"Mapache",e:"Tierra"}, "64":{n:"Camaleón",e:"Tierra"}, "65":{n:"Rinoceronte",e:"Tierra"}, "66":{n:"Oso",e:"Tierra"},
    "67":{n:"Búho",e:"Aire"}, "68":{n:"Tortuga",e:"Agua"}, "69":{n:"Pájaro",e:"Aire"}, "70":{n:"Bisonte",e:"Tierra"},
    "71":{n:"Guacamaya",e:"Aire"}, "72":{n:"Panda",e:"Tierra"}, "73":{n:"Cachicamo",e:"Tierra"}, "74":{n:"Turpial",e:"Aire"},
    "75":{n:"GUÁCHARO",e:"Aire"}
};

function verificarAcceso() {
    const pass = prompt("ACCESO BLINDADO CRCA. CLAVE:");
    if (pass !== "7575") { document.body.innerHTML = "<h1 style='color:white; text-align:center;'>ACCESO DENEGADO</h1>"; }
    else { cargarDatos(); }
}

async function guardarDato() {
    const f = document.getElementById('fecha').value;
    const h = document.getElementById('hora').value;
    const n = document.getElementById('num').value;

    if (!listaAnimales[n]) { alert("Número no existe en Guácharo Activo"); return; }

    const { error } = await _supabase.from('resultados_guacharo').insert([
        { fecha: f, hora: h, numero: n, nombre_animal: listaAnimales[n].n, grupo: listaAnimales[n].e }
    ]);

    if (error) { 
        console.error(error);
        alert("Error de conexión: Revisa el nombre de la tabla."); 
    } else { 
        document.getElementById('msg-status').innerText = "Incrustado con éxito.";
        cargarDatos(); 
    }
}

async function cargarDatos() {
    const { data } = await _supabase.from('resultados_guacharo').select('*').order('created_at', { ascending: false });
    
    if (data) {
        // Contador 75
        document.getElementById('count-75').innerText = data.filter(i => i.numero === "75").length;
        
        // Tabla Historial
        const tbody = document.getElementById('cuerpo-tabla');
        tbody.innerHTML = data.map(i => `
            <tr>
                <td>${i.fecha}</td>
                <td>${i.hora}</td>
                <td style="font-weight:bold; color:#00d4ff">${i.numero}</td>
                <td>${i.nombre_animal}</td>
                <td>${i.grupo}</td>
                <td><button class="btn-del" onclick="borrarRegistro('${i.id}')">Borrar</button></td>
            </tr>
        `).join('');

        // Lógica de Predicción básica (Algoritmo CRCA)
        if (data.length > 5) {
            const ultimoElemento = data[0].grupo;
            document.getElementById('prediccion').innerText = `Probable próximo: Elemento ${ultimoElemento}`;
        }
    }
}

async function borrarRegistro(id) {
    if (confirm("¿Borrar este movimiento?")) {
        await _supabase.from('resultados_guacharo').delete().eq('id', id);
        cargarDatos();
    }
}
