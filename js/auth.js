// Whitelist de correos con rol Administrador
const WHITELIST_ADMINS = [
    "david12melgarejo@gmail.com",
    "alexnavarro6855@gmail.com",
    "supervisor@atlanticcity.pe"
];

document.getElementById("form-login")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email").value.trim().toLowerCase();

    if (!emailInput) return;

    // 1. Verificar si el correo está en la Whitelist (Admin)
    const esAdmin = WHITELIST_ADMINS.includes(emailInput);

    if (esAdmin) {
        const usuarioSesion = {
            email: emailInput,
            rol: "admin",
            fechaIngreso: new Date().toISOString()
        };
        localStorage.setItem("sesion_crm", JSON.stringify(usuarioSesion));
        alert("¡Bienvenido al Panel de Control Administrativo!");
        window.location.href = "index.html";
        return;
    }

    // 2. Si no es admin, verificar si es un cliente registrado previamente
    const clientesRegistrados = JSON.parse(localStorage.getItem("clientes_piloto")) || [];
    const clienteEncontrado = clientesRegistrados.find(c => c.email && c.email.toLowerCase() === emailInput);

    if (clienteEncontrado) {
        // Incrementamos las visitas del cliente en 1 cada vez que inicia sesión
        clienteEncontrado.visitasMes = (parseInt(clienteEncontrado.visitasMes) || 0) + 1;
        
        // Guardamos la lista actualizada en el localStorage para que el Dashboard y Segmentación lo reflejen
        localStorage.setItem("clientes_piloto", JSON.stringify(clientesRegistrados));

        const usuarioSesion = {
            email: emailInput,
            rol: "jugador",
            nombre: clienteEncontrado.nombre,
            fechaIngreso: new Date().toISOString()
        };
        localStorage.setItem("sesion_crm", JSON.stringify(usuarioSesion));
        alert(`¡Bienvenido al Portal de Juegos, ${clienteEncontrado.nombre}!`);
        window.location.href = "views/lobby-jugador.html";
        return;
    }

    // 3. Si no está en ninguna parte
    alert("El correo no está autorizado ni registrado. Por favor, regístrate primero.");
    window.location.href = "registro.html";
}); // <--- AQUÍ SE CIERRA CORRECTAMENTE EL EVENTO SUBMIT