document.getElementById("form-registro")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const categoria = document.getElementById("categoria").value;
    const preferencia = document.getElementById("preferencia").value; // Capturamos el nuevo campo

    // Validar DNI
    if (dni.length !== 8 || isNaN(dni)) {
        alert("El DNI debe contener exactamente 8 números.");
        return;
    }
// Dentro del evento submit de 'form-registro':
const email = document.getElementById("email").value.trim();

// Validación simple de email
if (!email.includes("@") || !email.includes(".")) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
}

const nuevoCliente = {
    nombre: nombre,
    dni: dni,
    email: email, // <-- Nuevo campo guardado
    categoria: categoria,
    preferencia: preferencia,
    visitasMes: 1
};

  // Guardar en LocalStorage (Simulación de BD)
    let clientesGuardados = JSON.parse(localStorage.getItem("clientes_piloto")) || [];
    clientesGuardados.push(nuevoCliente);
    localStorage.setItem("clientes_piloto", JSON.stringify(clientesGuardados));

    // Mostrar mensaje y reiniciar formulario
    const msj = document.getElementById("mensaje-exito");
    if (msj) msj.style.display = "block";
    
    document.getElementById("form-registro").reset();
});