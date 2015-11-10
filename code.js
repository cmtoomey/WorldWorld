$(document).ready(function() {
  $("#radio").buttonset();
  var color = "#123456";
  var lat = '';
  var long = '';
  var toggle = "visible";
  var search = '';

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
      lat = position.coords.latitude;
      long = position.coords.longitude;
    });
  }

  getGeo();

  $("#globe").click(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF0YWJsaWNrIiwiYSI6IjM5anE0eTQifQ.XfwI7Wcu7EFKoKiTQldy5Q';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/datablick/cigpi9ljm003wa6kswn149dry',
      center: [long, lat], // starting position
      zoom: 10 // starting zoom
    });
    var url = 'https://raw.githubusercontent.com/cmtoomey/WorldWorld/master/Starbucks.geojson';
    var source = new mapboxgl.GeoJSONSource({
      data: url
    });

    function searchValue() {
      raw = document.getElementById("geocoder").value;
      processed = raw.split(' ').join('+');
      geocoder = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + processed + '.json?access_token=pk.eyJ1IjoiY210b29tZXkiLCJhIjoiUWQyeTJqMCJ9.MFgvZXmgNt6WzrzP9kJgUA';
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": geocoder,
        "method": "GET"
      }

      $.ajax(settings).done(function(response) {
        center = response.features[0].geometry.coordinates;
        map.flyTo({
          center: center,
          zoom: 12,
          bearing: 0,
          speed: .75,
          curve: .80,
        })
      });
    };

    $(document).keypress(function(e) {
    if(e.which == 13) {
        //alert('You pressed enter!');
        searchValue();
      }
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
          "circle-opacity": .75,
          "circle-blur": .15
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

  });
})
