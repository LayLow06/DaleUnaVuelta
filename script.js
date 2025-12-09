document.addEventListener('DOMContentLoaded', () => {
    const inputCantidad = document.getElementById('cantidadJugadores');
    const btnGenerar = document.getElementById('btnGenerar');
    const btnSortear = document.getElementById('btnSortear');
    const contenedorCards = document.getElementById('contenedorCards');

    let cantidadActual = 0;

    const generarCardsJugadores = () => {
        const cantidad = parseInt(inputCantidad.value);
        
        if (isNaN(cantidad) || cantidad < 3 || cantidad > 12) {
            alert("Por favor introduce un número entre 3 y 12.");
            contenedorCards.innerHTML = ''; 
            btnSortear.style.display = 'none'; 
            return;
        }

        cantidadActual = cantidad;
        contenedorCards.innerHTML = '';

        for (let i = 1; i <= cantidad; i++) {
            const cardHTML = `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h4>Jugador ${i}</h4>
                            <div class="mb-3">
                                <label for="nombreJugador${i}" class="form-label">Nombre:</label>
                                <input type="text" 
                                    class="form-control input-nombre" 
                                    id="nombreJugador${i}" 
                                    placeholder="Nombre..." 
                                    required>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contenedorCards.innerHTML += cardHTML;
        }

        btnSortear.style.display = 'block';
    };

    const realizarSorteo = () => {
        let listaJugadores = [];

        for (let i = 1; i <= cantidadActual; i++) {
            const inputNombre = document.getElementById(`nombreJugador${i}`);
            const nombre = inputNombre.value.trim();

            if (nombre === "") {
                alert(`¡Falta el nombre del Jugador ${i}!`);
                return;
            }

            listaJugadores.push({
                id: i,
                nombre: nombre,
                rol: 0 
            });
        }

        const indiceImpostor = Math.floor(Math.random() * listaJugadores.length);
        listaJugadores[indiceImpostor].rol = 1;

        localStorage.setItem('datosPartida', JSON.stringify(listaJugadores));
        window.location.href = 'game.html';
    };

    btnGenerar.addEventListener('click', generarCardsJugadores);
    btnSortear.addEventListener('click', realizarSorteo);
});
