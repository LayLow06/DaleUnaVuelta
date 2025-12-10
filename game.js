document.addEventListener('DOMContentLoaded', () => {
    const clueDisplay = document.getElementById('displayClue');
    const gridJugadores = document.getElementById('gridJugadores');
    const overlayCard = document.getElementById('overlayCard');
    const displayCategory = document.getElementById('displayCategory');
    const displayWord = document.getElementById('displayWord');
    const btnCloseOverlay = document.getElementById('btnCloseOverlay');

    const btnRevealImpostor = document.getElementById('btnRevealImpostor');
    const impostorNameDisplay = document.getElementById('impostorNameDisplay');
    const btnNextRound = document.getElementById('btnNextRound');

    let playersData = JSON.parse(localStorage.getItem('datosPartida'));
    let wordDatabase = [];
    let currentImpostorName = "";

    if (!playersData) {
        window.location.href = 'index.html';
        return;
    }

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar data.json");
            }
            return response.json();
        })
        .then(data => {
            wordDatabase = data;
            startRound();
        })
        .catch(error => {
            console.error(error);
        });

    const startRound = () => {
        gridJugadores.innerHTML = '';
        let cardsClickedCount = 0;
        document.querySelector('.mostrarComienzo').innerHTML = '';

        btnRevealImpostor.classList.remove('revealed');
        btnRevealImpostor.style.pointerEvents = 'auto';
        btnRevealImpostor.style.color = '#dc3545';

        impostorNameDisplay.style.display = 'none';
        impostorNameDisplay.textContent = '';

        const randomIndex = Math.floor(Math.random() * playersData.length);

        const currentPlayers = playersData.map((player, index) => {
            return {
                ...player,
                rol: index === randomIndex ? 1 : 0
            };
        });

        currentImpostorName = currentPlayers.find(p => p.rol === 1).nombre;

        const currentSecret = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];

        currentPlayers.forEach(player => {
            const divCol = document.createElement('div');
            divCol.className = 'col-12 col-sm-6 col-md-4 mb-4';

            divCol.innerHTML = `
                <div class="card card-player shadow-sm h-100 text-center p-3" data-rol="${player.rol}">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center">
                        <h3 class="card-title fw-bold">${player.nombre}</h3>
                        <p class="small mb-0">Toca para ver tu palabra</p>
                    </div>
                </div>
            `;

            cardsClickedCount++;

            if (cardsClickedCount === currentPlayers.length) {
                const randomStarter = currentPlayers[Math.floor(Math.random() * currentPlayers.length)];
                document.querySelector('.mostrarComienzo').innerHTML = `<h1>EMPIEZA ${randomStarter.nombre.toUpperCase()}</h1>`;
            }

            divCol.querySelector('.card-player').addEventListener('click', function () {
                if (this.classList.contains('clicked-card')) return;

                const esImpostor = parseInt(this.getAttribute('data-rol')) === 1;

                displayCategory.textContent = `Categoría: ${currentSecret.category}`;

                if (esImpostor) {
                    displayWord.textContent = "IMPOSTOR";
                    displayWord.classList.add('impostor-text');
                    clueDisplay.textContent = 'Tu Pista: ' + currentSecret.hint;
                } else {
                    displayWord.textContent = currentSecret.word;
                    displayWord.classList.remove('impostor-text');
                    clueDisplay.textContent = '';
                }

                overlayCard.style.display = 'flex';

                this.classList.add('clicked-card');
                this.querySelector('p').textContent = 'Visto';
            });

            gridJugadores.appendChild(divCol);
        });
    };

    btnRevealImpostor.addEventListener('click', () => {
        btnRevealImpostor.classList.add('revealed');
        btnRevealImpostor.style.color = '#000000';

        impostorNameDisplay.innerHTML = `El impostor era: <span class="text-danger">${currentImpostorName}</span>`;
        impostorNameDisplay.style.display = 'block';

        btnRevealImpostor.style.pointerEvents = 'none';
    });

    btnCloseOverlay.addEventListener('click', () => {
        overlayCard.style.display = 'none';
    });

    btnNextRound.addEventListener('click', startRound);
});



