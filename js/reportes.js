document.addEventListener("DOMContentLoaded", () => {
    // 1. Vincular botón de Excel
    const btnExcel = document.getElementById("btn-exportar-excel");
    if (btnExcel) {
        btnExcel.addEventListener("click", exportarReporteExcel);
    }

    // 2. Vincular botón de CSV
    const btnCsv = document.getElementById("btn-exportar-csv");
    if (btnCsv) {
        btnCsv.addEventListener("click", exportarReporteCSV);
    }

    // 3. Vincular botón de Resumen
    const btnResumen = document.getElementById("btn-generar-resumen");
    if (btnResumen) {
        btnResumen.addEventListener("click", generarResumenReporte);
    }

    // Cargar datos iniciales en la tabla de reportes si existe
    cargarDatosTablaReportes();
});

// Función auxiliar para obtener todos los clientes unificados
function obtenerClientesParaReporte() {
    const clientesLocal = JSON.parse(localStorage.getItem("clientes_piloto")) || [];
    // Si manejas también clientes de un JSON externo, puedes cargarlos aquí o mantenerlos unificados
    return clientesLocal;
}

// ---------------------------------------------------------
// 1. EXPORTAR A EXCEL (Con diseño y correos incluidos)
// ---------------------------------------------------------
function exportarReporteExcel() {
    try {
        const todosLosClientes = obtenerClientesParaReporte();
        if (todosLosClientes.length === 0) {
            alert("No hay registros de clientes para exportar.");
            return;
        }

        const datosExcel = [
            ["ATLANTIC CITY CRM - REPORTE DE CLIENTES E INTERACCIONES"],
            ["Generado automáticamente por el Sistema CRM"],
            [],
            ["ID Cliente", "Nombre Completo", "DNI", "Correo Electrónico", "Categoría", "Juego Preferido", "Visitas / Mes", "Fecha Registro"]
        ];

        todosLosClientes.forEach((c, index) => {
            datosExcel.push([
                c.id || `CLI-100${index + 1}`,
                c.nombre || "Sin Nombre",
                c.dni || "N/A",
                c.email || "No registrado",
                c.categoria || "Regular",
                c.preferencia || "Tragamonedas",
                parseInt(c.visitasMes) || 1,
                c.fechaRegistro ? c.fechaRegistro.split('T')[0] : new Date().toISOString().split('T')[0]
            ]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(datosExcel);
        worksheet['!cols'] = [
            { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 28 }, 
            { wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 15 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte General");
        XLSX.writeFile(workbook, "Reporte_Clientes_AtlanticCity.xlsx");

    } catch (error) {
        console.error("Error al exportar Excel:", error);
        alert("Hubo un error al generar el Excel.");
    }
}

// ---------------------------------------------------------
// 2. EXPORTAR A CSV
// ---------------------------------------------------------
function exportarReporteCSV() {
    try {
        const todosLosClientes = obtenerClientesParaReporte();
        if (todosLosClientes.length === 0) {
            alert("No hay registros para exportar en CSV.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,DNI,Correo,Categoria,Juego,Visitas,Fecha\n";

        todosLosClientes.forEach((c, index) => {
            const row = [
                c.id || `CLI-100${index + 1}`,
                `"${c.nombre || 'Sin Nombre'}"`,
                c.dni || "N/A",
                c.email || "No registrado",
                c.categoria || "Regular",
                c.preferencia || "Tragamonedas",
                parseInt(c.visitasMes) || 1,
                c.fechaRegistro ? c.fechaRegistro.split('T')[0] : "N/A"
            ];
            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Reporte_Clientes_AtlanticCity.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Error al exportar CSV:", error);
        alert("Hubo un error al generar el archivo CSV.");
    }
}

// ---------------------------------------------------------
// 3. GENERAR RESUMEN (Métricas rápidas o visualización)
// ---------------------------------------------------------
// ---------------------------------------------------------
// 3. GENERAR RESUMEN (Incluyendo vistas de invitados)
// ---------------------------------------------------------
function generarResumenReporte() {
    try {
        const todosLosClientes = obtenerClientesParaReporte();
        const totalClientes = todosLosClientes.length;
        const vips = todosLosClientes.filter(c => c.categoria === "VIP").length;
        const regulares = totalClientes - vips;
        
        // 1. Suma de visitas de clientes registrados
        const visitasClientes = todosLosClientes.reduce((acc, c) => acc + (parseInt(c.visitasMes) || 1), 0);
        
        // 2. Visitas en Modo Invitado desde el LocalStorage
        const vistasInvitados = parseInt(localStorage.getItem("contador_vistas_invitado")) || 0;
        
        // 3. Total Universal de Visitas
        const totalVisitasUniversal = visitasClientes + vistasInvitados;

        alert(
            `📊 RESUMEN EJECUTIVO DE ACTIVIDAD:\n\n` +
            `- Total de Clientes Registrados: ${totalClientes}\n` +
            `   • Clientes VIP: ${vips}\n` +
            `   • Clientes Regulares: ${regulares}\n\n` +
            `- Visitas de Clientes Registrados: ${visitasClientes}\n` +
            `- Visitas Modo Invitado: ${vistasInvitados}\n` +
            `-----------------------------------------\n` +
            `- TOTAL ACUMULADO UNIVERSAL: ${totalVisitasUniversal} visitas`
        );
    } catch (error) {
        console.error("Error al generar resumen:", error);
        alert("Hubo un error al generar el resumen.");
    }
}

// ---------------------------------------------------------
// 4. CARGAR TABLA EN LA VISTA DE REPORTES
// ---------------------------------------------------------
function cargarDatosTablaReportes() {
    const tbody = document.getElementById("tabla-reportes-body");
    if (!tbody) return;

    const todosLosClientes = obtenerClientesParaReporte();
    tbody.innerHTML = "";

    todosLosClientes.forEach((c, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id || `CLI-100${index + 1}`}</td>
            <td>${c.nombre || "Sin Nombre"}</td>
            <td>${c.dni || "N/A"}</td>
            <td>${c.email || "No registrado"}</td>
            <td><span class="badge ${c.categoria === 'VIP' ? 'bg-warning' : 'bg-primary'}">${c.categoria || 'Regular'}</span></td>
            <td>${c.preferencia || "Tragamonedas"}</td>
            <td>${c.visitasMes || 1}</td>
        `;
        tbody.appendChild(tr);
    });
}