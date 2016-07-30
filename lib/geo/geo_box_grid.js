"use strict";

const LAT_KM = 110.574
const LNG_KM = 111.320

const roundTo = 10000000

const round = (latOrLng) => {
  return Math.round( latOrLng * roundTo ) / roundTo
}

const delta = (coords, H, W, rows, cols) => {
  let lat = coords.latitude - ( H * cols / 5 )
  let lon = coords.longitude - ( W * rows / 1.75 )

  return {
    latitude:  round(lat),
    longitude: round(lon),
  }
}

const latlonToLocation = (lat, lon, alt) => {
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

const geoBoxGrid = (rows, cols, radius, location) => {
  //       3.1      3.2      _
  //        /\      /        |
  //   B   /  \ C  /         |
  //      /    \  /          |
  // 2.1 /      \/ 2.2       | H = Rlng
  //    |\      /\           |
  //    | \    /  \          |
  //    | A\  / D  \         |
  //    |   \/      \        _
  //    |  1.1      1.2
  //    |____|______|
  //     Rlat   W = 2 * Rlat
  //
  // Latitude: 1 deg = 110.574 km
  // Longitude: 1 deg = 111.320*cos(latitude) km
  //
  let extp = new Array()
  let offsetCol = true
  let rLat = radius / LAT_KM
  let rLng = radius / (LNG_KM * Math.cos(location.coords.latitude))
  let H = rLng
  let W = 2 * rLat
  let center = delta(location.coords, H, W, rows, cols)
  let originLatitude = center.latitude
  let originLongitude = center.longitude
  let currentHexLatitude, currentHexLongitude, newLocation

  for (var col = 0; col < cols; col++) {
    if (offsetCol = !offsetCol) {
      currentHexLongitude = originLongitude - W/2
    } else {
      currentHexLongitude = originLongitude
    }

    for (var row = 0; row < rows; row++) {
      currentHexLongitude += W
      currentHexLatitude = originLatitude + col * H/2

      newLocation = latlonToLocation(currentHexLatitude,currentHexLongitude,location.coords.altitude)
      extp.push(newLocation)
    }

  }
  return extp
}

module.exports = geoBoxGrid
