module.exports = {
  socksHost: process.env.POK_TORPROXY_PORT_9050_TCP_ADDR || 'localhost',
  socksPort: process.env.POK_TORPROXY_PORT_9050_TCP_PORT || 9050
}
