"use strict";

const geoHexGrid = require('./geo_hex_grid')

module.exports = (locationStart) => {
  let period = 5
  let radius = 0.15 //km

  let list = geoHexGrid(period, period, radius, locationStart)

  return list
}
