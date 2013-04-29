// GLOBALS
var auth_login = false;
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
"mapMarkerColor":"blue",
}


var siteConfig = Backbone.Model.extend({
});
var siteConfigs = Backbone.Collection.extend({
  model: siteConfig,
  url: "/backlift/data/siteConfigs"
});
var configSettings = new siteConfigs();

function setSettings(){
  $('#inSiteInfoBody').wysihtml5({
          "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
          "emphasis": true, //Italics, bold, etc. Default true
          "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
          "html": true, //Button which allows you to edit the generated HTML. Default false
          "link": true, //Button to insert a link. Default true
          "image": false, //Button to insert an image. Default true,
          "color": true //Button to change color of font  
  });
  $('#app-name').html(siteSettings.siteName);
  $('#app-modal-title').html(siteSettings.siteInfoTitle);
  $('#app-modal-body').html(siteSettings.siteInfoText);
  $('#infoModal').modal('show');
  // site cniofig modal settings
  $('#inSiteName').val(siteSettings.siteName);
  $('#inSiteInfoHeader').val(siteSettings.siteInfoTitle);
  $('#inSiteInfoBody').val(siteSettings.siteInfoText);
  $('#inMapZoom').val(siteSettings.mapZoom);
  $('#inMapLat').val(siteSettings.mapLat);
  $('#inMapLng').val(siteSettings.mapLng);
  $('#inMapIcon').val(siteSettings.mapMarkerIcon);
  $('#inMapMkrColor').val(siteSettings.mapMarkerColor);
  $('#inDrawMkrColor').val(siteSettings.drawMarkerColor);
  $('#inPtTypes').val(siteSettings.pointTypes);
}

$('#config').click(function(){$('#configModal').modal('show')});


// MAIN
function main(){
    $.ajax({
      type: "GET",
      url: "/backlift/auth/currentuser", 
      success: function() { 
        auth_login = true;
        $('#config-button').show();
      } ,
      error: function() {
        auth_login = false;
      }
    });
    
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
            baseConfig.save({},{
              success: function(){
                configSettings.fetch({
                    success: function () {
                      siteSettings = configSettings.first().attributes;
                      setSettings();
                      initialize();
                      addGeoJSON(); 
                    }
                });
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


function updateSite(siteName,siteInfoTitle,siteInfoText,mapZoom,mapLat,mapLng,mapMarkerIcon,mapMarkerColor,drawMarkerColor,pointTypes){
	var newSiteConfig = {};
	newSiteConfig.siteName = siteName;
	newSiteConfig.siteInfoTitle = siteInfoTitle;
	newSiteConfig.siteInfoText = siteInfoText;
	newSiteConfig.mapZoom = mapZoom;
	newSiteConfig.mapLat = mapLat;
	newSiteConfig.mapLng = mapLng;
	newSiteConfig.mapMarkerIcon = mapMarkerIcon;
	newSiteConfig.mapMarkerColor = mapMarkerColor;
	newSiteConfig.drawMarkerColor = drawMarkerColor;
	newSiteConfig.pointTypes = pointTypes;

	//console.log(newSiteConfig);
        var id = configSettings.first().id;
        var json = JSON2.stringify(newSiteConfig);
        $.ajax({
          type: "PUT",
          url: "/backlift/data/siteConfigs/"+id, 
          data: json,
          contentType: "application/json; charset=utf-8",
	  dataType: "json",
          success: function(result) { 
              location.reload();
          } 
        });
        
};

$("#site-config-form").validate({
	rules:{
	  inSiteName: {
	      required: true,
	      minlength: 3
	   },
	   inSiteInfoHeader: {
	      required: true,
	      minlength: 3
	   },
	   inSiteInfoBody: {
	      required: true,
	      minlength: 20
	   },
	   inMapZoom: {
	      required: true,
	      range: [3, 16]
	   },
	   inMapLat: {
	      required: true,
	      number: true
	   },
	   inMapLng: {
	      required: true,
	      number: true
	   },
	   inMapIcon: {
	      required: true
	   },
	   inMapMkrColor: {
	      required: true
	   },
	   inDrawMkrColor: {
	      required: true
	   },
	   inPtTypes: {
	      required: true
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
$("#site-config-form").submit(function(event) {		 
  /* stop form from submitting normally */
	  event.preventDefault();
	 $("#site-config-form").valid();
		bool = $("#site-config-form").valid();
		if (bool){
		    var $form = $( this ),
		    siteName = $form.find('input[id="inSiteName"]').val(),
		    siteInfoTitle = $form.find('input[id="inSiteInfoHeader"]').val(),
		    siteInfoText = $form.find('textarea[id="inSiteInfoBody"]').val(),
		    mapZoom = $form.find('input[id="inMapZoom"]').val(),
		    mapLat = $form.find('input[id="inMapLat"]').val(),
		    mapLng = $form.find('input[id="inMapLng"]').val(),
		    mapMarkerIcon = $form.find('input[id="inMapIcon"]').val(),
		    mapMarkerColor = $form.find('select[id="inMapMkrColor"]').val(),
		    drawMarkerColor = $form.find('select[id="inDrawMkrColor"]').val(),
		    pointTypesRaw = $form.find('input[id="inPtTypes"]').val(),
		    pointTypes = pointTypesRaw.split(',');
	  	    updateSite(siteName,siteInfoTitle,siteInfoText,mapZoom,mapLat,mapLng,mapMarkerIcon,mapMarkerColor,drawMarkerColor,pointTypes);
		}
});

