const URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _db = supabase.createClient(URL, KEY);

// Diccionario Maestro de Datos
const ANIMALES = {
    1: { n: "Carnero", f: "TIERRA", c: "bg-orange-900/20" },
    12: { n: "Caballo", f: "TIERRA", c: "bg-orange-900/20" },
    14: { n: "Paloma", f: "AIRE", c: "bg-blue-900/20" },
    32: { n: "Ardilla", f: "TIERRA", c: "bg-orange-900/20" },
    75: { n: "Guácharo", f: "AIRE", c: "bg-blue-900/20" }
};

// Reloj en tiempo real
setInterval(() => {
    document.getElementById('reloj').innerText = new Date().toLocaleTimeString('en-GB');
}, 1000);

function navegar(panel) {
    const paneles = ['registro', 'historial', 'inteligencia', 'estadistica'];
    paneles.forEach(p => {
        document.getElementById(`panel-${p}`)?.classList.add('hidden');
        document.getElementById(`btn-${p}`)?.classList.remove('tab-active');
    });
    document.getElementById(`panel-${panel}`).classList.remove('hidden');
    document.getElementById(`btn-${panel}`).classList.add('tab-active');

    if(panel === 'inteligencia') calcularProbabilidades();
    if(panel === 'estadistica') cargarEstadisticas();
}

async function guardarSorteo() {
    const num = document.getElementById('input-numero').value;
    const fec = document.getElementById('input-fecha').value;
    const hor = document.getElementById('input-hora').value;

    if(!num) return alert("Ingrese un número válido");

    const info = ANIMALES[num] || { n: "Desconocido", f: "TIERRA", c: "bg-slate-800" };
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = dias[new Date(fec).getUTCDay()];

    const { error } = await _db.from('sorteos_guacharo').insert([{
        numero: parseInt(num),
        nombre_animal: info.n,
        familia: info.f,
        fecha: fec,
        hora: hor + ":00",
        dia_semana: nombreDia
    }]);

    if(!error) {
        document.getElementById('input-numero').value = "";
        alert("Reporte Cargado con Éxito");
        cargarRecientes();
    }
}

async function calcularProbabilidades() {
    const { data } = await _db.from('sorteos_guacharo').select('*');
    if(!data) return;

    // Lógica simple de frecuencia para el ejemplo
    let frecuencias = {};
    data.forEach(s => frecuencias[s.numero] = (frecuencias[s.numero] || 0) + 1);
    
    const ordenados = Object.entries(frecuencias).sort((a,b) => b[1] - a[1]);
    
    // Actualizar Panel
    document.getElementById('prediccion-principal').innerText = 
        `${ordenados[0]?.[0] || '--'} - ${ordenados[1]?.[0] || '--'} - ${ordenados[2]?.[0] || '--'}`;

    const lista = document.getElementById('probabilidades-lista');
    lista.innerHTML = "";
    ordenados.slice(0, 8).forEach(([num, cant]) => {
        const perc = ((cant / data.length) * 100).toFixed(1);
        lista.innerHTML += `
            <div class="bg-panel p-4 rounded-xl flex justify-between items-center border-l-4 border-yellow-600">
                <span class="font-black text-white">ANIMAL ${num}</span>
                <span class="text-yellow-500 font-bold">${perc}%</span>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('input-fecha').value = new Date().toISOString().split('T')[0];
});
