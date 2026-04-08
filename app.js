<script>
    // 1. CONEXIÓN CON TU CEREBRO DE DATOS (SUPABASE)
    // Reemplaza esto con tus credenciales reales de Supabase
    const URL_SB = "TU_SUPABASE_URL"; 
    const KEY_SB = "TU_SUPABASE_ANON_KEY"; 
    const supabase = supabase.createClient(URL_SB, KEY_SB);

    // 2. DICCIONARIO TALL (Traductor de Números a Animales)
    const obtenerAnimal = (num) => {
        const n = num.toString().padStart(2, '0');
        const animales = {
            "00": "BALLENA", "01": "CARNERO", "02": "TORO", "03": "CIEMPIÉS", "04": "ALACRÁN",
            "05": "LEÓN", "06": "RANA", "07": "PERICO", "08": "RATÓN", "09": "ÁGUILA",
            "10": "TIGRE", "11": "GATO", "12": "CABALLO", "13": "MONO", "14": "PALOMA",
            "15": "ZORRO", "16": "OSO", "17": "PAVO", "18": "BURRO", "19": "CHIVO",
            "20": "COCHINO", "21": "GALLO", "22": "CAMELLO", "23": "CEBRA", "24": "IGUANA",
            "25": "GALLINA", "26": "VACA", "27": "PERRO", "28": "ZAMURO", "29": "ELEFANTE",
            "30": "CAIMÁN", "31": "LAPA", "32": "ARDILLA", "33": "PESCADO", "34": "VENADO",
            "35": "JIRAFA", "36": "CULEBRA", "75": "GUÁCHARO" 
            // Carlos, puedes seguir completando hasta el 99 aquí
        };
        return animales[n] || "ANIMAL " + n;
    };

    // 3. FUNCIÓN DE CARGA DE DATOS (HISTORIAL Y RADAR)
    async function refrescarSistema() {
        console.log("Actualizando datos...");
        
        // Cargar los últimos 15 registros para la tabla
        const { data: historial, error: errH } = await supabase
            .from('estudio_algoritmo')
            .select('*')
            .order('fecha', { ascending: false })
            .order('hora', { ascending: false })
            .limit(15);

        if (historial) {
            const tabla = document.getElementById('cuerpoTabla');
            tabla.innerHTML = historial.map(r => `
                <tr class="${r.numero === '75' ? 'bg-amber-900/30' : 'border-b border-slate-700'}">
                    <td class="p-3 text-xs">${r.fecha}</td>
                    <td class="p-3 text-xs">${r.hora}</td>
                    <td class="p-3 font-mono font-bold text-amber-500">${r.numero}</td>
                    <td class="p-3 text-sm">${r.animal}</td>
                </tr>
            `).join('');
        }

        // Cargar el Radar 75 desde la Vista SQL que creamos
        const { data: radar, error: errR } = await supabase
            .from('analisis_secuencias')
            .select('num_antes, num_despues')
            .eq('numero', '75');

        if (radar) {
            // Limpiamos duplicados y valores nulos
            const antes = [...new Set(radar.map(s => s.num_antes).filter(n => n))];
            const despues = [...new Set(radar.map(s => s.num_despues).filter(n => n))];
            
            document.getElementById('antes75').innerText = antes.length > 0 ? antes.join(" - ") : "---";
            document.getElementById('despues75').innerText = despues.length > 0 ? despues.join(" - ") : "---";
        }
    }

    // 4. MANEJO DEL FORMULARIO (GUARDAR)
    document.getElementById('formCaptura').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = e.target.querySelector('button');
        const numInput = document.getElementById('numero').value.padStart(2, '0');
        const fechaInput = document.getElementById('fecha').value;
        const horaInput = document.getElementById('hora').value;

        btn.disabled = true;
        btn.innerText = "PROCESANDO...";

        const { error } = await supabase
            .from('estudio_algoritmo')
            .insert([{ 
                fecha: fechaInput, 
                hora: horaInput, 
                numero: numInput, 
                animal: obtenerAnimal(numInput) 
            }]);

        if (error) {
            alert("Error al guardar: " + error.message);
        } else {
            console.log("¡Registrado!");
            e.target.reset();
            // Ponemos la fecha de hoy por defecto otra vez
            document.getElementById('fecha').valueAsDate = new Date();
            await refrescarSistema();
        }
        
        btn.disabled = false;
        btn.innerText = "GUARDAR";
    });

    // 5. INICIO AUTOMÁTICO AL CARGAR LA WEB
    window.onload = () => {
        // Establecer fecha actual en el input
        document.getElementById('fecha').valueAsDate = new Date();
        refrescarSistema();
    };
</script>
