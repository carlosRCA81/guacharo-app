const CLAVE_MAESTRA = '7575'; 

function verificarAcceso() {
    const p = prompt("Sistema Blindado CRCA. Ingrese Clave:");
    if (p !== CLAVE_MAESTRA) {
        document.body.innerHTML = "<h1 style='color:white;text-align:center;'>ACCESO DENEGADO</h1>";
    } else {
        cargarDatos();
    }
}
window.onload = verificarAcceso;
