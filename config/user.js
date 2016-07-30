module.exports = {
  username: process.env.PGO_USERNAME || 'semensemenovic79@gmail.com', // 'anatolijvasickin@gmail.com'
  password: process.env.PGO_PASSWORD || '2041651734561566042', //'adjh321kdsaasd'
  provider: process.env.PGO_PROVIDER || 'google',
  debug:    !!(process.env.DEBUG)
}
