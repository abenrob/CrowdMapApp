function main(){
  var $nav = $('.navbar');
  var $map = $('#map');
  var $body = $('body');
  
  
  $map.css('top',$nav.height());
  $map.height($body.height()-$nav.height());
  initialize();
  addGeoJSON();
  
}
$(main);