const CLAVE_MAESTRA = '7575'; 

function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (inputPass === CLAVE_MAESTRA) {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Esta es la conexión con logic.js
        inicializarSistema(); 
        
        setInterval(() => {
            const clock = document.getElementById('live-clock');
            if(clock) clock.innerText = new Date().toLocaleTimeString();
        }, 1000);
    } else {
        alert("ERROR: CLAVE INCORRECTA");
    }
}
