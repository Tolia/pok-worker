const PokemonGO = require('pokemon-go-node-api')
const getLocations = require('../geo/coordinator')
const PokemonList = require('./list')

// coords = {
//   latitude:  float,
//   longitude: float,
//   altitude:  init
// }
// location = {
//   type: 'coords',
//   coords: coords
// }
// pokemon = {
//   id:        str,
//   num:       str,
//   name:      str,
//   img:       str,
//   type:      str,
//   height:    str,
//   weight:    str,
//   candy:     str,
//   egg:       str,
//   latitude:  float,
//   longitude: float,
//   expiredAt: init
// }

const Pokeio = new PokemonGO.Pokeio()

const getPokemonInfo = (pokedexNumber) => {
  return Pokeio.pokemonlist[pokedexNumber-1]
}

const getWildPokemons = (cb) => {
  let pokemons = []
  let pokemon
  let date

  Pokeio.Heartbeat((err, hb) => {
    if (err) {
      console.error('ERROR: Pokeio.Heartbeat', err)
      cb()
    } else {
      date = new Date()
      hb.cells.forEach((cell) => {
        cell.WildPokemon.forEach((will) => {
          pokemon = getPokemonInfo(will.pokemon.PokemonId)
          pokemon.latitude = will.Latitude
          pokemon.longitude = will.Longitude
          pokemon.expiredAt = new Date(date).setMilliseconds( will.TimeTillHiddenMs )
          pokemons.push(pokemon)
        })
      })
      cb(pokemons)
    }
  })
}

const scanLocation = (location, cb) => {
  const pList = new PokemonList()
  const locations = getLocations(location)
  const delay = 200
  let index = 0
  let errors = []

  const recursive = () => {
    console.log(`search ${index}/${locations.length}`)

    if (!locations[index]) {
      // if (errors.length >= locations.length ) {
      //   return cb(err, pList.toArray(), locations)
      // } else {
      return cb(pList.toArray(), locations)
      // }
    }

    Pokeio.SetLocation(locations[index], (err) => {
      const next = () => { setTimeout(recursive, delay) }
      console.log(`set location: ${!err} | ${err}`)

      if (err) {
        next()
      } else {
        getWildPokemons((pokemons) => {
          console.log(`get wild pokemons: ${pokemons.length}`)
          index += 1
          if (pokemons) {
            pList.merge(pokemons)
          }
          setTimeout(recursive, delay)
        })
      }
    })
  }

  recursive(cb)
}

const baseLocation = {
  type: 'coords',
  coords: {
    latitude: 40.4731191,
    longitude: -77.3132907,
  }
}

module.exports = {
  connect: (username, password, provider, cb) => {
    Pokeio.init(username, password, baseLocation, provider, (err) => {
      cb(err)
    })
  },
  scann: (location, cb) => {
    try {
      scanLocation(location, (pokemons, locations) => {
        cb(null, pokemons, locations)
      })
    } catch (err) {
      cb(err)
    }
  }
}
