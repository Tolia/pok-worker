const main = require('./lib/main')

const event = {
  uid: 0,
  coords: {
    latitude: 55.75362,
    longitude: 37.62256,
  }
}

main((api) => {
  const { uid, coords } = event
  console.log(`event №${uid} - new`)

  api.search(coords, (src, time) => {
    console.log(`event №${uid} - done | time: ${ time }`)
    console.log(src)
  }, (err, time) => {
    console.log(`event №${uid} - error | time: ${ time }`)
    console.log(err)
  })
})
