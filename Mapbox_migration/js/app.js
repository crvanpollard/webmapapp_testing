function legendraw(element) {
    $("#Reduce").modal("show");
}

function legendraw2(element) {
    $("#Increase").modal("show");
}

function legendraw3(element) {
    $("#Rebuild").modal("show");
}

function legendraw4(element) {
    $("#Crash").modal("show");
}

function legendraw5(element) {
    $("#Secure").modal("show");
}

function legendraw6(element) {
    $("#Support").modal("show");
}
function legendraw7(element) {
    $("#Freight").modal("show");
}
function legendraw8(element) {
    $("#PM3").modal("show");
}
 // this is the Survey Modal Call
      function surveylaunch(element) {
     //   $("#SurveyModal").modal("show");
        window.open("https://dvrpcgis.maps.arcgis.com/apps/MapSeries/index.html?appid=732efbf95f76489598277df671b5d6b2");
      }
     var CMP_PA = 'https://services1.arcgis.com/LWtWv6q6BJyKidj8/ArcGIS/rest/services/CMP_SubcorridorsEmergingCorridors/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&geometryPrecision=4&outSR=4326&f=pgeojson';
    var CMP_NJ = 'https://services1.arcgis.com/LWtWv6q6BJyKidj8/ArcGIS/rest/services/CMP_SubcorridorsEmergingCorridors/FeatureServer/1/query?where=1%3D1&outFields=*&returnGeometry=true&geometryPrecision=4&outSR=4326&f=pgeojson';
    var allIDs = [];
    var filterGroup = document.getElementById('filter-group');
    var layerID;
    var hoveredStateId = null;
var map;
var mapLayers = [], identifyLayers = [];
// var layer_ids = [];
var resetData = true;
var resetInfo = true;
//var TTI_PM,LRP_VC_PM,TransScore_PM,RailPoint_PM,PTI_PM,NHSPoint_PM,TranistPoi_PM,HighCrSev_PM,HighCrFreq_PM, TTTI_PM, HvyTran_PM, Limerick_PM, MajBridge_PM, Bridges_PM, Military_PM, HHDen_PM, EmpDen_PM, StadGathr_PM, Env_PM, InfEmerg_PM, PlanCntr_PM, LOTTR_PM, PHED_PM, TTTR_PM;
var pane = document.getElementById('selectedFeatures');
// query the checkbox
//OPEN ABOUT DIALOG
// $('#aboutModal').modal();
//   $('#slidercase').appendTo('#map');

$(window).resize(function() {
    $('.tt-dropdown-menu').css('max-height', $('#container').height() - $('.navbar').height() - 20);
});

//Document Ready
$(document).ready(function() {

 //   $("#PMBtn").click(function() {
 //       $('#PMModal').modal('show');
 //   });

});

$('#PMModal').on('hide.bs.modal', function() {
    // $(this).data('modal', null);
    $('#PMModal').remove();
})

/*function checkIfLoaded() {
    $('.loading-panel').fadeIn();
    cmp_PNT.on("load", function() {
        $('.loading-panel').fadeOut();
    });
}
*/
mapboxgl.accessToken = 'pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg';
  
    var map = new mapboxgl.Map({
        container: 'map',
       style: 'mapbox://styles/mapbox/light-v10',
      //  style:'mapbox://styles/mapbox/navigation-preview-night-v4',
     //  style:'mapbox://styles/mapbox/navigation-guidance-night-v4',
     //    style:'mapbox://styles/crvanpollard/ck5fpyqti0v971itf7edp2eyd',
        center: [   -75.170669,    40.08], 

        zoom: 9
    });

      var slider = document.getElementById('slider');
var sliderValue = document.getElementById('slider-value');

    map.on('load', function() {
      var layers = map.getStyle().layers;
// Find the index of the first symbol layer in the map style
var firstSymbolId;
for (var i = 0; i < layers.length; i++) {
if (layers[i].type === 'symbol') {
firstSymbolId = layers[i].id;
break;
}
}
// County
 map.addLayer({
            "id": "county",
            "type": "line",
            "source": {
                type: 'vector',
                url: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json'
            },
            "source-layer": "county",
            "layout": {},
            "paint": {
                'line-width': 2,
                'line-color': '#434343'
            },
            "filter": [
                    "==",
                    "dvrpc",
                    "Yes"
            ]
        });
 // MCD
  map.addLayer({
            "id": "municipalities",
            "type": "line",
            "minzoom": 10,
            "source": {
                type: 'vector',
                url: 'https://tiles.dvrpc.org/data/dvrpc-municipal.json'
            },
            "source-layer": "municipalities",
            "layout": {},
            "paint": {
                'line-width': .5,
                'line-color': '#c1c1c1'
            },
               firstSymbolId
    
     //       "filter": ["==", "dvrpc", "Yes"]
        });


      // Add a GeoJSON source containing CMP coordinates and information.
        map.addSource('CMP_PA', {
        'type': 'geojson',
        'data': CMP_PA
        });

        map.addSource('CMP_NJ', {
        'type': 'geojson',
        'data': CMP_NJ
        });


        $.ajax(CMP_PA)
          .done(function(data) {
            data = JSON.parse(data)
         //   console.log(data.features)

            data.features.forEach(function(feature) {
              var CMP_ID = feature.properties['CMP_ID'];
              var layerID = 'PA'+ CMP_ID;
              console.log(layerID)
          //    allIDs.push(layerID)

              // Add a layer for this symbol type if it hasn't been added already.
              // there's something wonky with this...
              if (!map.getLayer(layerID)) {
                  map.addLayer({
                      'id': layerID,
                      'type': 'fill',
                      'source': 'CMP_PA',
                      'layout': {visibility:'visible'},
                      'paint': {
                      'fill-color': [
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
                         'fill-outline-color' :['case',['boolean', ['feature-state', 'hover'], false],"#000000","#7c7c7c" ],
                        'fill-opacity' :['case',['boolean', ['feature-state', 'hover'], false],1,0.8]
                      },
                     'filter': ['==', 'CMP_ID', CMP_ID]
                  },
                  firstSymbolId
    
                  );
                  map.on('mousemove', layerID, hoverTooltip)
                  map.on('mouseleave', layerID, unhoverTooltip)
              }
                    
            });
          })
          .fail(function(xhr, status) {
            console.log('failed because: ', status)
          })
      
        $.ajax(CMP_NJ)
          .done(function(data) {
            data = JSON.parse(data)
          //  console.log(data.features)

            data.features.forEach(function(feature) {
              var CMP_ID = feature.properties['CMP_ID'];
              var layerID = 'NJ'+ CMP_ID;
          //    console.log(layerID)
          //    allIDs.push(layerID)

              // Add a layer for this symbol type if it hasn't been added already.
              // there's something wonky with this...
              if (!map.getLayer(layerID)) {
                  map.addLayer({
                      'id': layerID,
                      'type': 'fill',
                      'source': 'CMP_NJ',
                      'layout': {visibility:'visible'},
                      'paint': {
                      'fill-color': [
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
                        'fill-outline-color' :['case',['boolean', ['feature-state', 'hover'], false],"#000000","#7c7c7c" ],
                        'fill-opacity' :['case',['boolean', ['feature-state', 'hover'], false],1,0.8]
                      },
                     'filter': ['==', 'CMP_ID', CMP_ID]
                  },
                    firstSymbolId
                  );
                  map.on('mousemove', layerID, hoverTooltipNJ)
                  map.on('mouseleave', layerID, unhoverTooltipNJ)
              }
            });
          })
          .fail(function(xhr, status) {
            console.log('failed because: ', status)
          })

    });


slider.addEventListener('input', function(e) {
  //slide(e);
  let a = ['PA1','PA2','PA3','PA4','PA5','PA6','PA7','PA8','PA9','PA10','PA11','PA12','PA13','PA14','PA15','PA16','PA17','NJ1','NJ2','NJ3','NJ4','NJ5','NJ6','NJ7','NJ8','NJ9','NJ10','NJ11','NJ12','NJ13','NJ14','NJ15','NJ16','NJ17'];
for (let index = 0; index < a.length; ++index) {
    let value = a[index];
      map.setPaintProperty(value,'fill-opacity',parseInt(e.target.value, 10) / 100);
// Value indicator
sliderValue.textContent = e.target.value + '%';
}
});

// Toggle individual CMP corridor layers
$('input:checkbox[name="overlayLayers"]').on('change', function(e) {
    var id = this.id;

   if ( id === 'all' ) {
  //  alert("DUDE!");
  //  map.setLayoutProperty(this.id,'visibility', e.target.checked ? 'visible' : 'none');
    } 
    else if ( id === this.id ) {
  //  map.setLayoutProperty('PA2','visibility', e.target.checked ? 'visible' : 'none');
    map.setLayoutProperty(this.id,'visibility', e.target.checked ? 'visible' : 'none');
    } 
    else {
  //     map.setLayoutProperty(id,'visibility', 'visible');
       return id;
    }
});


//Document Ready
$(document).ready(function() {
    //layer group check all functionality
    $('input.checked_all').on('change', function() {
        //var listPanel = $(this)
        var $element = $(this);
        if ($element.prop('checked') == true) {
            $element.siblings('.checkbox').find('input').prop('checked', true).change();
        } else {
            $element.siblings('.checkbox').find('input').prop('checked', false).change();
        }
    });

});

map.on('click', function (e) {
    var bbox = [[e.point.x - 5, e.point.y - 5],[e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox, {layers: ['PA1','PA2','PA3','PA4','PA5','PA6','PA7','PA8','PA9','PA10','PA11','PA12','PA13','PA14','PA15','PA16','PA17','NJ1','NJ2','NJ3','NJ4','NJ5','NJ6','NJ7','NJ8','NJ9','NJ10','NJ11','NJ12','NJ13','NJ14','NJ15','NJ16','NJ17']});

      if (!features.length) {
        //  console.log(e.lngLat);
    //    let numbers = e.lngLat;
   //     numbers = JSON.parse(numbers);
  //    alert(numbers);
     //  alert (e.lngLat);
        return;
      }
      var content = '';

      for(var i = 0; i<features.length; i++) {
        var cmp = features[i].properties.CMP_ID
        var subid = features[i].properties.SUB_ID 
        var banner = features[i].properties.WEB_COLOR
        var name = features[i].properties.NAME
        var subname = features[i].properties.SUBNAME
        var priority = features[i].properties.PRIORITY
        var shield = features[i].properties.SHIELD
        var state = features[i].properties.STATE


    var newSet = '<h4 style="color:white;background-color:' + banner + '"><div class="label"><img class="shield" src="' + shield + ' ">' + name + '</div></h4>' + "<div class='labelfield'><b>Subcorridor ID/Name: </b>" + cmp + subid + " - " + subname + "<br>" + "<div class='labelfield'><b>Priority Subcorridor: </b>" + priority + "</div>" +
      '<img style="margin:0px 0px 5px 0px" src="https://www.dvrpc.org/asp/TIPsearch/2015/PA/img/document.png"/>&nbsp; - <a class="one" href="https://www.dvrpc.org/asp/cmp/'+ state+'CMP2019Detail.asp?corridor='+cmp+'&subcorridor='+ subid + '" target="_blank"> ' + "View Subcorridor Information" + "</a><br>" 
                  ;

        content += newSet
      }

      infosidebar.innerHTML = content;
});

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});

var hoverTooltip = function(e) {
    popup
    .setLngLat(e.lngLat)
    .setHTML(e.features.map(function(feature) { return feature.properties.NAME + '('+ feature.properties.GIS_ID +')'; }).join(', '))
    .addTo(map);

    currentHover = e.features[0].id;

    if (hoveredStateId !== currentHover) {
      // remove paint (exclude first pass where hoverdStateId is undefined)
      if(hoveredStateId){
        map.setFeatureState(
        { source: 'CMP_PA', id: hoveredStateId },
        { hover: false }
      );
      }

      // reassign hoverste and paint again
      hoveredStateId = currentHover
      map.setFeatureState(
      { source: 'CMP_PA', id: currentHover },
      { hover: true }
      );
    }
}

var unhoverTooltip = function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove();

  if (hoveredStateId) {
  map.setFeatureState(
  { source: 'CMP_PA', id: hoveredStateId },
  { hover: false }
  );
  }
  hoveredStateId = null;
}

var hoverTooltipNJ = function(e) {
    popup
    .setLngLat(e.lngLat)
    .setHTML(e.features.map(function(feature) { return feature.properties.NAME + '('+ feature.properties.GIS_ID +')'; }).join(', '))
    .addTo(map);

    currentHover = e.features[0].id;

    if (hoveredStateId !== currentHover) {
      // remove paint (exclude first pass where hoverdStateId is undefined)
      if(hoveredStateId){
        map.setFeatureState(
        { source: 'CMP_NJ', id: hoveredStateId },
        { hover: false }
      );
      }

      // reassign hoverste and paint again
      hoveredStateId = currentHover
      map.setFeatureState(
      { source: 'CMP_NJ', id: currentHover },
      { hover: true }
      );
    }
}

var unhoverTooltipNJ = function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove();

  if (hoveredStateId) {
  map.setFeatureState(
  { source: 'CMP_NJ', id: hoveredStateId },
  { hover: false }
  );
  }
  hoveredStateId = null;
}


// Placeholder hack for IE
if (navigator.appName == "Microsoft Internet Explorer") {
    $("input").each(function() {
        if ($(this).val() == "" && $(this).attr("placeholder") != "") {
            $(this).val($(this).attr("placeholder"));
            $(this).focus(function() {
                if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
            });
            $(this).blur(function() {
                if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
            });
        }
    });
}