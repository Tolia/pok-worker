"use strict";

const pokApi = require('./pokemon/api_wrapper')
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

module.exports = (cb) => {
  const search = (coords, cbS, cbE) => {
    let startAt = new Date()
    let endedAt, src
    let searchLocation = createLocation(coords)

    pokApi.search(searchLocation, (pokemons, locations) => {
      endedAt = new Date() - startAt
      src = MapGenerator(pokemons, searchLocation, locations)
      cbS(src, endedAt)
    }, (err) => {
      endedAt = new Date() - startAt
      cbE(err, endedAt)
    })
  }

  cb({
    search: search
  })
}
