document.addEventListener('DOMContentLoaded', function() {
const searchInput = document.getElementById('search-input');
const pokedex = document.getElementById("pokedex");
console.log(pokedex);

let pokemon = [];
let filteredPokemon = [];

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
    console.log(pokemon)
    const pokemonHTMLString = pokemon.map (pokemon =>`
        <div class="card"> 
            <img src="${pokemon.image}"/>
            <h2>${pokemon.id}. ${pokemon.name}</h2>
            <p>Type: ${pokemon.type}</p>
            <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name)}</p>
            <p>Base Stats:</p>
                    <ul>
                        ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)}
                    </ul>
        </div>
        `)
        .join('');
        pokedex.innerHTML = pokemonHTMLString;
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
    displayPokemon(filteredPokemon); // Display the filtered or all characters
    console.log(pokemon)
}

// Search functionality
searchInput.addEventListener('input', function() {
    filterPokemon(this.value);
});

fetchPokemon();
})