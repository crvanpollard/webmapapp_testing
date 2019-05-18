  var RSE;
  var TSP;
  var menu = document.getElementById('menu');
  var info = document.getElementById('info');
  var geojson;

  function toggleLayer(id)
        {
            if ($('#'+id).is(':checked')) {
            map.setLayoutProperty(id, 'visibility', 'visible');
            }
            else
            {
            map.setLayoutProperty(id, 'visibility', 'none');
            }
        }
  // This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
          this.parentNode.removeChild(this);
      }
    };
  }

// open/close legend
   $(function () {
      $('.glyphicon').unbind('click');
      $('.glyphicon').click(function (e) {
      $(this).toggleClass('glyphicon glyphicon-plus glyphicon glyphicon-minus');
      $('.content-one').slideToggle('slow'); return false;
  });
    });

  mapboxgl.accessToken = 'pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6ImNqMHdvdnd5MTAwMWEycXBocm4zbXVjZm8ifQ.3zjbFccILu6mL7cOTtp40A';

  // This adds the map
  var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v9', 
    center: [ -75.170669,39.950143], 
    bearing: 20, // Rotate Philly ~9° off of north, thanks Billy Penn.
    pitch: 50,
    zoom: 9,
     attributionControl: false
  });

    function goHome() {
      // debugger
      if (map.loaded()) {
        var p = map.getPitch();
     //   console.log(p);
        if (p > 0) {
          map.flyTo({
            center: [-75.170669,39.950143], 
            zoom: 9,
            speed: 0.1,
            bearing: -5,
            pitch: 35
          });
        }
      }
    }

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(),['top-left']);
map.addControl(new mapboxgl.AttributionControl(),'bottom-right');

var stateLegendEl = document.getElementById('mrp-categories');

// Zoom to Extent
document.getElementById('zoomtoregion').addEventListener('click', function () {
    map.flyTo({
        center: [ -75.170669,39.950143], 
            zoom: 9,
            speed: 0.5,
            bearing: -5,
            pitch: 35
    });
});

// curb cuts layer
map.on('load', function () {

    map.addLayer({
        'id': 'TSP',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': TSP
        },
        'paint': {
            'circle-radius': 4,
            'circle-stroke-color' : '#ffffff',
            'circle-stroke-width': 1,
            'circle-color': 'rgba(105,136,58,.8)'
            }
        });
      map.addLayer({
        "id": "TSP-hover",
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': TSP
        },
        'paint': {
            'circle-radius': 6,
            'circle-color': 'red'
           
        },
        "filter": ["==", "FACILITY", ""]
    });

    // When the user moves their mouse over the states-fill layer, we'll update the filter in
    // the state-fills-hover layer to only show the matching state, thus making a hover effect.
    map.on('mousemove', 'TSP', function (e) {
        map.setFilter('TSP-hover', ['==', 'FACILITY', e.features[0].properties.FACILITY]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on('mouseleave', 'TSP', function (e) {
        map.setFilter('TSP-hover', ['==', 'FACILITY', '']);
    });
 // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'TSP', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['TSP']
      });

      if (!features.length) {
        return;
      }

      var feature = features[0];
        var content = '<h4 style="color:white;background-color:rgb(105,136,58);padding: 3px;">'+ feature.properties.FACILITY+'</h4>'
        +'<B>Project Scope:</B> '+ feature.properties.PROJSCOPE  
        +'<br><B>Location:</B> '+ feature.properties.LOC
        +'<br><B>State:</B> '+ feature.properties.State
        +'<br><B>Timing:</B> '+ feature.properties.Timing
        +'<br><table class="infotable"><thead><tr><th>Total Funded Cost<br><i>(millions in Y-O-E $)</i></th><th>Unfunded Cost<br><i>(millions in 2013 $)</i></th></tr></thead>'
        +'<tbody><tr><td>'+ numeral(feature.properties.FundCost).format('($0,0.0)') +'</td><td> '+ numeral(feature.properties.UnfundCost).format('($0,0.0)') +'</td></tr></tbody>'
        +'</table><br>'
        ;
      info.innerHTML = content;

      map.flyTo({
        center: feature.geometry.coordinates,
        pitch: 50,
        zoom: 14
      }); 

    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'TSP', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'TSP', function () {
        map.getCanvas().style.cursor = '';
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'TSP', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.FACILITY)
            .addTo(map);
    });

    map.on('mouseleave', 'TSP', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    });


// walk about layer
map.on('load', function () {

    map.addLayer({
        "id": "RSE",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": RSE
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
         //   "line-color": "#24527F",
            "line-width": 4,
            "line-color": {
            "type": "identity",
             "property": "color"
           }
        }
    });
    map.addLayer({
        "id": "RSE-hover",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": RSE
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "red",
            "line-width": 8
        },
        "filter": ["==", "FACILITY", ""]
    });

    // When the user moves their mouse over the states-fill layer, we'll update the filter in
    // the state-fills-hover layer to only show the matching state, thus making a hover effect.
    map.on("mousemove", "RSE", function(e) {
        map.setFilter("RSE-hover", ["==", "FACILITY", e.features[0].properties.FACILITY]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "RSE", function() {
        map.setFilter("RSE-hover", ["==", "FACILITY", ""]);
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'RSE', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['RSE']
      });

      if (!features.length) {
        return;
      }

      var feature = features[0];
        
      var content = '<h4 style="color:white;padding: 3px;background-color:'+ feature.properties.color +'">'+ feature.properties.FACILITY+'</h4>'
        +'<B>Project Scope:</B> '+ feature.properties.PROJSCOPE  
        +'<br><B>Location:</B> '+ feature.properties.LOC
        +'<br><B>State:</B> '+ feature.properties.State
        +'<br><B>Timing:</B> '+ feature.properties.Timing
        +'<br><table class="infotable"><thead><tr><th>Total Funded Cost<br><i>(millions in Y-O-E $)</i></th><th>Unfunded Cost<br><i>(millions in 2013 $)</i></th></tr></thead>'
        +'<tbody><tr><td>'+ numeral(feature.properties.FundCost).format('($0,0.0)') +'</td><td> '+ numeral(feature.properties.UnfundCost).format('($0,0.0)') +'</td></tr></tbody>'
        +'</table><br>'
        ;
      info.innerHTML = content;

      map.flyTo({
        center: [feature.properties.LONG,feature.properties.LAT],
        pitch: 50,
        zoom: 11
      }); 

    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'RSE', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'RSE', function () {
        map.getCanvas().style.cursor = '';
    });

 // change info window on hover
    map.on('mousemove', function (e) {
        var RSEMAP = map.queryRenderedFeatures(e.point, {
            layers: ['RSE']
        });

        if (RSEMAP.length > 0) {
            document.getElementById('pn').innerHTML =  RSEMAP[0].properties.Name ;
        } else {
            document.getElementById('pn').innerHTML = '<p>Hover over a project!</p>';
        }
    });

});

   


      




