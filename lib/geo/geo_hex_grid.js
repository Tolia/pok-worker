"use strict";

const latKmConst = 110.574
const lngKmConst = 111.320

const roundTo = 10000000

const round = (latOrLng) => {
  return Math.round( latOrLng * roundTo ) / roundTo
}

const latlonToLocation = (lat,lon, alt) => {
  let location = {
    type: 'coords',
    coords: {
      latitude:  round(lat),
      longitude: round(lon),
      altitude:  alt
    }
  }
  return location
}

const correctionLoc = (location, rows, cols, radiusW, radiusH) => {
  let lat = location.coords.latitude - (rows * radiusW / 7)
  let lon = location.coords.longitude - (cols * radiusH * 0.56)
  return {
    latitude:  round(lat),
    longitude: round(lon)
  }
}

const geoHexGrid = (rows, cols, radius, location) => {
  //
  //  3.1  _____  3.2    _
  //      /     \        |
  // 2.1 /       \ 2.2   | H
  //     \       /       |
  //  1.1 \_____/ 1.2    |
  //                     -
  //      |--w--|
  //     |---W---| W = w * 3 / 2
  //
  //  3.2          A^C = 60°; B^C = 90°; B^A=30°
  //   |\          B = H/2; A = radius; C = (W - w) / 2
  // B | \ A       W = w + C * 2
  //   |  \
  //   |___\ 2.2
  //   | C /       \       /     \       /
  // B |  / A       \_____/       \_____/
  //   | /          /  w |\   W   /| w  \
  //   |/          /     | \_____/ |     \
  //  1.2                |_|     |_|
  //                      C       C
  //
  // Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitude) km
  //
  let extp = new Array()
  let offsetRow = false
  let offsetCol = false
  let H = 1.4 * radius / (lngKmConst * Math.cos(location.coords.latitude)) // toDO
  let w = 2 * radius / latKmConst
  let W = w * 5 / 3
  let C = (W - w) / 2
  let center = correctionLoc(location, rows, cols, W, H)
  let originLatitude = center.latitude
  let originLongitude = center.longitude
  let currentHexLatitude, currentHexLongitude, newLocation

  for (var col = 0; col < cols; col++) {   // колонки (longitude)
    if (offsetCol = !offsetCol) {
      currentHexLongitude = originLongitude
    } else {
      currentHexLongitude = originLongitude - C
    }
    for (var row = 0; row < rows; row++) { // строки (latitude)
      if (offsetRow = !offsetRow) {
        currentHexLongitude += w
      } else {
        currentHexLongitude += W
      }
      currentHexLatitude = originLatitude + col * H / 2

      newLocation = latlonToLocation(currentHexLatitude,currentHexLongitude,location.coords.altitude)
      extp.push(newLocation)
    }
  }
  return extp
}

module.exports = geoHexGrid
