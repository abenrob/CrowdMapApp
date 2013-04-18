var map;
var markers;
var popup;
var drawnItems;
var redMarker = L.Icon.extend({options: {iconUrl: 'app/images/red-marker.png',iconAnchor:[20,49],popupAnchor:[0,-50]}});
var orangeMarker = L.Icon.extend({options: {iconUrl: 'app/images/orange-marker.png',iconAnchor:[20,49],popupAnchor:[0,-50]}});
var greenMarker = L.Icon.extend({options: {iconUrl: 'app/images/green-marker.png',iconAnchor:[20,49],popupAnchor:[0,-50]}});
var blueMarker = L.Icon.extend({options: {iconUrl: 'app/images/blue-marker.png',iconAnchor:[20,49],popupAnchor:[0,-50]}});
var greyMarker = L.Icon.extend({options: {iconUrl: 'app/images/grey-marker.png',iconAnchor:[20,49],popupAnchor:[0,-50]}});

function initialize() {
	
    var center = [46.8,2.8];

    // create the Esri Gray layer
    var grayMapUrl = 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    var grayMapLayer = new L.TileLayer(grayMapUrl, {
        maxZoom: 19,
        attribution: 'Tiles: &copy; Esri'
    });
    var esriAerialUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var esriAerialLayer = new L.TileLayer(esriAerialUrl, {
        maxZoom: 19,
        attribution: 'Tiles: &copy; Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
    });
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmLayer = new L.TileLayer(osmUrl, {
        maxZoom: 19,
        attribution: 'Map data &copy; OpenStreetMap contributors'
    });
    var mqUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg';
    var mqLayer = new L.TileLayer(mqUrl, {
        maxZoom: 19,
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" style="width:14px; height:14px;">'
    });

    var basemaps = {
        "ESRI Gray": grayMapLayer,
        "ESRI Aerial": esriAerialLayer,
        "MapQuest OSM": mqLayer,
        "Open Street Map": osmLayer
    };
    mapoptions = {
        layers: [osmLayer]
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
    var drawControl = new L.Control.Draw({
	draw: {
	    rectangle: false,
	    polyline: false,
	    polygon: false,
	    circle: false,
	    marker: {
		icon: new redMarker()
	    }
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
					      '<input class="required" type="text" id="inName" placeholder="Location name">'+
					    '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					      '<label class="control-label">Point Type<label>'+
					      '<div class="controls">'+
					          '<select id="inType">'+
					              '<option>Awesome</option>'+
					              '<option>Good to go</option>'+
					              '<option>Needs Improvement</option>'+
					            '</select>'+
					        '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					    '<label class="control-label">Comment</label>'+
					    '<div class="controls">'+
					        '<textarea class="xxlarge" id="inComment" rows="3" placeholder="Comment..."></textarea>'+
					    '</div>'+
					  '</div>'+
					  '<div class="control-group">'+
					    '<div class="controls">'+
					      '<button id="point-confirm" type="submit" class="btn btn-success">Confirm Point</button>'+
					    '</div>'+
					  '</div>'+
					'</form>')
	    .openOn(map);

	    $("#point-add-form").validate();
	    $("#point-add-form").submit(function(event) {		 
		  /* stop form from submitting normally */
			  event.preventDefault();
			 $("#point-add-form").valid();
				bool = $("#point-add-form").valid();
				if (bool){
				    alert('Do some other stuf now.');
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
		var inData = L.geoJson(mapGeoJSON, {
		    onEachFeature: function (feature, layer) {
				layer.bindPopup('Name: '+feature.properties.name+'<br>Feedback: '+feature.properties.type+'<br>Comment: '+feature.properties.comment);
		    },
		    pointToLayer: function (feature, latlng) {return L.marker(latlng, {icon: new blueMarker()})} 
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

