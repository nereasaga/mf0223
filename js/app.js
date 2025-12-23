'use strict';

const URL = 'https://694a4f311282f890d2d842e6.mockapi.io/servidores/servidor';

document.addEventListener('DOMContentLoaded', function() {
    cargarServidores();

    document.getElementById('formulario-servidor').addEventListener('submit', function(event) {
        event.preventDefault();
        registrarServidor();
    });
});

function cargarServidores() {
    fetch(URL)
        .then(response => response.json())
        .then(servidores => {
            mostrarServidores(servidores);
        })
        .catch(error => {
            console.error('Error al cargar servidores: ', error);
        });
}

function mostrarServidores(servidores) {
    const listado = document.getElementById('listado-servidores');
    listado.innerHTML = '';

    servidores.forEach(servidor => {
        const tarjeta = crearTarjeta(servidor);
        listado.appendChild(tarjeta);
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
        <p><strong>Presupuesto:</strong> ${servidor.presupuesto}€</p>
    `;

    return div;
}

// Post
function registrarServidor() {
    const presupuesto = parseInt(document.getElementById('presupuesto').value);

    if (presupuesto > 700) {
        alert('El presupuesto no puede superar los 700€');
        return;
    }

    const nuevoServidor = {
        nombre: document.getElementById('nombre').value,
        cpu: parseInt(document.getElementById('cpu').value),
        ram: parseInt(document.getElementById('ram').value),
        almacenamiento: document.getElementById('almacenamiento').value,
        presupuesto: presupuesto
    };

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoServidor)
    })
    .then(response => response.json())
    .then(data => {
        cargarServidores();
        document.getElementById('formulario-servidor').reset();
    })
    .catch(error => {
        console.error('Error al registrar servidor: ', error);
    });
}
