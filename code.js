$(document).ready(function() {

  $("#globe").click(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRvaDkxIiwiYSI6IjQxN2IyMzFkNzgwODEwZjdiZGEzNzEzMTE1MjQyMzc5In0.NJQwPueh-IOZ7V14d8NILA';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
      center: [-74.50, 40], // starting position
      zoom: 9 // starting zoom
    });
    map.addControl(new mapboxgl.Navigation());
  })
})
