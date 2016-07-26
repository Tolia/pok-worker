const startAt = new Date()
const APP = require('./index')

const event = {
  debug: false,
  pgoUsername: (process.env.PGO_USERNAME || 'petrivanovic101@gmail.com'), // 'anatolijvasickin@gmail.com'
  pgoPassword: (process.env.PGO_PASSWORD || '2041651734561566042'), //'adjh321kdsaasd'
  pgoProvider: (process.env.PGO_PROVIDER || 'google'),
  pgoLocation: (process.env.PGO_LOCATION || 'Russian, Moscow, Shvernika 17-3')
}

APP.handler(event, {}, (err, img) => {
  console.log(err)
  console.log(img)
  console.log('--------------------------------------------------')
  let t = new Date() - startAt
  console.log(`total: ${t} milliseconds, price: ${ (t/100) *  0.000000208 } $`)
})
