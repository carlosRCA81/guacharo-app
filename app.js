// CONFIGURACIÓN DE CONEXIÓN
const DB_URL = "https://iyvbufxkgycqcmdeclsf.supabase.co";
const DB_KEY = "sb_publishable_Z3ze6gKwcKh91S9YBnacqA_3so-cPOC";
const _gbi = supabase.createClient(DB_URL, DB_KEY);
const MASTER_KEY = "CARLOS2026";

// FUNCIÓN DE ACCESO DIRECTO
function validarAcceso() {
    const input = document.getElementById('access_key').value.trim();
    
    if (input === MASTER_KEY) {
        alert("ACCESO AUTORIZADO. INICIANDO ESCÁNER...");
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-system').classList.remove('hidden');
        document.getElementById('main-system').style.display = 'block';
        cargarMatriz(); 
    } else {
        alert("TOKEN INVÁLIDO");
    }
}

// CARGA DE DATOS PARA ESTUDIO DE ALGORITMO
async function cargarMatriz() {
    try {
        const { data, error } = await _gbi
            .from('gbi_resultados')
            .select('*, gbi_especies(*)')
            .order('fecha', {ascending: false})
            .order('hora', {ascending: false});

        if (error) throw error;

        const count = data ? data.length : 0;
        document.getElementById('counter').innerText = `${count} MOVIMIENTOS DETECTADOS`;
        
        if(count === 0) alert("AVISO: BASE DE DATOS VACÍA O SIN CONEXIÓN");
        
        renderizarTabla(data);
    } catch (err) {
        alert("ERROR CRÍTICO GBI: " + err.message);
    }
}

function renderizarTabla(data) {
    const tbody = document.getElementById('tabla-gbi');
    if (!data) return;

    tbody.innerHTML = data.map(r => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px;">
                <div style="font-size: 10px; color: gray;">${r.fecha}</div>
                <div style="font-weight: 900;">${r.hora.substring(0,5)}</div>
            </td>
            <td style="padding: 10px;">
                <span style="font-size: 20px; font-weight: 900; ${r.animal_id == 75 ? 'color: #d97706;' : ''}">${r.animal_id}</span>
                <span style="font-size: 9px; color: #999; text-transform: uppercase; margin-left: 5px;">${r.gbi_especies ? r.gbi_especies.nombre : ''}</span>
            </td>
            <td style="padding: 10px; text-align: center;">
                <span style="background: ${r.gbi_especies ? r.gbi_especies.color_hex : '#000'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                    ${r.gbi_especies ? r.gbi_especies.familia : 'PROCESANDO'}
                </span>
            </td>
            <td style="padding: 10px; text-align: center; color: green; font-size: 10px; font-weight: 900;">OK</td>
        </tr>
    `).join('');
}

async function registrarEnGBI() {
    const num = document.getElementById('num_input').value;
    const fec = document.getElementById('fec_input').value;
    const hor = document.getElementById('hor_input').value;

    if(!num || !fec) return alert("COMPLETE LOS CAMPOS");

    const { error } = await _gbi.from('gbi_resultados').insert([{
        animal_id: parseInt(num), 
        fecha: fec, 
        hora: hor + ":00"
    }]);

    if(!error) {
        alert("MOVIMIENTO GUARDADO");
        document.getElementById('num_input').value = "";
        cargarMatriz();
    } else {
        alert("ERROR AL GUARDAR: " + error.message);
    }
}

// Inicializar reloj
setInterval(() => { 
    const r = document.getElementById('reloj_pro');
    if(r) r.innerText = new Date().toLocaleTimeString('en-GB'); 
}, 1000);
