/* SEGURIDAD CRCA - VERSIÓN INTEGRAL */
const CLAVE_MAESTRA = '1234'; 

function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (inputPass === CLAVE_MAESTRA) {
        // Desbloqueo visual
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Inicialización de funciones
        if (typeof inicializarSistema === 'function') {
            inicializarSistema();
        }
        if (typeof cargarHistorialRemoto === 'function') {
            cargarHistorialRemoto();
        }
        
        // Iniciar reloj
        setInterval(() => {
            const clock = document.getElementById('live-clock');
            if(clock) clock.innerText = new Date().toLocaleTimeString();
        }, 1000);

        console.log("Acceso concedido. Conectando a Ohio...");
    } else {
        alert("ERROR: CLAVE INCORRECTA");
        document.getElementById('access-key').value = '';
    }
}

// Permitir Enter en el teclado
document.getElementById('access-key').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAccess();
});
