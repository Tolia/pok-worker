const main = require('./lib/main')
const amqp = require('./lib/amqp')

console.log('================================================')
console.log('|                start worker                   |')
console.log('================================================')

main((api) => {
  console.log('================================================')
  console.log('|                amqp connect                  |')
  console.log('================================================')


  amqp.sub((event, ask) => {
    const { uid, coords } = event
    console.log(`event №${uid} - new`)

    api.search(coords, (src, time) => {
      console.log(`event №${uid} - done | time: ${ time }`)
      amqp.pub({ uid: uid, src: src, time: time })
      ask()
    }, (err, time) => {
      console.log(`event №${uid} - error | time: ${ time } | error: ${err}`)
      amqp.pub({ uid: uid, err: err, time: time })
      ask()
    })
  })
})

process.on('exit', (code) => {
  console.log(`exit ${code}`)
});
