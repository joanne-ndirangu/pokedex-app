document.addEventListener('DOMContentLoaded', function() {
const searchInput = document.getElementById('search-input');
const pokedex = document.getElementById("pokedex");
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const paginationButtons = document.getElementById('pagination-buttons')
const typeFilter = document.getElementById('type-filter');
const modal = document.getElementById('pokemonModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalType = document.getElementById('modalType');
const modalAbilities = document.getElementById('modalAbilities');
const modalStats = document.getElementById('modalStats');
const closeModalButton = document.getElementById('closeModal');

let pokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const itemsPerPage = 8;

// Fetch Pokemon data from PokeAPI
fetch(`https://pokeapi.co/api/v2/pokemon?limit=100`)
.then(res => res.json())
.then(data => {
    const fetchPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
    return Promise.all(fetchPromises);
    })
    .then(pokemonData => {
        pokemon = pokemonData.map(data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map(type => type.type.name).join(', '),
            abilities: data.abilities,
            stats: data.stats
        }));
        filteredPokemon = pokemon.slice();
        displayPage(currentPage);
    })
    .catch(error => console.error('Error fetching Pokemon:', error));

    // Function to display a page of Pokemon
    function displayPage(page) {
        pokedex.innerHTML = ''; // Clear previous content

        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedItems = filteredPokemon.slice(start, end);

        paginatedItems.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            pokedex.appendChild(card);
        });

    // Update pagination buttons
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = end >= filteredPokemon.length;

    updatePagination();
    }

    function createPokemonCard(pokemon) {
        // console.log(pokemon)
        const card = document.createElement('div');
        card.className = 'col mb-4'
        card.innerHTML = `
            <div class="character-card p-4"> 
                <img src="${pokemon.image}" alt="${pokemon.name}"/>
                <h2>${pokemon.id}. ${pokemon.name}</h2>
                <p>Type: ${pokemon.type}</p>
                <button class="view-details bg-blue-700 hover:bg-sky-300 text-white font-bold py-2 px-4 rounded my-2">View Details</button>
                    <div class="character-details hidden">
                        <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(',')}</p>
                        <p>Base Stats:</p>
                            <ul>
                                ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                            </ul>        
                    </div>
            </div>
            `;

        // Click functionality to toggle details
        card.querySelector('.view-details').addEventListener('click', function() {
            modalImage.src = pokemon.image;
            modalTitle.textContent = `${pokemon.id}. ${pokemon.name}`;
            modalType.textContent = `Type: ${pokemon.type}`;
            modalAbilities.textContent = `Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`;
            modalStats.innerHTML = `Base Stats:<ul>${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>`;

        // Display modal
        modal.classList.remove('hidden');
        });

    return card;
    }

      // Close modal functionality
      closeModalButton.addEventListener('click', function() {
        modal.classList.add('hidden');
    });

    // Function to filter Pokemon based on search term
    function filterPokemon(searchTerm) {
        searchTerm = searchTerm.trim().toLowerCase();

        if (searchTerm === '') {
            // If search term is empty, reset filteredPokemon to allPokemon
            filteredPokemon = pokemon.slice();
        } else {
            // Filter allPokemon based on search term
            filteredPokemon = pokemon.filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm) ||
                pokemon.id.toString().includes(searchTerm)
            );
        }
        // Reset pagination
        currentPage = 1;
        displayPage(currentPage);
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        filterPokemon(this.value);
    });

    // Pagination
    function updatePagination() {
        paginationButtons.textContent = `${currentPage}`;
    }


    // Event listener for previous page button
    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });

    // Event listener for next page button
    nextPageButton.addEventListener('click', function() {
        if ((currentPage * itemsPerPage) < filteredPokemon.length) {
            currentPage++;
            displayPage(currentPage);
        }
    });
})
