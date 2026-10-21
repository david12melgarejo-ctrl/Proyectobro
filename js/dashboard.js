document.addEventListener("DOMContentLoaded", () => {
    inicializarDashboard();
});

let chartCategoriasInstance = null;
let chartJuegosInstance = null;

async function inicializarDashboard() {
    try {
        const respuesta = await fetch("data/clientes.json");
        const data = await respuesta.json();
        const clientesJSON = data.clientes || [];
        const clientesLocal = JSON.parse(localStorage.getItem("clientes_piloto")) || [];
        
        const todosLosClientes = [...clientesJSON, ...clientesLocal];

        actualizarTarjetasKPI(todosLosClientes);
        renderizarGraficoCategorias(todosLosClientes);
        renderizarGraficoJuegos(todosLosClientes);

    } catch (error) {
        console.error("Error cargando métricas del Dashboard:", error);
    }
}

function actualizarTarjetasKPI(clientes) {
    const totalClientes = clientes.length;
    const vips = clientes.filter(c => c.categoria === "VIP").length;
    
    // 1. Calculamos las visitas de los clientes registrados
    const visitasClientes = clientes.reduce((acc, c) => acc + (parseInt(c.visitasMes) || 1), 0);
    
    // 2. Obtenemos las visitas de los invitados desde el localStorage
    const totalVistasInvitados = parseInt(localStorage.getItem("contador_vistas_invitado")) || 0;
    
    // 3. Fusionamos ambas para crear el contador universal de visitas
    const totalVisitasUniversal = visitasClientes + totalVistasInvitados;

    const elTotal = document.getElementById("kpi-total-clientes");
    const elVip = document.getElementById("kpi-total-vip");
    const elVisitas = document.getElementById("kpi-total-visitas");

    if (elTotal) elTotal.textContent = totalClientes;
    if (elVip) elVip.textContent = vips;
    if (elVisitas) elVisitas.textContent = totalVisitasUniversal; // Mostramos la suma total universal aquí
}

function renderizarGraficoCategorias(clientes) {
    const ctx = document.getElementById("chartCategorias")?.getContext("2d");
    if (!ctx) return;

    const vips = clientes.filter(c => c.categoria === "VIP").length;
    const regulares = clientes.filter(c => c.categoria === "Regular").length;

    if (chartCategoriasInstance) chartCategoriasInstance.destroy();

    chartCategoriasInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["VIP", "Regular"],
            datasets: [{
                data: [vips, regulares],
                backgroundColor: ["#f39c12", "#3498db"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function renderizarGraficoJuegos(clientes) {
    const ctx = document.getElementById("chartJuegos")?.getContext("2d");
    if (!ctx) return;

    // Contar clientes por preferencia de juego
    const juegos = {};
    clientes.forEach(c => {
        const juego = c.preferencia || "Otros";
        juegos[juego] = (juegos[juego] || 0) + 1;
    });

    const labels = Object.keys(juegos);
    const dataValues = Object.values(juegos);

    if (chartJuegosInstance) chartJuegosInstance.destroy();

    chartJuegosInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels.length ? labels : ["Sin Datos"],
            datasets: [{
                label: "Cantidad de Clientes",
                data: dataValues.length ? dataValues : [0],
                backgroundColor: ["#9b59b6", "#e74c3c", "#2ecc71", "#34495e"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}