"use strict";

//const geoHexGrid = require('./geo_hex_grid')
const geoGrid = require('./geo_box_grid')

module.exports = (location) => {
  let period = 4
  let radius = 0.2 //km

  let list = geoGrid(period, period * 2, radius, location)

  return list
}
