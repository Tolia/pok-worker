const pokemonApi = require('./api')
const userConfig = require('../../config/user')

console.log('================================================')
console.log('|                  pok init                    |')
console.log('================================================')

const bail = (err) => {
  console.error(err)
  process.exit(1)
}

module.exports = (cb) => {
  pokemonApi.connect(userConfig.username, userConfig.password, userConfig.provider, (err) => {
    if (err) {
      console.log('================================================')
      console.log('|                  pok error                   |')
      console.log('================================================')
      bail(err)
    } else {
      console.log('================================================')
      console.log('|                 pok connect                  |')
      console.log('================================================')
      cb( pokemonApi )
    }
  })
}
