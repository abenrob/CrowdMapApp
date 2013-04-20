var map;
var markers;
var popup;
var drawnItems;

var blueMarker = L.AwesomeMarkers.icon({icon: 'icon-globe', color: 'blue'});
var redMarker = L.AwesomeMarkers.icon({icon: 'icon-globe', color: 'red'});

function initialize() {
	
    var center = [46.8,2.8];


    var esriAerialUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var esriAerialLayer = new L.TileLayer(esriAerialUrl, {
        maxZoom: 19,
        attribution: 'Tiles: &copy; Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
    });
    var mqUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
    var mqLayer = new L.TileLayer(mqUrl, {
        maxZoom: 19,
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" style="width:14px; height:14px;">'
    });

    var basemaps = {
        "ESRI Aerial": esriAerialLayer,
        "MapQuest OSM": mqLayer,
    };
    mapoptions = {
        layers: [mqLayer]
    };
    map = new L.map('map', mapoptions);

    // set the map's starting view
    map.setView(new L.LatLng(center[0], center[1]), 5);
    var layerControl = L.control.layers(basemaps);
    layerControl.setPosition('topleft');
    
    // layercontrol added below draw controls
    // Initialize the FeatureGroup to store editable layers
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    // Initialize the draw control and pass it the FeatureGroup of editable layers
    // NOTE: draw control is not visible, but it's events are linked to a navbar button.
    var drawControl = new L.Control.Draw({
	draw: {
	    rectangle: false,
	    polyline: false,
	    polygon: false,
	    circle: false,
	    marker: {icon: redMarker}
	},
	edit: {
	    featureGroup: drawnItems
	}
    });
    map.addControl(drawControl);
    
    layerControl.addTo(map);
    $("#draw").click(function(){
    	map.closePopup(popup);
		map.removeLayer(drawnItems);
		drawnItems = new L.FeatureGroup();
    	map.addLayer(drawnItems);
    	$('a.leaflet-draw-draw-marker')[0].click();
    });
    map.on('draw:created', function (e) {
		var type = e.layerType,
		    layer = e.layer,
		    coords = layer.getLatLng();
		//layer.bindPopup('<p>Lat: '+coords.lat+'</p><p>Long: '+coords.lng+'</p>');
		drawnItems.addLayer(layer);
		popup = L.popup({offset: new L.Point(0, -40)})
	    .setLatLng([coords.lat,coords.lng])
	    .setContent('<form id="point-add-form" class="form-stacked" data-lat='+coords.lat+' data-lng='+coords.lng+'>'+
					  '<div class="control-group">'+
					    '<label class="control-label">Location Name</label>'+
					    '<div class="controls">'+
					      '<input class="required" type="text" id="inName" name="inName" placeholder="Location name"> <span class="help-block"></span> '+
					    '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					      '<label class="control-label">Point Type<label>'+
					      '<div class="controls">'+
					          '<select  class="required" id="inType" name="inType"><span class="help-block"></span> '+
					          	  '<option value="" disabled selected style="display:none;">Please Choose</option>'+
					              '<option>Awesome</option>'+
					              '<option>Good to go</option>'+
					              '<option>Needs Improvement</option>'+
					            '</select> <span class="help-block"></span> '+
					        '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					    '<label class="control-label">Comment</label>'+
					    '<div class="controls">'+
					        '<textarea class="xxlarge" id="inComment" rows="3" placeholder="Comment..."></textarea> <span class="help-block"></span> '+
					    '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					    '<div class="controls">'+
					      '<button id="point-confirm" type="submit" class="btn btn-success">Confirm Point</button>'+
					    '</div>'+
					  '</div>'+
					'</form>')
	    .openOn(map);

	    $("#point-add-form").validate({
	    	rules: {
	    		inName: {
			      required: true,
			      minlength: 3
			    },
			    inType: {
			      required: true,
			      minlength: 1
			    }
			  },
	    	highlight: function (element, errorClass, validClass) {
		        $(element).closest('.control-group').removeClass('success').addClass('error');
		    },
		    unhighlight: function (element, errorClass, validClass) {
		        $(element).closest('.control-group').removeClass('error').addClass('success');
		    },
		    success: function (label) {
		        $(label).closest('form').find('.valid').removeClass("invalid");
		    },
		    errorPlacement: function (error, element) {
		        element.closest('.control-group').find('.help-block').html(error.text());
		    }
	    });
	    $("#point-add-form").submit(function(event) {		 
		  /* stop form from submitting normally */
			  event.preventDefault();
			 $("#point-add-form").valid();
				bool = $("#point-add-form").valid();
				if (bool){
				    var $form = $( this ),
			  		lat = $form.data('lat');
			  		lng = $form.data('lng');
			  		name = $form.find( 'input[id="inName"]' ).val(),
			      	type = $form.find( 'select[id="inType"]' ).val(),
			      	comment = $form.find( 'textarea[id="inComment"]' ).val();
			  		//console.log(lat,lng,name,type,comment);
			  		addPoint(name,type,comment,lat,lng);
				}
		});
	});
}

function addGeoJSON(){
    $.ajax({
            type: "GET",
            url: "/backlift/data/geoPoints",
            success: function(result) {
                var mapGeoJSON = {
                  type: "FeatureCollection",   
                  features: result
                };
                function buildPopup(id,name,type,comment){
                	var custompopup = document.createElement('div');
	                var dombtn = document.createElement('button');
	                dombtn.classList.add("btn");
	                dombtn.classList.add("btn-small");
	                dombtn.classList.add("btn-success");
	                dombtn.setAttribute("data-id",id)
					dombtn.innerHTML = '<i class="icon-heart icon-white"></i> Like this';
					dombtn.onclick = function() {
						var currentdate = new Date();
						likePoint(id,currentdate);
					};
					var domcontent = document.createElement('p');
					domcontent.innerHTML = '<br><div><strong>Name: </strong>'+name+
											'<br><strong>Feedback: </strong>'+type+
											'<br><strong>Comment: </strong>'+comment;
					custompopup.appendChild(dombtn);
					custompopup.appendChild(domcontent);
					return custompopup;
				}
				var inData = L.geoJson(mapGeoJSON, {
				    onEachFeature: function (feature, layer) {
						layer.bindPopup(buildPopup(
							feature.id,feature.properties.name,feature.properties.type,feature.properties.comment)
						);
				    },
				    pointToLayer: function (feature, latlng) {return L.marker(latlng, {icon: blueMarker})} 
				});
				markers = new L.MarkerClusterGroup();
				markers.addLayer(inData);
				map.addLayer(markers);
            }
        });
    
}

function clearGeoJSON(){
	map.removeLayer(markers);
};

