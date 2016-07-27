"use strict";

const amqp = require('./lib/amqp')
const main = require('./lib/main')

const userConfig = require('./config/user')
const mapConfig = require('./config/mapbox')
const config = {
  debug: userConfig.debug,
  mapBoxAuthentication: mapConfig,
}

const Pokeio = require('pokemon-go-node-api')
const MapGenerator = require('./lib/maps/mapbox')
const getLocations = require('./lib/geo/coordinator')

const baseLocation = {
  type: 'name',
  name: 'Russia, Moscow'
}

const bail = (err) => {
  console.log('error ------------------------------------------')
  console.error(err)
  process.exit(1)
}

Pokeio.playerInfo.debug = config.debug

Pokeio.init(userConfig.username, userConfig.password, baseLocation, userConfig.provider, (err) => {
  if (err) { bail(err) }

  amqp.sub((uid, coords, ack) => {
    let startAt = new Date()
    let location = {
      type: 'coords',
      coords: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: Pokeio.playerInfo.altitude
      }
    }

    main(location, (pokemons, currentLocation, locations) => {
      let imgLocations = Pokeio.playerInfo.debug ? locations : [centerLocation]
      let img = MapGenerator(config, pokemons, imgLocations)

      amqp.pub({
        uid: uid,
        src: img,
        time: new Date() - startAt
      })

      ack()
    })
  })

})
