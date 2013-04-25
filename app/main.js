// GLOBALS
var map;
var markers;
var popup;
var drawnItems;
var mapMarker;
var defaultConfigs = {"siteInfoTitle":"Space Ipsum, yo!",
"mapMarkerIcon":"icon-globe",
"siteName":"CrowdMapApp",
"drawMarkerColor":"red",
"pointTypes":["Awesome",
"Good to go!",
"Needs improvement"],
"mapZoom":5,
"mapLng":2.8,
"siteInfoText":"<p>When I orbited the Earth in a spaceship, I saw for the first time how beautiful our planet is. Mankind, let us preserve and increase this beauty, and not destroy it!</p><p>You know, being a test pilot isn't always the healthiest business in the world.</p><p>The path of a cosmonaut is not an easy, triumphant march to glory. You have to get to know the meaning not just of joy but also of grief, before being allowed in the spacecraft cabin.</p><p>Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center &mdash; an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.</p><p>To be the first to enter the cosmos, to engage, single-handed, in an unprecedented duel with nature &mdash; could one dream of anything more?</p>",
"mapLat":46.8,
"mapMarkerColor":"blue"}


var siteConfig = Backbone.Model.extend({
});
var siteConfigs = Backbone.Collection.extend({
  model: siteConfig,
  url: "/backlift/data/siteConfigs"
});
var configSettings = new siteConfigs();

function setSettings(siteSettings){
  $('#app-name').html(siteSettings.siteName);
  $('#app-modal-title').html(siteSettings.siteInfoTitle);
  $('#app-modal-body').html(siteSettings.siteInfoText);
  $('#infoModal').modal('show');
}

// MAIN
function main(){
    var $nav = $('.navbar');
    var $map = $('#map');
    var $body = $('body');

    $map.css('top',$nav.height());
    $map.height($body.height()-$nav.height());
    configSettings.fetch({
        success: function () {
          if (configSettings.length == 0) {
            var baseConfig = new siteConfig(defaultConfigs);
            configSettings.add(baseConfig);
            baseConfig.save();
            configSettings.fetch({
                success: function () {
                  siteSettings = configSettings.first().attributes;
                  setSettings(siteSettings);
                  initialize();
                  addGeoJSON(); 
                }
            });
          }
          else {
            siteSettings = configSettings.first().attributes;
            setSettings(siteSettings);
            initialize();
            addGeoJSON();
          }
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