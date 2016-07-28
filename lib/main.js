"use strict";

const pokemonConnector = require('./pokemon/connector')
const MapGenerator = require('./maps/mapbox')
const map = require('../config/mapbox')

const createLocation = (coords) => {
  let location = {
    type: 'coords',
    coords: {
      latitude:  coords.latitude,
      longitude: coords.longitude,
      altitude:  0
    }
  }

  return location
}

const ERRORS = {
  NOT_FOUND:   'NOT_FOUND',
  SCANN_ERROR: 'SCANN_ERROR'
}

module.exports = (cb) => {
  pokemonConnector((api) => {
    let APIdecorator = {}

    APIdecorator.search = (coords, cbS, cbE) => {
      let startAt = new Date()
      let endedAt, src
      let searchLocation = createLocation(coords)

      api.scann(searchLocation, (err, pokemons, locations) => {
        if (err) {
          console.error(err)
          endedAt = new Date() - startAt
          cbE(ERRORS.SCANN_ERROR, endedAt)
        } else if (pokemons.length == 0) {
          endedAt = new Date() - startAt
          cbE(ERRORS.NOT_FOUND, endedAt)
        } else {
          src = MapGenerator(pokemons, searchLocation, locations)
          endedAt = new Date() - startAt
          cbS(src, endedAt)
        }
      })
    }

    cb(APIdecorator)
  })
}
