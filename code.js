$(document).ready(function() {
  var color = "#123456";
  $("#globe").click(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRvaDkxIiwiYSI6IjQxN2IyMzFkNzgwODEwZjdiZGEzNzEzMTE1MjQyMzc5In0.NJQwPueh-IOZ7V14d8NILA';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
      center: [-77.035346, 38.907757], // starting position
      zoom: 12 // starting zoom
    });
    var url = 'http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/markers.geojson';
    var source = new mapboxgl.GeoJSONSource({
      data: url
    });

    map.on('style.load', function() {
      map.addSource('drone', source);
      map.addLayer({
        "id": "drone",
        "interactive": "true",
        "type": "symbol",
        "source": "drone",
        "type": "circle",
        // "layout": {
        //   "icon-image": "marker-15",
        // },
        "paint": {
          "circle-color": color,
          "circle-radius": "25",
        }
      });
    });

    map.on('click', function(e) {
      map.featuresAt(e.point, {
        layer: 'drone',
        radius: 10,
        includeGeometry: true
      }, function(err, features) {
        if (err) throw err;
        if (features.length) {
          map.flyTo({
            center: features[0].geometry.coordinates
          });
          var tooltip = new mapboxgl.Popup()
          .setHTML('<h1>'+features[0].properties.title+'</h1>'+'\n'+'<h2>'+features[0].properties.description+'</h2>')
          .addTo(map);
        }
      });
    })

  });
})
