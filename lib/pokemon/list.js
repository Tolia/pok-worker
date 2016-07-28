// pokemon =
// { id: '1',
//   num: '01',
//   name: 'Spearow',
//   img: 'http://www.serebii.net/pokemongo/pokemon/001.png',
//   type: 'Normal / Flying',
//   height: '0.30 m',
//   weight: '2.0 kg',
//   candy: '50 Spearow Candy',
//   egg: '2 km',
//   latitude: 55.694273,
//   longitude: 37.594016,
//   expiredAt: 1469188804515 },


module.exports = class PokemonList {
  constructor() {
    this.pokemons = {}
  }

  toArray() {
    let pokemons = []
    let index

    for (index in this.pokemons) {
      pokemons.push(this.pokemons[index])
    }

    return pokemons
  }

  add(pokemon) {
    let index = this.createIndex(pokemon)
    if (!this.pokemons[index]) {
      this.pokemons[index] = pokemon
    } else {
      console.log('duplication', index)
    }
  }

  merge(pokemons) {
    pokemons.forEach(function (pokemon){
      this.add(pokemon)
    }.bind(this))
  }

  createIndex(pokemon) {
    return `${pokemon.name}:${pokemon.id}:${pokemon.latitude}:${pokemon.longitude}`
  }
}
