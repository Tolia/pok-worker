"use strict";

const Pokeio = require('pokemon-go-node-api')
const getLocations = require('./geo/coordinator')
const PokemonList = require('./pokemon_list')

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


const getPokemonInfo = (pokedexNumber) => {
  return Pokeio.pokemonlist[pokedexNumber-1]
}

const getCurrentCoords = () => {
  return {
    latitude:  Pokeio.playerInfo.latitude,
    longitude: Pokeio.playerInfo.longitude,
    altitude:  Pokeio.playerInfo.altitude
  }
}

const getCurrentLocation = () => {
  return {
    type: 'coords',
    coords: getCurrentCoords()
  }
}

const getWildPokemons = (cb) => {
  let pokemons = []
  let pokemon
  let date

  Pokeio.Heartbeat((err, hb) => {
    if (err) { throw new Error(err) }
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
  })
}

const locationScanner = (location, cb) => {
  Pokeio.SetLocation(location, (err) => {
    getWildPokemons(cb)
  })
}

const scanLocation = (coord, cb) => {
  const pList = new PokemonList()
  const locations = getLocations(coord)
  const delay = 200
  let index = 0

  const recursive = () => {
    if (!locations[index]) {
      return cb(pList.toArray(), locations)
    }

    locationScanner(locations[index], (pokemons) => {
      pList.merge(pokemons)
      index += 1
      setTimeout(recursive, delay)
    })
  }
  recursive(cb)
}

module.exports = (config, location, cb) => {
  Pokeio.playerInfo.debug = config.debug

  Pokeio.init(config.pok.username, config.pok.password, location, config.pok.provider, (err) => {
    const currentLocation = getCurrentLocation()

    if (err) { throw new Error(err) }

    scanLocation(currentLocation, (pokemons, locations) => {
      cb(pokemons, currentLocation, locations)
    })
  })
}
