// Creating map object
var myMap = L.map("map", {
  center: [43.65, -79.38],
    zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = "static/data/Data.geojson";

var geojson;

// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "AREA_NAME",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("MLS_Number: " + feature.properties.MLS_Number + "<br>Real Estate Toronto:<br>" +
        "$" + feature.properties.Price);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Price</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});