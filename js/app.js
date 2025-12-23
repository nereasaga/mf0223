'use strict';

const URL = 'https://694a4f311282f890d2d842e6.mockapi.io/servidores/servidor';
const LIMITE_PRESUPUESTO = 700;

document.addEventListener('DOMContentLoaded', () => {
    cargarServidores();

    document.getElementById('formulario-servidor').addEventListener('submit', (e) => {
        e.preventDefault();
        registrarServidor();
    });

    const inputsPrecio = [
        'precio-cpu',
        'precio-ram',
        'precio-almacenamiento'
    ];

    inputsPrecio.forEach(id => {
        document.getElementById(id).addEventListener('input', actualizarTotal);
    });
});

// Calculo presupuesto

function calcularTotal() {
    const precioCpu = parseFloat(document.getElementById('precio-cpu').value) || 0;
    const precioRam = parseFloat(document.getElementById('precio-ram').value) || 0;
    const precioAlmacenamiento = parseFloat(document.getElementById('precio-almacenamiento').value) || 0;

    return precioCpu + precioRam + precioAlmacenamiento;
}

function actualizarTotal() {
    const total = calcularTotal();
    const totalSpan = document.getElementById('total-presupuesto');
    const aviso = document.getElementById('aviso');

    totalSpan.textContent = `${total.toFixed(2)} €`;

    if (total > LIMITE_PRESUPUESTO) {
        aviso.textContent = ' (Supera 700€)';
    } else {
        aviso.textContent = '';
    }
}

// Get

function cargarServidores() {
    fetch(URL)
        .then(response => response.json())
        .then(data => mostrarServidores(data))
        .catch(error => console.error('Error al cargar servidores:', error));
}

function mostrarServidores(servidores) {
    const listado = document.getElementById('listado-servidores');
    listado.innerHTML = '';

    servidores.forEach(servidor => {
        listado.appendChild(crearTarjeta(servidor));
    });
}

function crearTarjeta(servidor) {
    const div = document.createElement('div');
    div.className = 'tarjeta';

    div.innerHTML = `
        <h3>${servidor.nombre}</h3>
        <p><strong>CPU:</strong> ${servidor.cpu} núcleos</p>
        <p><strong>RAM:</strong> ${servidor.ram} GB</p>
        <p><strong>Almacenamiento:</strong> ${servidor.almacenamiento}</p>
        <p><strong>Presupuesto:</strong> ${servidor.presupuesto} €</p>
        <button class="btn-eliminar">Eliminar</button>
    `;

    div.querySelector('.btn-eliminar').addEventListener('click', () => {
        eliminarServidor(servidor.id);
    });

    return div;
}

// Post 

function registrarServidor() {
    const presupuestoTotal = calcularTotal();

    if (presupuestoTotal > LIMITE_PRESUPUESTO) {
        alert('El presupuesto total no puede superar los 700€');
        return;
    }

    const nuevoServidor = {
        nombre: document.getElementById('nombre').value,
        cpu: parseInt(document.getElementById('cpu').value),
        ram: parseInt(document.getElementById('ram').value),
        almacenamiento: document.getElementById('almacenamiento').value,
        presupuesto: presupuestoTotal
    };

    fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoServidor)
    })
        .then(response => response.json())
        .then(() => {
            cargarServidores();
            document.getElementById('formulario-servidor').reset();
            actualizarTotal();
        })
        .catch(error => console.error('Error al registrar servidor:', error));
}

// Delete

function eliminarServidor(id) {
    fetch(`${URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                cargarServidores();
            }
        })
        .catch(error => console.error('Error al eliminar servidor:', error));
}
