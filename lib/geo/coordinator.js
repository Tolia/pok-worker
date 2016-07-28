"use strict";

//const geoHexGrid = require('./geo_hex_grid')
const geoGrid = require('./geo_box_grid')

module.exports = (location) => {
  let radius = 0.2 //km
  let cols = 6
  let rows = 4

  let list = geoGrid(rows, cols, radius, location)

  return list
}
