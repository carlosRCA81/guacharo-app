/* COPIA ESTE CÓDIGO EN TU ARCHIVO security.js */
const CLAVE_MAESTRA = '1234'; 

function checkAccess() {
    const inputPass = document.getElementById('access-key').value;
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');

    if (inputPass === CLAVE_MAESTRA) {
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Carga los datos desde Ohio apenas entras
        cargarHistorialRemoto(); 
        inicializarSistema();
    } else {
        alert("CLAVE INCORRECTA");
    }
}
