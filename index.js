"use strict";

console.log('================================================')
console.log('|                     init                     |')
console.log('================================================')
const amqp = require('./lib/amqp')
const search = require('./lib/main')

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

  console.log('|                 pok connect                  |')

  amqp.sub((event, ack) => {
    const { uid, coords } = event
    let startAt = new Date()
    let location = {
      type: 'coords',
      coords: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: Pokeio.playerInfo.altitude
      }
    }

    console.log(`event №${uid}`)

    try {
      search(location, (pokemons, currentLocation, locations) => {
        let imgLocations = Pokeio.playerInfo.debug ? locations : [currentLocation]
        const img = MapGenerator(config, pokemons, imgLocations)

        console.log(`event №${uid} - done`)

        amqp.pub({
          uid: uid,
          src: img,
          time: new Date() - startAt
        })
        ack()
      })
    } catch (e) {
      amqp.pub({
        error: e,
        time: new Date() - startAt
      })
    }
  })

})
