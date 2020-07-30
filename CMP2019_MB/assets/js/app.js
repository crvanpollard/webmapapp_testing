  var RSE;
  var CMP_PA;
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
              console.log(id);
            map.setLayoutProperty(id, 'visibility', 'visible');
            }
            else
            {
            map.setLayoutProperty(id, 'visibility', 'none');
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
    center: [ -75.170669,39.950143], 
    bearing: 0, // Rotate Philly ~9° off of north, thanks Billy Penn.
    pitch: 0,
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
            bearing: 0,
            pitch: 0
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
            bearing: 0,
            pitch: 0
    });
});


// walk about layer
map.on('load', function () {

  map.addLayer({
  id: "CMP_PA",
  type: "fill",
  source: {
            "type": "geojson",
            "data":"https://services1.arcgis.com/LWtWv6q6BJyKidj8/ArcGIS/rest/services/DVRPC_EV_Block_Group/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&geometryPrecision=4&outSR=4326&f=pgeojson"
          },
  layout: {
   visibility: "visible"
  },
  paint: {
    "fill-color": [
        "case",
        ["==", ["get", "CMP_ID"], 1],"#92D3C8",
        ["==", ["get", "CMP_ID"], 2],"#F37D80",
        ["==", ["get", "CMP_ID"], 3],"#FBF7C0",
        ["==", ["get", "CMP_ID"], 4],"#F9BDBF",
        ["==", ["get", "CMP_ID"], 5],"#FFD380",
        ["==", ["get", "CMP_ID"], 6],"#C7E6DC",
        ["==", ["get", "CMP_ID"], 7],"#D7C19E",
        ["==", ["get", "CMP_ID"], 8],"#82D4F2",
        ["==", ["get", "CMP_ID"], 9],"#DABEDB",
        ["==", ["get", "CMP_ID"], 10],"#B57DB6",
        ["==", ["get", "CMP_ID"], 11],"#FAF078",
        ["==", ["get", "CMP_ID"], 12],"#DB7DB3",
        ["==", ["get", "CMP_ID"], 13],"#D7D79E",
        ["==", ["get", "CMP_ID"], 14],"#80AEDD",
        ["==", ["get", "CMP_ID"], 15],"#9DCB3B",
        ["==", ["get", "CMP_ID"], 16],"#FFEBBE",
        ["==", ["get", "CMP_ID"], 17],"#39BF7C",
        "#cccccc"
      ],
    "fill-opacity": 0.8
  }
});


    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'CMP_PA', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['CMP_PA']
      });

      if (!features.length) {
        return;
      }

    var feature = features[0];
    var props = feature.properties;
//      var info = '<h4 style="color:white;background-color:' + (props.BANCOLOR) + '"><div class="label"><img class="shield" src="' + (props.SHIELD) + ' ">' + (props.NAME) + '</div></h4>' + "<div class='labelfield'><b>Subcorridor ID/Name: </b>" + (props.CMP_ID) + (props.SUB_ID) + " - " + (props.SUBNAME) + "<br>" + "<div class='labelfield'><b>Priority Subcorridor: </b>" + (props.PRIORITY) + "</div>";

  //    var content = '<img style="margin:0px 0px 5px 0px" src="https://www.dvrpc.org/asp/TIPsearch/2015/PA/img/document.png"/>&nbsp; - <a class="one" href="' + (props.REPORT) + '" target="_blank"> ' + "View Subcorridor Information" + "</a><br>" +
  //      '<a href="#" id="zoomToBtn" class="btn btn-primary" onclick="map.setView(new L.LatLng( ' + (props.LAT) + ' , ' + (props.LONG) + ' ),12); return false;">Zoom To Subcorridor</a>' + "</div>" + "<br></br>";
   
     var content =
        '<h4 style="color:white;background-color:' + (props.BANCOLOR) + '"><div class="label"><img class="shield" src="' + (props.SHIELD) + ' ">' + (props.NAME) + '</div></h4>' + "<div class='labelfield'><b>Subcorridor ID/Name: </b>" + (props.CMP_ID) + (props.SUB_ID) + " - " + (props.SUBNAME) + "<br>" + "<div class='labelfield'><b>Priority Subcorridor: </b>" + (props.PRIORITY) + "</div>";
        
        
     // info.innerHTML = info;  
      info.innerHTML = content;
    });

    map.on('mousemove', function (e) {
        var states = map.queryRenderedFeatures(e.point, {
            layers: ['RSE']
        });

        if (states.length > 0) {
            document.getElementById('pd').innerHTML =  states[0].properties.RoadName ;
        } else {
            document.getElementById('pd').innerHTML = '<p>Hover over a project!</p>';
        }
    });

   map.addLayer({
        id: "RSE",
        type: "line",
        source: {
            "type": "geojson",
            "data": "https://opendata.arcgis.com/datasets/6e8aef56bea14bc5973c6d865315e562_5.geojson"
          //  "data":"rg/portal/rest/services/Transportation/PedestrianNetwork_lfeatureEncoding=esrie&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
            //"data": RSE
        },
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
         layout: {
   visibility: "none"
  },
        paint: {
           "line-color": "#565656",
            "line-width": 2
        }
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
        
      var content =
        +'<B>Project Scope:</B> '+ feature.properties.PTI 
        +'<br><B>Location:</B> '+ feature.properties.TTI
        +'<br><B>State:</B> '+ feature.properties.RoadName
        +'<br><B>Timing:</B> '+ feature.properties.Timing
        +'<br><table class="infotable"><thead><tr><th>Total Funded Cost<br><i>(millions in Y-O-E $)</i></th><th>Unfunded Cost<br><i>(millions in 2013 $)</i></th></tr></thead>'
        +'<tbody><tr><td>'+ feature.properties.FundCost +'</td><td> '+ feature.properties.UnfundCost +'</td></tr></tbody>'
        +'</table><br>'
        ;
      info.innerHTML = content;
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
            document.getElementById('pd').innerHTML =  RSEMAP[0].properties.RoadName ;
        } else {
            document.getElementById('pd').innerHTML = '<p>Hover over a project!</p>';
        }
    });

});

   


      




