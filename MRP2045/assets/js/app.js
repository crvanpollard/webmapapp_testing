  var exp_rd, pr_transit_pts;

  //  color = feature.getProperty("VisionType") == 'Roadway - Funded' ? '#24527F' : '#90ABD9'
  // dark blue  #24527F  rgb(36,82,127)
  // light blue #90ABD9 rgb(144,171,217)

 //   color = feature.getProperty("VisionType") == 'Transit - Funded' 
 // dark green '#69883A' rgb(105,136,58)
 // light green '#B4CA8B' rgb(180,202,139)
 // 'Externally Funded' ? '#795300' : '#B4CA8B'

  var menu = document.getElementById('menu');
  var info = document.getElementById('info');
  var geojson;

  $(document).ready(function() {
    //OPEN ABOUT DIALOG
 //   $('#aboutModal').modal(); 
  });

  function toggleLayer(id)
        {
            if ($('#'+id).is(':checked')) {
              //  dataLayer.setMap(map);
                       map.setLayoutProperty(id, 'visibility', 'visible');
          //  map.setLayoutProperty(id, 'visibility', 'none');
         //   this.className = '';
            }
            else
            {
        //    this.className = 'active';
           // map.setLayoutProperty(id, 'visibility', 'visible');
                map.setLayoutProperty(id, 'visibility', 'none');
            //    dataLayer.setMap(null);
            }
        }

 // $(document).on('hide.bs.modal','#aboutModal', function () {
//    setTimeout(goHome, 2000);
//  });
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
    container: "map", 
    style: 'mapbox://styles/mapbox/light-v9', 
 //   style:'mapbox://styles/mapbox/outdoors-v10',
  //style: 'mapbox://styles/crvanpollard/ciyd8fyqo008j2rqfku4qxcb9',
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

var stateLegendEl = document.getElementById('extent');

// Zoom to Extent
document.getElementById('export').addEventListener('click', function () {
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
        'id': 'pr_transit_pts',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': pr_transit_pts
        },
        'paint': {
            'circle-radius': 4,
            'circle-stroke-color' : '#ffffff',
            'circle-stroke-width': 1,
            'circle-color': 'rgba(105,136,58,.8)'
           
            }
        });
      map.addLayer({
        "id": "pr_transit_pts-hover",
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': pr_transit_pts
        },
        'paint': {
            'circle-radius': 6,
          //  'circle-stroke-color' : '#ffffff',
          //  'circle-stroke-width': 1,
            'circle-color': 'red'
           
        },
        "filter": ["==", "FACILITY", ""]
    });

    // When the user moves their mouse over the states-fill layer, we'll update the filter in
    // the state-fills-hover layer to only show the matching state, thus making a hover effect.
    map.on("mousemove", "pr_transit_pts", function(e) {
        map.setFilter("pr_transit_pts-hover", ["==", "FACILITY", e.features[0].properties.FACILITY]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "pr_transit_pts", function() {
        map.setFilter("pr_transit_pts-hover", ["==", "FACILITY", ""]);
    });
 // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'pr_transit_pts', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['pr_transit_pts']
      });

      if (!features.length) {
        return;
      }

      var feature = features[0];
        var content = '<div><strong>' + feature.properties.FACILITY + '</strong>' +
                  '<p>' + feature.properties.FundCost + '</p></div>';

    info.innerHTML = content;

  map.flyTo({
        center: feature.geometry.coordinates,
        pitch: 50,
        zoom: 14
      }); 

    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'pr_transit_pts', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'pr_transit_pts', function () {
        map.getCanvas().style.cursor = '';
    });

    });


// walk about layer
map.on('load', function () {

    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": exp_rd
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
        "id": "route-hover",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": exp_rd
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
    map.on("mousemove", "route", function(e) {
        map.setFilter("route-hover", ["==", "FACILITY", e.features[0].properties.FACILITY]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    map.on("mouseleave", "route", function() {
        map.setFilter("route-hover", ["==", "FACILITY", ""]);
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'route', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['route']
      });

      if (!features.length) {
        return;
      }

      var feature = features[0];
        
        var content = '<h4 style="color:white;background-color:'+ feature.properties.color +'"><img style="margin:0px 0px 0px 0px" src="'+feature.properties.TYPE_IMG+'"/>' + feature.properties.FACILITY+'</h4>'
        +'<B>Project Scope:</B> '+ feature.properties.PROJSCOPE  
        +'<br><B>Location:</B> '+ feature.properties.LOC
    +'<br><B>State:</B> '+ feature.properties.State
    +'<br><B>Timing:</B> '+ feature.properties.Timing
    +'<br><table class="infotable"><thead><tr><th>Total Funded Cost<br><i>(millions in Y-O-E $)</i></th><th>Unfunded Cost<br><i>(millions in 2013 $)</i></th></tr></thead>'
    +'<tbody><tr><td>'+ numeral(feature.properties.FundCost).format('($0,0.0)') +'</td><td> '+ numeral(feature.properties.UnfundCost).format('($0,0.0)') +'</td></tr></tbody>'
    +'</table><br>'
     ;

     //  $('#infosidebar').html(content);
   //     var content = '<div><strong>' + feature.properties.FACILITY + '</strong>' +
   //               '<p>' + feature.properties.FundCost + '</p></div>';

        info.innerHTML = content;

      map.flyTo({
        center: [feature.properties.LONG,feature.properties.LAT],
        pitch: 50,
        zoom: 11
      }); 

    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'route', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'route', function () {
        map.getCanvas().style.cursor = '';
    });
});

    // change info window on hover
    map.on('mousemove', function (e) {
        var states = map.queryRenderedFeatures(e.point, {
            layers: ['pr_transit_pts']
        });

        if (states.length > 0) {
            document.getElementById('pd').innerHTML =  states[0].properties.MapName ;
        } else {
            document.getElementById('pd').innerHTML = '<p>Hover over a project!</p>';
        }
    });


      




