const pokemonApi = require('./api')
const userConfig = require('../../config/user')

console.log('================================================')
console.log('|                  pok init                    |')
console.log('================================================')

const ERRORS = {
  NOT_FOUND:   'NOT_FOUND',
  SCANN_ERROR: 'SCANN_ERROR'
}

class ApiWrapper {
  constructor(api, user, pass, provider) {
    this.api = api
    this.username = user
    this.password = pass
    this.provider = provider
  }

  search(location, cbS, cbE) {
    this.connect(function(){
      this.api.scann(location, (err, pokemons, locations) => {
        if (err) {
          console.log(`pok search: ${ERRORS.SCANN_ERROR} ${location}`)
          cbE(ERRORS.SCANN_ERROR)
        } else if (!pokemons || pokemons.length == 0) {
          console.log(`pok search: ${ERRORS.NOT_FOUND} ${location}`)
          cbE(ERRORS.NOT_FOUND)
        } else {
          console.log(`pok search: done`)
          cbS(pokemons, locations)
        }
      })
    }.bind(this), cbE)
  }

  connect(cbS, cbE) {
    console.log('pok - init sessions')
    this.api.connect(this.username, this.password, this.provider, (err) => {
      if (err) {
        console.log(`pok - error: ${err}`)
        cbE(err)
      } else {
        console.log('pok - connect')
        cbS()
      }
    })
  }
}

const apiWrapper = new ApiWrapper(pokemonApi, userConfig.username, userConfig.password, userConfig.provider)

module.exports = apiWrapper
