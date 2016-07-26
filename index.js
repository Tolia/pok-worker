"use strict";

const main = require('./lib/main')
const MapGenerator = require('./lib/maps/mapbox')
const getLocations = require('./lib/geo/coordinator')
const mapBoxAuthentication = {
  mapID: 'toliademidov.0npp94id',
  accessToken: 'pk.eyJ1IjoidG9saWFkZW1pZG92IiwiYSI6ImNpcXh4YWpkYjAwNWdpNW5udW8zajd3aHQifQ.wj-Gm7n2nIUAEDfKOecrDw'
}

exports.handler = (event, context, callback) => {
  const location = {
    type: 'name',
    name: event.pgoLocation
  }
  const pok = {
    username: event.pgoUsername,
    password: event.pgoPassword,
    provider: event.pgoProvider
  }
  const config = {
    debug: event.debug,
    mapBoxAuthentication: mapBoxAuthentication,
    pok: pok
  }

  try {
    main(config, location, (pokemons, centerLocation, scanLocations) => {
      let locations = [centerLocation]
      let img = MapGenerator(config, pokemons, locations)
      callback(null, img)
    })
  }
  catch(err) {
    callback(err, null)
  }
}

