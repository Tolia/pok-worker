const PokemonGO = require('pokemon-go-node-api')
const getLocations = require('../geo/coordinator')
const PokemonList = require('./list')
const proxyConfig = require('../../config/proxy')

console.log('proxy config:', proxyConfig)

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
Pokeio.playerInfo.proxyOptions = proxyConfig

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
      cb(err, null)
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
      cb(null, pokemons)
    }
  })
}

const scanLocation = (location, cb) => {
  const pList = new PokemonList()
  const locations = getLocations(location)
  const delay = 10
  let index = 0
  let errors = []

  const recursive = () => {
    if (!locations[index]) {
      // if (errors.length >= locations.length ) {
      //   return cb(err, pList.toArray(), locations)
      // } else {
      return cb(pList.toArray(), locations)
      // }
    }

    Pokeio.SetLocation(locations[index], (err) => {
      const next = () => { setTimeout(recursive, delay) }

      if (err) {
        next()
      } else {
        getWildPokemons((err, pokemons) => {
          index += 1
          if (pokemons) {
            console.log(`[${index}/${locations.length}] get wild pokemons: ${pokemons.length}`)
            pList.merge(pokemons)
          } else {
            console.log(`[${index}/${locations.length}] get wild pokemons - err: ${err}`)
          }
          next()
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
    scanLocation(location, (pokemons, locations) => {
      cb(null, pokemons, locations)
    })
  }
}
