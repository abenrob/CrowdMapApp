var map;
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
    var drawnItems = new L.FeatureGroup();
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
    map.on('draw:created', function (e) {
	var type = e.layerType,
	    layer = e.layer,
	    coords = layer.getLatLng();
	layer.bindPopup('<p>Lat: '+coords.lat+'</p><p>Long: '+coords.lng+'</p>');
	drawnItems.addLayer(layer);
    });
    var $toggledraw = $('#draw-toggle');
    var $draw = $('#draw-control-box');
    $toggledraw.click(function() {
	$draw.toggleClass('show');
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
		var markers = new L.MarkerClusterGroup();
		markers.addLayer(inData);
		map.addLayer(markers);
            }
        });
    
}

