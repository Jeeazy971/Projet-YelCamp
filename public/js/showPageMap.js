'use strict';

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parseCampground.geometry.coordinates, // starting position [lng, lat]
    zoom: 5, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(parseCampground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${parseCampground.title}</h4><p>${parseCampground.location}</p>`,
        ),
    )
    .addTo(map);
