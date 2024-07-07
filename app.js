document.addEventListener('DOMContentLoaded', function() {
const searchInput = document.getElementById('search-input');
const pokedex = document.getElementById("pokedex");
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

let pokemon = [];
let filteredPokemon = [];
let currentPage = 1;
const itemsPerPage = 16;

const fetchPokemon = () => {
    const promises = [];
    for (let i =1; i<= 1025; i++) { 
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then(res => res.json()));
    }

    Promise.all(promises)
    .then(results => {
            pokemon = results.map( data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', '),
            abilities: data.abilities,
            stats: data.stats
        }))
        displayPokemon(pokemon);
    })
    .catch(error => console.error('Error fetching Pokemon:', error));
};

const displayPokemon = (pokemon) => {
    // console.log(pokemon)
    const pokemonHTMLString = pokemon.map (pokemon =>`
        <div class="card"> 
            <img src="${pokemon.image}"/>
            <h2>${pokemon.id}. ${pokemon.name}</h2>
            <p>Type: ${pokemon.type}</p>
            <div class="character-details hidden">
                <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name)}</p>
                <p>Base Stats:</p>
                    <ul>
                        ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                    </ul>
            </div>
        </div>
        `).join('');

        pokedex.innerHTML = pokemonHTMLString;

        // Event listener to toggle details for each card
    pokedex.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const details = this.querySelector('.character-details');
            details.classList.toggle('hidden');
        });
    });
}

// Function to filter Pokemon based on search term
const filterPokemon = (searchTerm) => {
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

fetchPokemon();

// Function to display a page of Pokemon
function displayPage(page) {
    pokedex.innerHTML = ''; // Clear previous content

    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedItems = filteredPokemon.slice(start, end);

    paginatedItems.forEach(pokemon => {
        const card = displayPokemon(pokemon);
        pokedex.appendChild(card);
    });

    // Update pagination buttons
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = end >= filteredPokemon.length;
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