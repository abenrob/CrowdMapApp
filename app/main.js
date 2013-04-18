function main(){
  	var $nav = $('.navbar');
  	var $map = $('#map');
  	var $body = $('body');
  
  	$map.css('top',$nav.height());
  	$map.height($body.height()-$nav.height());
  	
  	$('#infoModal').modal('show');
  	
  	initialize();
  	addGeoJSON();  
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


