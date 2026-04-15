/* SEGURIDAD CRCA - VERSIÓN CORREGIDA */
const CLAVE_MAESTRA = '1233'; // Actualizado a la clave que pediste

function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (inputPass === CLAVE_MAESTRA) {
        // 1. Cambio de pantalla
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // 2. Inicialización obligatoria de los otros archivos
        if (typeof inicializarSistema === 'function') {
            inicializarSistema();
        } else {
            console.error("Error: inicializarSistema no encontrada en app.js");
        }

        // 3. Iniciar reloj en tiempo real
        setInterval(() => {
            const clock = document.getElementById('live-clock');
            if(clock) clock.innerText = new Date().toLocaleTimeString();
        }, 1000);

        console.log("Acceso concedido. Cargando datos de Supabase...");
    } else {
        alert("ERROR: CLAVE INCORRECTA");
        document.getElementById('access-key').value = '';
    }
}

// Escuchar la tecla Enter para mayor comodidad
document.getElementById('access-key').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAccess();
});
