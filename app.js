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
            <div class="character-card p-4 text-sky-300 bg-blue-950"> 
                <img src="${pokemon.image}" alt="${pokemon.name}"/>
                <h2 style="text-transform: capitalize;">${pokemon.id}. ${pokemon.name}</h2>
                <p style="text-transform: capitalize;"><b>Type: </b>${pokemon.type}</p>
                <button class="view-details bg-blue-950 text-sky-300 hover:bg-sky-300 hover:text-blue-950 py-2 px-4 m-1">View Details</button>
                    <div class="character-details hidden">
                        <p style="text-transform: capitalize;"><b>Abilities: </b>${pokemon.abilities.map(ability => ability.ability.name).join(',')}</p>
                        <p style="text-transform: capitalize;"><b>Base Stats: </b></p>
                            <ul style="text-transform: capitalize;">
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

       // Add click event listeners to the types
       card.querySelectorAll('.pokemon-type').forEach(typeElement => {
        typeElement.addEventListener('click', function() {
            filterByType(this.textContent);
        });
    });

    return card;
}

      // Close modal functionality
      closeModalButton.addEventListener('click', function() {
        modal.classList.add('hidden');
    });

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

   // Event listener for type filter
    typeFilter.addEventListener('change', function() {
        filterByType(this.value);
    });

    // Function to filter Pokemon by type
    function filterByType(type) {
        if (type === '') {
            filteredPokemon = pokemon.slice();
        } else {
            filteredPokemon = pokemon.filter(p => p.type.toLowerCase().includes(type.toLowerCase()));
        }

        // Reset pagination
        currentPage = 1;
        displayPage(currentPage);
    }
})
