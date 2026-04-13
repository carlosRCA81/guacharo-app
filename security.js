const CLAVE_MAESTRA = '7575'; 

function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (inputPass === CLAVE_MAESTRA) {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Arrancar el sistema de lógica
        if (typeof inicializarSistema === 'function') {
            inicializarSistema();
        }
        
        setInterval(() => {
            const clock = document.getElementById('live-clock');
            if(clock) clock.innerText = new Date().toLocaleTimeString();
        }, 1000);
    } else {
        alert("ERROR: CLAVE INCORRECTA");
    }
}

document.getElementById('access-key')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAccess();
});
