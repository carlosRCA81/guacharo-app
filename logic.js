// ==========================================
// CONFIGURACIÓN SUPABASE - ANALIZADOR CRCA
// ==========================================
const SUPABASE_URL = 'https://yhhiohwoutkmzkcengev.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaGlvaHdvdXRrbXprY2VuZ2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA2MDYsImV4cCI6MjA5MTQxNjYwNn0.FvoJcNPor5sicHLpRot_8DCGCd4ifx54JrxrcMrTTBc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let historial = [];

const listaAnimales = [
    {n:'0', a:'DELFIN', t:'AGUA'}, {n:'00', a:'BALLENA', t:'AGUA'}, {n:'01', a:'CARNERO', t:'TIERRA'},
    {n:'02', a:'TORO', t:'TIERRA'}, {n:'03', a:'CIEMPIES', t:'TIERRA'}, {n:'04', a:'ALACRAN', t:'TIERRA'},
    {n:'05', a:'LEON', t:'TIERRA'}, {n:'06', a:'RANA', t:'AGUA'}, {n:'07', a:'PERICO', t:'AIRE'},
    {n:'08', a:'RATON', t:'TIERRA'}, {n:'09', a:'AGUILA', t:'AIRE'}, {n:'10', a:'TIGRE', t:'TIERRA'},
    {n:'11', a:'GATO', t:'TIERRA'}, {n:'12', a:'CABALLO', t:'TIERRA'}, {n:'13', a:'MONO', t:'TIERRA'},
    {n:'14', a:'PALOMA', t:'AIRE'}, {n:'15', a:'ZORRO', t:'TIERRA'}, {n:'16', a:'OSO', t:'TIERRA'},
    {n:'17', a:'PAVO', t:'AIRE'}, {n:'18', a:'BURRO', t:'TIERRA'}, {n:'19', a:'CHIVO', t:'TIERRA'},
    {n:'20', a:'COCHINO', t:'TIERRA'}, {n:'21', a:'GALLO', t:'AIRE'}, {n:'22', a:'CAMELLO', t:'TIERRA'},
    {n:'23', a:'CEBRA', t:'TIERRA'}, {n:'24', a:'IGUANA', t:'TIERRA'}, {n:'25', a:'GALLINA', t:'AIRE'},
    {n:'26', a:'VACA', t:'TIERRA'}, {n:'27', a:'PERRO', t:'TIERRA'}, {n:'28', a:'ZAMURO', t:'AIRE'},
    {n:'29', a:'ELEFANTE', t:'TIERRA'}, {n:'30', a:'CAIMAN', t:'AGUA'}, {n:'31', a:'LAPA', t:'TIERRA'},
    {n:'32', a:'ARDILLA', t:'TIERRA'}, {n:'33', a:'PESCADO', t:'AGUA'}, {n:'34', a:'VENADO', t:'TIERRA'},
    {n:'35', a:'PAJARO', t:'AIRE'}, {n:'36', a:'CULEBRA', t:'TIERRA'}, {n:'75', a:'GUACHARO', t:'AIRE'}
];

async function cargarHistorialRemoto() {
    try {
        const { data, error } = await _supabase
            .from('historial_sorteos')
            .select('*')
            .order('fecha', { ascending: false })
            .order('hora', { ascending: false });
        
        if (error) throw error;
        historial = data || [];
        actualizarInterfaz();
    } catch (err) {
        console.error("Error en Supabase:", err.message);
    }
}

async function guardarEnSupabase(registro) {
    try {
        const { error } = await _supabase.from('historial_sorteos').insert([registro]);
        if (error) throw error;
        return true;
    } catch (err) {
        console.error("Error al guardar:", err.message);
        return false;
    }
}

function calcularBalanceElementos() {
    const fechaActual = document.getElementById('fecha-analisis').value;
    let counts = { TIERRA: 0, AIRE: 0, AGUA: 0 };
    
    historial.filter(r => r.fecha === fechaActual).forEach(r => {
        if (counts[r.tipo] !== undefined) counts[r.tipo]++;
    });
    
    document.getElementById('val-tierra').innerText = counts.TIERRA;
    document.getElementById('val-aire').innerText = counts.AIRE;
    document.getElementById('val-agua').innerText = counts.AGUA;
}

function analizarDormidos() {
    const listaDormidosDiv = document.getElementById('lista-dormidos');
    const salieron = new Set(historial.slice(0, 25).map(r => r.num));
    const dormidos = listaAnimales.filter(a => !salieron.has(a.n)).slice(0, 6);
    
    listaDormidosDiv.innerHTML = dormidos.map(a => `<span>${a.n}-${a.a}</span>`).join(' | ');
}
