document.addEventListener("DOMContentLoaded", () => {
    cargarDatosSegmentacion();

    // Eventos interactivos en tiempo real (al cambiar los selects o escribir en el buscador)
    document.getElementById("filtro-categoria")?.addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-preferencia")?.addEventListener("change", aplicarFiltros);
    document.getElementById("input-busqueda")?.addEventListener("input", aplicarFiltros);
    document.getElementById("btn-filtrar")?.addEventListener("click", aplicarFiltros);
});

let listaClientesGlobal = [];

async function cargarDatosSegmentacion() {
    try {
        // Cargar del JSON estático
        const respuesta = await fetch("../data/clientes.json");
        const data = await respuesta.json();
        const clientesJSON = data.clientes || [];

        // Cargar del LocalStorage (clientes registrados manualmente)
        const clientesLocal = JSON.parse(localStorage.getItem("clientes_piloto")) || [];

        // Unificar orígenes
        listaClientesGlobal = [...clientesJSON, ...clientesLocal];

        // Cargar tabla inicial
        aplicarFiltros();

    } catch (error) {
        console.error("Error al cargar la segmentación:", error);
    }
}

function aplicarFiltros() {
    const cat = document.getElementById("filtro-categoria").value;
    const pref = document.getElementById("filtro-preferencia").value;
    const textoBusqueda = document.getElementById("input-busqueda")?.value.toLowerCase().trim() || "";

    const filtrados = listaClientesGlobal.filter(cliente => {
        const coincideCat = (cat === "todos") || (cliente.categoria === cat);
        const coincidePref = (pref === "todos") || (cliente.preferencia === pref);
        const coincideNombreODni = cliente.nombre.toLowerCase().includes(textoBusqueda) || 
                                   cliente.dni.includes(textoBusqueda);

        return coincideCat && coincidePref && coincideNombreODni;
    });

    renderizarTabla(filtrados);
    actualizarContadores(filtrados.length, listaClientesGlobal.length);
}

function renderizarTabla(clientes) {
    const tbody = document.getElementById("tabla-clientes");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (clientes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                    <i class="fa-solid fa-user-slash" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                    No se encontraron clientes que coincidan con los criterios seleccionados.
                </td>
            </tr>`;
        return;
    }

    clientes.forEach(c => {
        const esVIP = c.categoria === 'VIP';
        const badgeColor = esVIP ? '#f39c12' : '#7f8c8d';
        const bgBadge = esVIP ? '#fef9e7' : '#f2f4f4';

        const fila = document.createElement("tr");
        fila.style.borderBottom = "1px solid #ecf0f1";
        fila.innerHTML = `
            <td style="padding: 0.85rem; font-weight: 600;">${c.nombre}</td>
            <td style="padding: 0.85rem; color: #555;">${c.dni}</td>
            <td style="padding: 0.85rem;">
                <span style="background: ${bgBadge}; color: ${badgeColor}; border: 1px solid ${badgeColor}; padding: 0.25rem 0.6rem; border-radius: 12px; font-weight: bold; font-size: 0.85rem;">
                    ${c.categoria}
                </span>
            </td>
            <td style="padding: 0.85rem; text-align: center;">${c.visitasMes || 1} visitas</td>
            <td style="padding: 0.85rem;">${c.preferencia || 'Sin definir'}</td>
            <td style="padding: 0.85rem; text-align: center;">
                <button onclick="enviarPromocion('${c.nombre}')" style="background: #27ae60; color: white; border: none; padding: 0.35rem 0.7rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    <i class="fa-solid fa-paper-plane"></i> Enviar Promo
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function actualizarContadores(mostrados, total) {
    const elContador = document.getElementById("contador-segmento");
    if (elContador) {
        elContador.innerHTML = `Mostrando <strong>${mostrados}</strong> de <strong>${total}</strong> clientes segmentados`;
    }
}

// Acción interactiva: Simular envío de campaña personalizada
function enviarPromocion(nombre) {
    alert(`¡Promoción personalizada enviada a ${nombre} con éxito!`);
}