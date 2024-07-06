const pokedex = document.getElementById("pokedex");
console.log(pokedex);

const fetchPokemon = () => {
    const promises = [];
    for (let i =1; i<= 1025; i++) { 
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then(res => res.json()));
    }

    Promise.all(promises).then(results => {
        const pokemon = results.map( data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', '),
            abilities: data.abilities,
            stats: data.stats
        }))
        displayPokemon(pokemon);
    })
};

const displayPokemon = (pokemon) => {
    console.log(pokemon)
    const pokemonHTMLString = pokemon.map (pokeman =>`
        <li> 
            <img src="${pokeman.image}"/>
            <h2>${pokeman.id}. ${pokeman.name}</h2>
            <p>Type: ${pokeman.type}</p>
            <p>Abilities: ${pokeman.abilities.map(ability => ability.ability.name)}</p>
            <p>Base Stats:</p>
                    <ul>
                        ${pokeman.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)}
                    </ul>
        </li>
        `)
        .join('');
        pokedex.innerHTML = pokemonHTMLString;
}

fetchPokemon();