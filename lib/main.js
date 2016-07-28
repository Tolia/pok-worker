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

pokemonScanner( (scanner) => {
  amqp.sub((event, ack) => {
    const { uid, coords } = event
    let startAt = new Date()
    let location = createLocation(coords)

    console.log(`event №${uid} - new`)

    scanner(location, (err, pokemons, currentLocation, locations) => {
      let imgLocations = map.debug ? locations : [currentLocation]
      const src = MapGenerator(map, pokemons, imgLocations)

      if (err) {
        console.log(`event №${uid} - error`)
      } else {
        console.log(`event №${uid} - done`)
      }

      amqp.pub({
        uid: uid,
        err: err,
        src: src,
        time: new Date() - startAt
      })

      ack()
    })
  })
})
