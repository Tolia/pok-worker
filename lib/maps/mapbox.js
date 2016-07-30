"use strict";

const geojsonToImage = require('geojson-to-image')
const config = require('../../config/mapbox')

const locationToMarker = (point) => {
  let marker = {
    type: "Feature",
    properties: {
      "marker-color": '#a3e46b',
      "marker-size":  'small',
      "marker-symbol": 'triangle'
    },
    geometry: {
      type: "Point",
      coordinates: [
        point.longitude,
        point.latitude
      ]
    }
  }

  return marker
}

const pokermonToMarker = (pokemon) => {
  let marker = locationToMarker(pokemon)

  // marker.properties = {
  //   "marker-color": '#FF0000',
  //   "marker-size":  'small',
  //   "marker-symbol": 'triangle'
  // }

  marker.properties = {
    'name': pokemon.name,
    'marker-size': [20, 20],
    'marker-url': pokemon.img,
  }

  return marker
}

module.exports = (pokemons, currentLocation, locations) => {
  const center = currentLocation.coords
  const options = {
    coordinates: [
      center.longitude,
      center.latitude
    ],
    zoom: 17,
    width: 1280,
    height: 1280,
    quality: 'png',
    maptype: 'mapbox.streets'
  }

  let geojson = {
    type: "FeatureCollection",
    features: []
  }

  if (config.debug) {
    locations.forEach((loc) => {
      geojson.features.push(
        locationToMarker(loc.coords)
      )
    })
  } else {
   geojson.features.push(
      locationToMarker(center)
    )
  }

  pokemons.forEach((pokemon) => {
    geojson.features.push(
      pokermonToMarker(pokemon)
    )
  })

  return geojsonToImage(config, geojson, options)

}
