const pokemonScanner = require('./pokemon/main')
const MapGenerator = require('./maps/mapbox')
const map  = require('../config/mapbox')
const amqp = require('./amqp')

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

const createMapImg = (pokemons, currentLocation, locations) => {
  let imgLocations = map.debug ? locations : [currentLocation]
  const src = MapGenerator(map, pokemons, imgLocations)

  return src
}

pokemonScanner( (scanner) => {
  amqp.sub((event, ack) => {
    const { uid, coords } = event
    let startAt = new Date()
    let location = createLocation(coords)

    console.log(`event №${uid} - new`)

    scanner(location, (err, pokemons, currentLocation, locations) => {
      if (err) {
        console.log(`event №${uid} - error`)
        amqp.pub({
          uid: uid,
          err: err,
          time: new Date() - startAt
        })
      } else if (pokemons.length == 0) {
        console.log(`event №${uid} - Pokémon not found`)
        amqp.pub({
          uid: uid,
          err: `Pokémon not found 😱`,
          time: new Date() - startAt
        })
      } else {
        console.log(`event №${uid} - done`)
        amqp.pub({
          uid: uid,
          src: createMapImg(pokemons, currentLocation, locations),
          time: new Date() - startAt
        })
      }
      ack()
    })
  })
})
