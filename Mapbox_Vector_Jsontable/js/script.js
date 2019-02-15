/*********************************************/ 
/******************* Modal *******************/
/*********************************************/  
var modal = document.querySelector('#modal')
var modalToggle = document.querySelector('#modal-toggle')
var close = document.querySelector('#close-modal')

// hide and add aria-hidden attribute
var ariaHideModal = function() {
  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
}

// reveal and remove aria-hidden attribute
var ariaShowModal = function() {
  modal.style.display = 'block'
  modal.setAttribute('aria-hidden', 'false')
}

// open the modal by clicking the div
modalToggle.onclick = function(){
  modal.style.display = 'none' ? ariaShowModal() : ariaHideModal()
}

// closing the modal options: by clicking the 'x' or anywhere outside of it or pressing the escape key
close.onclick = function(){ariaHideModal()}

window.onclick = function(event) {
    if (event.target == modal) {
      ariaHideModal()
    }
}
document.onkeydown = function(event) {
  // make sure the modal is open first
  if(modal.style.display === 'block'){
    // keyCode for th escape key
    if(event.keyCode === 27){
      ariaHideModal()
    }
  }
}

/*********************************************/ 
/**************** Map ***************/
/*********************************************/ 


// create the latLngBounds object because google is annoying 
//var sw = {lat: -76.09405517578125, lng: 39.49211914385648}
//var ne = {lat: -74.32525634765625, lng: 40.614734298694216}
//var latLngBounds = new google.maps.LatLngBounds(sw, ne)

mapboxgl.accessToken = 'pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA'

var tiles = {
    'type': 'vector',
    'url': 'https://tiles.dvrpc.org/data/dvrpc-municipal.json'
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    attributionControl: false,
    center: [-75.2273, 40.071],
    zoom: 8.5
});

function generatePopup(popup, e){
  var props = e.features[0].properties
  popup.setLngLat(e.lngLat)
  .setHTML("<p>"+props.name+"</p><hr /><p>"+props.cty+" County</p>")
  .addTo(map)
}

map.addControl(new mapboxgl.NavigationControl());





map.on('load', function() {
  map.addLayer({
    'id': 'county-outline',
    'type': 'line',
    'source': tiles,
    'source-layer': 'county',
    'paint': {
      'line-width': 2.5,
      'line-color': '#141414'
    },
    'filter': [
      '==',
      'dvrpc',
      'Yes'
    ]
  })

  map.addLayer({
    'id': 'municipality-fill',
    'type': 'fill',
    'source': tiles,
    'source-layer': 'municipalities',
    'layout': {},
    'paint': {
        'fill-opacity': 1
    }
  })

  map.addLayer({
    'id': 'municipality-outline',
    'type': 'line',
    'source': tiles,
    'source-layer': 'municipalities',
    'paint': {
        'line-width': 0.5,
        'line-color': '#141414'
    }
  })

  map.addLayer({
    'id': 'municipality-hover',
    'type': 'line',
    'source': tiles,
    'source-layer': 'municipalities',
    'paint': {
      'line-width': 2,
      'line-color': '#0074ad'
    },
    'filter': [
      '==',
      'geoid',
      ''
    ]
  })
  
  var popup = new mapboxgl.Popup({
    closebutton: false,
    closeOnClick: true
  })

  map.on('mousemove', 'municipality-fill', function(e){
    map.getCanvas().style.cursor = 'pointer'
    map.setFilter('municipality-hover', ['==', 'geoid', e.features[0].properties['geoid']])
    generatePopup(popup, e)
  })

  map.on('mouseleave', 'municipality-fill', function(e){
    map.getCanvas().style.cursor = ''
    map.setFilter('municipality-hover', ['==', 'geoid', ''])
    popup.remove()
  })

  map.on('click', 'municipality-fill', function(e){
    getReport(e)
  })

  let expression = ["match", ["get", "geoid"]]
  csvData.forEach(function(row) {
      let data = row["EMIACRE"],
      color
    if (data < 10) color = '#d73027'
    else if (data >= 10 && data < 20) color = '#fc8d59'
    else if (data >=20 && data < 40) color = '#fee090'
    else if (data >= 40 && data < 80) color = '#e0f3f8'
    else if (data >= 80 && data < 150) color ='#91bfdb'
    else { color = '#4575b4'; }
    expression.push(row['geoid'].toString(), color);
  });
  
  // Last value is the default, used where there is no data
  expression.push("rgba(0,0,0,0)");
  map.setPaintProperty('municipality-fill', 'fill-color', expression)

})

function getReport(e) {
  window.open('mcdDetail.aspx?mcdcode='+e.features[0].properties['geoid']);
}