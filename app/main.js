// GLOBALS
var map;
var markers;
var popup;
var drawnItems;
var markerIcon;
var markerColor;
var drawMarkerColor;
var mapMarker;

// MAIN
function main(){
  	var $nav = $('.navbar');
  	var $map = $('#map');
  	var $body = $('body');
  
  	$map.css('top',$nav.height());
  	$map.height($body.height()-$nav.height());
  	
    var siteConfig = Backbone.Model.extend({});
    var siteConfigs = Backbone.Collection.extend({
        model: siteConfig,
        url: "/backlift/data/siteConfigs"
    });
    var configSettings = new siteConfigs();
    configSettings.fetch({
        success: function () {
        	siteSettings = configSettings.first().attributes;
        	markerIcon = siteSettings.mapMarkerIcon;
			markerColor = siteSettings.mapMarkerColor;
			drawMarkerColor = siteSettings.drawMarkerColor;
            $('#app-name').html(siteSettings.siteName);
            $('#app-modal-title').html(siteSettings.siteInfoTitle);
            $('#app-modal-body').html(siteSettings.siteInfoText);
            $('#infoModal').modal('show');
            initialize();
  			addGeoJSON(); 
        }
    });
}
$(main);

$(window).resize(function() {
	var $nav = $('.navbar');
	var $map = $('#map');
	var $body = $('body');
	  
	$map.css('top',$nav.height());
	$map.height($body.height()-$nav.height());
});

function clickBind() {
	var $ptAddForm = $('#point-add-form');
	var $ptAddBtn = $('#point-confirm');
	var $ptAddName = $('#inName');
	var $ptAddType = $('#inType');
	var $prAddComment = $('#inComment');
	$ptAddBtn.bind('click', function() {
		console.log($ptAddForm.data('lng'));
	});
};