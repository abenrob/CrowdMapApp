var geoPoint = Backbone.Model.extend({});

var geoPoints = Backbone.Collection.extend({
    model: geoPoint,
    url: "/backlift/data/geoPoints"
});

//var allpoints = new geoPoints();
//allpoints.fetch();   // will issue a GET /backlift/data/geoPoints
//
//var newpoint = new geoPoint({
//    type: "Feature",
//    properties: {
//	name: "Rouen",
//	type: "Needs Improvement",
//	comment: "Could really use some better beer here..."
//    },
//    geometry: {
//	type: "Point",
//	coordinates: [ 1.097259, 49.440449 ]
//    }
//});
//
//allpoints.add(newpoint);
//newpoint.save();// will issue a POST /backlift/data/geoPoints

function addPoint(inName,inType,inComment,inLat,inLng){
	var dataObj = {
		"type": "Feature",
        "properties": {
			"name": inName,
	    	"type": inType,
	    	"comment": inComment
		},
        "geometry": {
			"type": "Point",
	        "coordinates": [ inLng, inLat ]
		}
	};
	var json = JSON2.stringify(dataObj);
	$.ajax({
	    type: "POST",
	    url: "/backlift/data/geoPoints", 
	    data: json,
	    contentType: "application/json; charset=utf-8",
	 	dataType: "json",
	    success: function() { 
	    	clearGeoJSON();
			addGeoJSON();
			map.closePopup(popup);
			map.removeLayer(drawnItems);
			drawnItems = new L.FeatureGroup();
    		map.addLayer(drawnItems);
	    }
	});
}
