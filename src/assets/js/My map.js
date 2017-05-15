/*jshint esversion: 6 */

(() => {
    'use strict';

    /*
 * declare map as a global variable
 */
var map;

/*
 * use google maps api built-in mechanism to attach dom events
 */
google.maps.event.addDomListener(window, "load", function () {

  /*
   * create map
   */
  var map = new google.maps.Map(document.getElementById("map-area"), {
    center: new google.maps.LatLng(47.645404,26.258491999999933),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  /*
   * create infowindow (which will be used by markers)
   */
  var infoWindow = new google.maps.InfoWindow();

  /*
   * marker creater function (acts as a closure for html parameter)
   */
  function createMarker(options, html) {
    var marker = new google.maps.Marker(options);

        infoWindow.setContent(html);
        infoWindow.open(options.map, marker0);

    if (html) {
      google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(options.map, this);
      });
    }
    return marker;
  }

  /*
   * add markers to map
   */
  var marker0 = createMarker({
    position: new google.maps.LatLng(47.6433993,26.248653999999988),
    map: map,
  }, "<h1>Glow Beauty Place</h1><p>0752 566 796</p>");

  var marker1 = createMarker({
    position: new google.maps.LatLng(47.6425012,26.26066620000006),
    map: map
  }, "<h1>The Makeup Academy</h1><p>0752 422 275</p>");

  var marker2 = createMarker({
    position: new google.maps.LatLng(47.642853,26.248365000000035),
    map: map
  }, "<h1>Michelle Center</h1><p>0752 556 796</p>");

  var marker3 = createMarker({
    position: new google.maps.LatLng(47.6474023,26.247684800000002),
    map: map
  }, "<h1>Carmen Style</h1><p>0230 520 888</p>");

  	/* repeat first */
    var marker0 = createMarker({
    position: new google.maps.LatLng(47.6433993,26.248653999999988),
    map: map,
  }, "<h1>Glow Beauty Place</h1><p>0752 566 796</p>");
});

})();
