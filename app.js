const URL = 'https://z3ze6gkwckh91s9ybnacqa.supabase.co/rest/v1/resultados';
const KEY = 'sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC'; 

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
    "53": "Caracol", "54": "Grillo", "55": "Oso Hormiguero", "56": "Tiburón", "57": "Pato", "58": "Hormiga",
    "59": "Pantera", "60": "Camaleón", "61": "Panda", "62": "Cachicamo", "63": "Cangrejo", "64": "Gavilán",
    "65": "Araña", "66": "Lobo", "67": "Avestruz", "68": "Jaguar", "69": "Conejo", "70": "Bisonte",
    "71": "Guacamaya", "72": "Gorila", "73": "Hipopótamo", "74": "Turpial", "75": "Guácharo"
};

async function guardarDato() {
    const f = document.getElementById('fecha_registro').value;
    const h = document.getElementById('hora').value;
    const nRaw = document.getElementById('numero').value.trim();
    let n = (nRaw === "0" || nRaw === "00") ? nRaw : nRaw.padStart(2, '0');

    if (!ANIMALES[n]) return alert("Número fuera de rango (00-75)");

    try {
        const r = await fetch(URL, {
            method: 'POST',
            headers: { 
                'apikey': KEY, 
                'Authorization': `Bearer ${KEY}`, 
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' 
            },
            body: JSON.stringify({ fecha: f, hora: h, numero: n, animal: ANIMALES[n] })
        });

        if (r.ok) {
            alert("✅ Guardado: " + n + " - " + ANIMALES[n]);
            document.getElementById('numero').value = '';
            cargarDatos();
        } else {
            const err = await r.json();
            alert("Error Supabase: " + err.message);
        }
    } catch (e) {
        alert("Falla de Red: Intenta refrescar la página.");
    }
}
