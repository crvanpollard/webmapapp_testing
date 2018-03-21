	$(document).ready(function() {
	 loadImage();  
	  $('#aboutModal').modal(); 
	  $('.form-control').change(function() {
	    // If the load_image option was selected, call the loadImage() function
	    if ($(this).val() == 'load_image') {
	      loadImage();
	      currentLayer = 'EMP2045';
	    }
	    else {
	       if ($(this).val() == 'load_image1') {
	      loadImage1();

	      currentLayer = 'ABS2045';
	     }
		  else {
	       if ($(this).val() == 'load_image2') {
	      loadImage2();
	      currentLayer = 'PER2045';
	    }
	    else {
	       if ($(this).val() == 'load_image3') {
	      loadImage3();
	      currentLayer = 'ABCHSQMI';
	    }
	   }
	  }
	 }
	 lsoaLayer.setStyle(getIMDStyle);
	});
	});	

	function loadImage(){
	  $('#legendBox').css('backgroundImage', 'url(img/EMP1.png)');
	  $('#legendBox').css('width', '145');
	  $('#legendBox').css('height', '145');
	}
	function loadImage1(){
	  $('#legendBox').css('backgroundImage', 'url(img/EMP2.png)');
	  $('#legendBox').css('width', '143');
	  $('#legendBox').css('height', '145');
	}
	function loadImage2(){
	  $('#legendBox').css('backgroundImage', 'url(img/EMP3.png)');
	  $('#legendBox').css('width', '245');
	  $('#legendBox').css('height', '95');
	}
	function loadImage3(){
	  $('#legendBox').css('backgroundImage', 'url(img/EMP4.png)');
	  $('#legendBox').css('width', '150');
	  $('#legendBox').css('height', '150');
	}

	$('#legendBox').appendTo('#map');

  var map;
  var props;
  var currentLayer;
	
  var getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)')
                        .exec(window.location.search);
    return match ?
           decodeURIComponent(match[1].replace(/\+/g, ' '))
           : null;
    }

  currentLayer = getParameterByName("l") || "EMP2045";
  var getIMDColor = function(value) {
  	layer = currentLayer || "EMP2045";
    var series = {
      "EMP2045": {
        "breaks": [10000, 5000, 2500, 1000, 1],
        "colors": ["#a63603","#e6550d","#fd8d3c","#fdbe85","#feedde"]
      },
      "ABS2045": {
        "breaks": [ 3000, 2000, 1000, -0, -5000],
        "colors": ['#54278f','#756bb1','#9e9ac8','#cbc9e2','#f2f0f7']
      },
	   "PER2045": {
        "breaks": [.50000, .25000, .05, -.05001],
        "colors": ['#045a8d','#2b8cbe','#74a9cf','#bdc9e1']
     },	
      "ABCHSQMI": {
        "breaks": [300, 200, 100, 0, -500],
        "colors": ['#006d2c','#2ca25f','#66c2a4','#b2e2e2','#edf8fb']
     }
	}
    for (var i=0; i < series[layer]["breaks"].length; i++){
      if (value > series[layer]["breaks"][i]){
        return series[layer]["colors"][i];
      }
    }
    return "#FFFFFF";
  }

  var getIMDStyle = function(feature) {
    return {
      color: '#666',
      weight: 1,
      opacity: 1,
      fillOpacity: .75,
      fillColor: (feature.properties) ?
        getIMDColor(feature.properties[currentLayer]) :
        null
    }
  };

  var lsoaLayer = L.geoJson(null, {
    style: getIMDStyle,
    onEachFeature: function (feature, layer) {
      feature.id = L.stamp(layer);
      if (feature.properties) {
        layer.on({click:populateCounty});
        layer.on({
          click: tboro,
        //  mouseover: highlightFeature,
          mouseover: hover,
          mouseout: resetHighlight
        });
	   }
	  }
   });

  	$.getJSON('data/emp2045.js', function (data) {
    	lsoaLayer.addData(data);
    });

    //////hack to resolve layerOrder add after layers added
	lsoaLayer.once('mouseover', function(e){        //create eventListener on mouseover of lsoaLayer (only active once rendered)
	    DVRPC.bringToFront();                     //push counties to front of map pane
	   // lsoaLayer.off();                          //kill eventListener          
	});
  
  function tboro(e) {
		//	resetHighlight();
		var layer = e.target;
		var props = layer.feature.properties
        var info = '<h1>' + props.Name + '</h1>';
		  
		  var tableinfo = '<div id="tableinfo"><h4><b>Municipal-Level Employment Forecasts, 2015-2045</b></h4></div>'
		  var content ='<table id="crashtable">'+
					   '<tr><b><font color="#0074ad">'+ (props.MUN_NAME)+' , '+(props.CO_NAME)+' County</font></b></tr>'+
					   '<br>Absolute Change (2015-2045): <b>'+numeral(props.ABS2045).format('0,0')+'</b></br>'+
					   'Percent Change (2015-2045): <b>'+numeral(props.PER2045).format('0.00%')+
					   '</b><br>Absolute Change per Square Mile (2015-2045): <b>'+numeral(props.ABCHSQMI).format('0,0')+'</b>'+
			           '<tbody>'+
			           '<tr class="odd">'+
					   '<th>2015 Employment</th><td>' + numeral(props.EMP2015).format('0,0') + '</td>' + 
					   '<tr class="even">'+
					   '<th>2020 Forecast</th><td>' + numeral(props.EMP2020).format('0,0')+ '</td>' + 
		               '<tr class="odd">'+
			           '<th>2025 Forecast</th><td>' + numeral(props.EMP2025).format('0,0')+ '</td>' + 
		               '<tr class="even">'+
		               '<th>2030 Forecast</th><td>' + numeral(props.EMP2030).format('0,0')+ '</td>' + 
					   '<tr class="odd">'+
			           '<th>2035 Forecast</th><td>' + numeral(props.EMP2035).format('0,0')+ '</td>' + 
					   '<tr class="even">'+
					   '<th>2040 Forecast</th><td>' + numeral(props.EMP2040).format('0,0')+ '</td>' + 
					   '<tr class="odd">'+
			           '<th>2045 Forecast</th><td>' + numeral(props.EMP2045).format('0,0')+ '</td>' + 
			           '</tbody>'+						
				       '<table>';
	 var tableinfo2 = '<div id="tableinfo2"></br><h4><b>County-Level Employment Forecasts, 2015-2045</b></h4></div>'						   
	 var content2 =   '<table id="crashtable">'+
					   '<b><font color="#0074ad">'+ (props.CO_NAME)+" County" +'</font></b>'+
					   '<br>Absolute Change (2015-2045): <b>'+numeral(props.cnty_abs45).format('0,0')+'</b></br>'+
					   'Percent Change (2015-2045): <b>'+numeral(props.cnty_pct45).format('0.00%')+'</b>'+
			           '<tbody>'+
			           '<tr class="odd">'+
					   '<th>2015 Employment</th><td>' + numeral(props.cnty2015).format('0,0') + '</td>' + 
					   '<tr class="even">'+
					   '<th>2020 Forecast</th><td>' + numeral(props.cnty2020).format('0,0')+ '</td>' + 
		               '<tr class="odd">'+
			           '<th>2025 Forecast</th><td>' + numeral(props.cnty2025).format('0,0')+ '</td>' + 
		               '<tr class="even">'+
		               '<th>2030 Forecast</th><td>' + numeral(props.cnty2030).format('0,0')+ '</td>' + 
					   '<tr class="odd">'+
			           '<th>2035 Forecast</th><td>' + numeral(props.cnty2035).format('0,0')+ '</td>' + 
					   '<tr class="even">'+
					   '<th>2040 Forecast</th><td>' + numeral(props.cnty2040).format('0,0')+ '</td>' + 
					   '<tr class="odd">'+
			           '<th>2045 Forecast</th><td>' + numeral(props.cnty2045).format('0,0')+ '</td>' + 
			           '</tbody>'+						
				       '<table>';
			document.getElementById('infosidebarheader').innerHTML = tableinfo;
			document.getElementById('infosidebar').innerHTML = content;
			document.getElementById('infoside2barheader').innerHTML = tableinfo2;
			document.getElementById('infosidebar2').innerHTML = content2;
			$('#cardclick').hide();
  		};
		var label = new L.Label(); 

		function hover(e) { 
		var layer = e.target;
		var props = layer.feature.properties;
		info.update(layer.feature.properties);
		layer.setStyle({
		       weight: 3,
			   color: 'red',
			   opacity:1
		    })
			
		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
						
		}
					
		function highlightFeature(e) {
		var layer = e.target;
		var props = layer.feature.properties;
		 	layer.setStyle({
			   weight: 3,
			   fillColor: '#FFD700',
			   opacity:1
			}) 
		}	
				
		function resetHighlight(e) {
		   lsoaLayer.resetStyle(e.target);
		   	  info.update();
		}


		var map = L.map("map", {
        zoom: 9,
        center: new L.LatLng(39.97, -75.16),
		});
			
		var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	        subdomains: 'abcd',
	        maxZoom: 19
		});
		// set view to leeds, and add layer. method chaining, yumm.
		map.addLayer(CartoDB_Positron );
	
		var scaleControl = L.control.scale({
				position: 'bottomright'
			});
			
		var viewCenter = new L.Control.ViewCenter();
				map.addControl(viewCenter);
		
		var DVRPC = L.geoJson(null, {
    	style: {color: 'black',weight: 2.5,fill: false, opacity: 0.75,clickable: false}
	    });
		$.getJSON("data/County_DVRPC.js", function (data) {
		 DVRPC.addData(data);
		});
			
		//add layers after declaring them about line 195
		map.addLayer(DVRPC);
		map.addLayer(lsoaLayer);

		var info = L.control();

		info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
		    this._div.innerHTML = '<B></B>' +  (props ?
		        '<h4>' + (props.MUN_NAME) + '</h4>'
		        : '');
		};

		info.addTo(map);


        function populateCounty(e) {
                var layer = e.target;
                var props = layer.feature.properties,
				CntyPop = ([props.cnty2015, props.cnty2020, props.cnty2025, props.cnty2030, props.cnty2035, props.cnty2040,props.cnty2045]);
			    updatePopCnty(CntyPop)
			 };
       
function updatePopCnty(Values){
    var CntyChart = {
        chart: {
            renderTo: 'containerCtyPop',
            type: 'line',
            backgroundColor: 'white',
            height: 250,
            marginTop: 10,
           // width: 290,
        },
        title: {
            text: '',
            x: -0 //center
       	 },	
		   xAxis: {
            categories: ['2015', '2020', '2025', '2030', '2035', '2040','2045']
        },
		  	colors: ['#0074ad'],
            yAxis: {
                title: {
                    text: 'Population'
                }
            },
			 legend:{
			enabled: false
		},
		 tooltip: {
            formatter:function(){

                return Highcharts.numberFormat(this.point.y,0,',',',')+'</b><br/>';
            }
        },
        credits: {
            enabled: false
        },
  /*      plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },*/
        series: [{
           name:'Population',
		   id: 'Values',
           data: []
        }]
    };
    var Labels = ["2015", "2020", "2025", "2030","2035", "2040", "2045"],
    countData2 = [];
    for (var i = 0; i < Values.length; i++){
                countData2.push({
                    name: Labels[i],
                    y: Values[i]})
            }
    CntyChart.series[0].data = countData2;
    var chart2 = new Highcharts.Chart(CntyChart)

}