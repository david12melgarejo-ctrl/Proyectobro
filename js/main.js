document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    marcarEnlaceActivo();
});

// 1. Verificar sesión activa
function verificarSesion() {
    const sesion = JSON.parse(localStorage.getItem("sesion_crm"));

    if (!sesion) {
        if (window.location.pathname.includes("/views/")) {
            window.location.href = "../login.html";
        } else if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // Restricción de Rol
    if (sesion.rol !== "admin" && !window.location.pathname.includes("lobby-jugador.html")) {
        alert("Acceso denegado: Tu cuenta no tiene permisos de Administrador.");
        window.location.href = window.location.pathname.includes("/views/") ? "lobby-jugador.html" : "views/lobby-jugador.html";
    }
}

// 2. Resaltar enlace activo en el menú lateral
function marcarEnlaceActivo() {
    const rutaActual = window.location.pathname;
    const enlacesNav = document.querySelectorAll(".sidebar-nav a");

    enlacesNav.forEach(enlace => {
        const href = enlace.getAttribute("href");
        if (href && rutaActual.includes(href.replace("../", ""))) {
            document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
            enlace.parentElement.classList.add("active");
        }
    });
}

// 3. Función global para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("sesion_crm");

    const esVistaSecundaria = window.location.pathname.includes("/views/");
    const rutaLogin = esVistaSecundaria ? "../login.html" : "login.html";

    window.location.href = rutaLogin;
}

// Alias para compatibilidad
window.cerrarSesionAdmin = cerrarSesion;
window.cerrarSesion = cerrarSesion;
