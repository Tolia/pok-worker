const MapGenerator = require('./lib/maps/mapbox')
const main = require('./lib/main')
const mocks = require('./mock/index')
const pokemons = mocks.pokemons
const src = MapGenerator(mocks.pokemons, mocks.location, [])


console.log(src)
