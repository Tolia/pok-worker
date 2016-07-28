const pokemonApi = require('./api')
const userConfig = require('../../config/user')

console.log('================================================')
console.log('|                     init                     |')
console.log('================================================')

const bail = (err) => {
  console.error(err)
  process.exit(1)
}

module.exports = (cb) => {
  pokemonApi.connect(userConfig.username, userConfig.password, userConfig.provider, (err) => {
    if (err) {
      console.log('================================================')
      console.log('|                   error                      |')
      console.log('================================================')
      bail(err)
    } else {
      console.log('================================================')
      console.log('|                  connect                     |')
      console.log('================================================')
      cb( pokemonApi.scann )
    }
  })
}
