$(document).ready(function() {
  var color = "#123456";
  var lat = '';
  var long = '';
  var toggle = "visible";

  // //Now this is doing something
  //   $.ajax('https://raw.githubusercontent.com/cmtoomey/WorldWorld/master/Starbucks.csv', {
  //     success: function(csv, status, req) {
  //       csv2geojson.csv2geojson(csv, {
  //         latfield: 'Latitude',
  //         lonfield: 'Longitude',
  //         delimiter: ','
  //         }, function(err, geojson) {
  //           console.log(geojson)
  // //This is where your geojson is returned ^^
  //       });
  //     },
  //     error: function(req, status, error) {
  //     }
  //   });

  function getGeo() {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position.coords.latitude, position.coords.longitude);
      lat = position.coords.latitude;
      long = position.coords.longitude;
      console.log(long, lat);
    });
  }

  getGeo();

  $("#globe").click(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWJsaWNrIiwiYSI6IjM5anE0eTQifQ.XfwI7Wcu7EFKoKiTQldy5Q';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/datablick/cigcgknf400009ilyxy7b2375',
      center: [long, lat], // starting position
      zoom: 10 // starting zoom
    });
    var url = 'https://raw.githubusercontent.com/cmtoomey/WorldWorld/master/Starbucks.geojson';
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
        "paint": {
          "circle-color": color,
          "circle-radius": "12",
          "circle-opacity": .5,
          "circle-blur": .25
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
            .setHTML('<h1>' + features[0].properties.Brand + ' Store Number: ' + features[0].properties.Store_Number + '</h1>' + '\n' + '<h2>' + features[0].properties.Name + '</h2>' + '\n' + '<h3>' + 'Type: ' + features[0].properties.Ownership_Type + '</h3>' + '<address>' + features[0].properties.Street_Address + '<br>' + features[0].properties.City + ', ' + features[0].properties.State + " " + features[0].properties.ZIP + '</address>' + '<h4>' + features[0].properties.Phone_Number + '</h4>')
            .addTo(map);
        }
      });
    });
    $('#logo').click(function() {
      map.setPaintProperty('water', 'fill-color', '#f03b20')
    });

  });
})
