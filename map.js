/*************************************************************
 map.js
 	this file is google map javascript file 
*************************************************************/
var map;
//$(document).on('page:load',function(){
$(document).ready(function(){
/***************************************************************************
	Gmaps - Default Value 
***************************************************************************/

	// default location  
	// prettyPrint();

	map = new GMaps({
	  div: '#map-canvas',
	  lat: 37.7849737,
    lng: -122.4078593,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	var path=[];
	var p = [[-12.040397656836609,-77.03373871559225],[-12.040248585302038,-77.03993927003302],[-12.050047116528843,-77.02448169303511],[-12.044804866577001,-77.02154422636042]];
	for(i in p){
	  latlng = new google.maps.LatLng(p[i][0], p[i][1]);
	  path.push(latlng);
  }

/*****************************************************************************
	Gmaps - Polygon Setting 
*****************************************************************************/
   
// polygon = map.drawPolygon({
//   paths: path,
//   strokeColor: '#BBD8E9',
//   strokeOpacity: 1,
//   strokeWeight: 3,
//   fillColor: '#BBD8E9',
//   fillOpacity: 0.6
// });

/******************************************************************************
      	Gmaps -  addMarker - add pins to a map 
******************************************************************************/

// map.addMarker({
//   lat: 37.771270,
//   lng: -122.420091,
//   draggable: true,
//   //fences: [polygon],
//   outside: function(m, f){
//     alert('This marker has been moved outside of its fence');
//   }
// });


/*******************************************************************************
      Gmaps -  get current location form devise and show the location to the map
*******************************************************************************/

GMaps.geolocate({
 success: function(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
 },
 error: function(error) {
   alert('Geolocation failed: '+error.message);
 },
 not_supported: function() {
   alert("Your browser does not support geolocation");
 },
 always: function() {
    // do nothing 
 }
});	

/***********************************************************************************
	Meetup.com API - get group evet 
	use 
https://api.meetup.com/2/events?&sign=true&status=past&rsvp=yes&member_id=35192522&page=100
to get list of attended event 

the "venue" has lon (longitude) and lat (latitude) so it will be usefull for geographic thing 
more informationa about this 
http://www.meetup.com/meetup_api/console/?path=/2/events
************************************************************************************/

$.ajax({
  type: "results",
  url : 'http://api.meetup.com/2/events?status=past&order=time&limited_events=False&rsvp=yes&desc=false&member_id=35192522&offset=0&format=json&page=100&fields=&sig_id=35192522&sig=73d4ca6fc1bbd5f1068283b2b7970a7ba2cc3f3a',
  dataType: "jsonp",
  success:function(data) {
    var i = data.results.length;
    // alert(i);
    var x=0;
    var post;
    for(x;x<i;x++)
    {
      post = data.results[x];
      //     alert(post.venue.name);
  		gmapsAddMaker(map,post.venue.lat,post.venue.lon,post.group.name,post.name,post.venue.name,post.time,"meetup",post.event_url);
    }
  }
});

function gmapsAddMaker(map,la,ln,group_name,name,venue_name,time, type,url)
{	
	var datetime = new Date(time);
    map.addMarker({
    lat: la,
    lng: ln,
    draggable: true,
   // fences: [polygon],
    outside: function(m, f){
      alert('This marker has been moved outside of its fence');
    },
	  infoWindow: {
		 content: "<div class='infoWindow_Wrapper "+type+ "'>" +
		  "<h3>"+ group_name +"</h3>" +
		  "<h4>"+ name + "</h4>"+
		  "<p>Where : "+ venue_name +"<br />"+
		  "<a href='"+url+"' title='detail' target='_blank' style='color:#000000'>Event Detail</a><br />"+
		  "When : " + datetime +"</p>"+
	    "</div>"
	  }
	  
	});
      }
	
});
