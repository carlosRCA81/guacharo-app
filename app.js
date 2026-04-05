const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _supabase = supabase.createClient(DB_URL, DB_KEY);

const FAMILIAS = {
    "TIERRA": [1, 2, 5, 10, 11, 12, 13, 15, 16, 18, 19, 20, 22, 23, 26, 27, 29, 31, 32, 34, 35, 38, 41, 44, 46, 48, 49, 61, 62, 66, 68, 69, 70, 72, 73],
    "AGUA": [0, "00", 6, 30, 33, 37, 52, 53, 55, 60, 63],
    "AIRE": [7, 9, 14, 17, 21, 25, 28, 39, 42, 45, 47, 50, 51, 64, 67, 71, 74, 75],
    "INSECTO": [3, 4, 40, 43, 54, 56, 58, 59, 65]
};

function cambiarPestana(id) {
    const vistas = ['registro', 'historial', 'analisis', 'semanal'];
    vistas.forEach(v => document.getElementById(`vista-${v}`).classList.toggle('hidden', v !== id));
    
    if (id === 'semanal') generarEstadisticaSemanal();
}

async function generarEstadisticaSemanal() {
    const { data } = await _supabase.from('control_guacharo').select('*');
    if (!data || data.length === 0) return;

    const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const inteligencia = {};

    // 1. Organizar datos por día
    data.forEach(s => {
        const d = new Date(s.fecha_sorteo + 'T00:00:00').getDay();
        const nombreDia = dias[d];
        
        if (!inteligencia[nombreDia]) {
            inteligencia[nombreDia] = { animales: {}, familias: {} };
        }

        // Contar animales individuales
        inteligencia[nombreDia].animales[s.animalito] = (inteligencia[nombreDia].animales[s.animalito] || 0) + 1;

        // Contar familias
        const fam = Object.keys(FAMILIAS).find(k => FAMILIAS[k].includes(parseInt(s.animalito))) || "OTRO";
        inteligencia[nombreDia].familias[fam] = (inteligencia[nombreDia].familias[fam] || 0) + 1;
    });

    const container = document.getElementById('contenedor-semanal');
    container.innerHTML = "";

    dias.forEach(dia => {
        if (inteligencia[dia]) {
            // Encontrar familia dominante
            const domFam = Object.entries(inteligencia[dia].familias).sort((a,b) => b[1]-a[1])[0][0];
            
            // Encontrar los 2 animales más frecuentes de ese día
            const topAnimales = Object.entries(inteligencia[dia].animales)
                .sort((a,b) => b[1]-a[1])
                .slice(0, 2)
                .map(a => a[0])
                .join(" y ");

            container.innerHTML += `
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-lg border-l-4 border-l-yellow-600">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="text-white font-black text-xs tracking-tighter">${dia}</div>
                            <div class="text-yellow-600 font-bold italic text-[9px] uppercase">Dominio: ${domFam}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-[8px] text-slate-500 font-bold uppercase">Tendencia Animal</div>
                            <div class="text-white font-black text-sm glow-text">${topAnimales}</div>
                        </div>
                    </div>
                    <div class="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div class="bg-yellow-600 h-full" style="width: 70%"></div>
                    </div>
                </div>
            `;
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha_hoy').value = new Date().toISOString().split('T')[0];
    generarEstadisticaSemanal();
});
