'use strict';
$(document).ready(function(){
	//variables
	window.myLocation = {};
	window.fullScootersList = null;
	window.markers = [];
	window.listSearch = [];
	window.map;


	//function call
	
	setTimeout(function(){
		getLocation();
	},50);

	setTimeout(function(){
		var rs = getAllScooters();
		fullScootersList = rs;
	},1000);
	
	setTimeout(function(){
		initMap();
	},4000);

	//search 
	$('#findScooter button[name=findScooter]').on('click', function(){
		// console.log(myLocation);
		clearMarkers();
		
		var distance = $('input[name=radius]').val();

		for (var key in fullScootersList) {

			var lat = fullScootersList[key].lat;
			var long = fullScootersList[key].long;

			var x = getDistanceFromLatLonInKm(myLocation.latitude, myLocation.longitude, lat, long);
			if (x <= parseInt(distance)) {

				listSearch.push(fullScootersList[key]);
			}
		}

		drop(listSearch, map);


	});
	
	//event Listeners

	$('#clickRandom').on('click', function(){
		var rdLong = generateRandomLong();
		var rdLat = generateRandomLat();
		$('#addScooter').find('input[name=lat]').val(rdLat);
		$('#addScooter').find('input[name=long]').val(rdLong);
		$('#addScooter').find('input[name=Country]').val('Some where...');
		$('#addScooter').find('input[name=Name]').val('Scooter...');
	});

	//create
	$('input[type=submit]').on('click', function(e){
		e.preventDefault();
		var Obj = $('#addScooter');
		var lat = Obj.find('input[name=lat]').val();
		var long = Obj.find('input[name=long]').val();
		var country = Obj.find('input[name=Country]').val();
		var name = Obj.find('input[name=Name]').val();

		var rs = createScooter (lat, long, country, name);
		Obj.find('.inputField').val('').text('');
	});

//validation
	$("input[name=long]").focusout(function () {
	    // debugger;
	    var lngVal = /^-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}$/;
	    if (!lngVal.test(this.value)) {
	    	alert('Longtitude is invalid');
	    	this.focus();
	    }
	});

	$("input[name=lat]").focusout(function () {
	    var latVal = /^-?([0-8]?[0-9]|90)\.[0-9]{1,6}$/;
	    if (!latVal.test(this.value)) {
	    	alert('Latittude is invalid');
	    	this.focus();
	    }
	});



// FUNCTIONS DECLARE ONLY

	function getLocation() {
	  if (navigator.geolocation) {
	  		navigator.geolocation.getCurrentPosition(showPosition);
	  } else {
	    alert("Geolocation is not supported by this browser.");
	  }
	}

	function showPosition(position) {
		myLocation.latitude = position.coords.latitude;
		myLocation.longitude = position.coords.longitude;
	  $('#myLocation').find('#latitude').text(position.coords.latitude);
	  $('#myLocation').find('#longitude').text(position.coords.longitude);
	  // console.log(myLocation);
	}

	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180)
	}

	// LONGITUDE -180 to + 180
	function generateRandomLong() {
	    var num = (Math.random()*180).toFixed(5);
	    var posorneg = Math.floor(Math.random());
	    if (posorneg == 0) {
	        num = num * -1;
	    }
	    return num;
	}
	// LATITUDE -90 to +90
	function generateRandomLat() {
	    var num = (Math.random()*90).toFixed(5);
	    var posorneg = Math.floor(Math.random());
	    if (posorneg == 0) {
	        num = num * -1;
	    }
	    return num;
	}

	function createScooter (lat, long, country, name) {

		var data = JSON.stringify( {
		    	"lat": lat,
		    	"long": long,
		    	"country": country,
		    	"name": name
			});
		var uri = document.location.href + 'createScooter';

		$.ajax({
		    type: "GET",
		    url: uri,
		    contentType: 'application/json',
		    data: data,
		    success: function(response){
		    	if (response.rowCount == 1)
		    		alert('Scooter is created');
		    		location.reload();
		    },
		    error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
		    }

		  });
	}

	function getAllScooters () {
		var rs = null;
		var uri = document.location.href + 'getScooters';
		$.ajax({
	        type: "GET",
	        url: uri,
	        contentType: 'application/json',
	        async: false,
	        success: function(response) {
	              rs = response;
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	                console.log("API error" + textStatus + errorThrown);
	                return;
	        }
	    });
	    return rs;
	};

	function initMap() {
		if (Object.keys(myLocation).length) {
				window.map = new google.maps.Map(document.getElementById('map'), {
			    zoom: 2,
			    center: {lat: parseFloat(myLocation.latitude), lng: parseFloat(myLocation.longitude)}
			  });

			  var marker = new google.maps.Marker({
			    map: map,
			    draggable: true,
			    animation: google.maps.Animation.DROP,
			    position: {lat: parseFloat(myLocation.latitude), lng: parseFloat(myLocation.longitude)}
			  });

		} else {
			alert ("Can't not get your location");
			location.reload();
			
		}
	  
	}

	function clearMarkers () {
		for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        listSearch = [];
	}

	function drop(listSearch ,map) {

		if (listSearch.length > 0)
		{
			for (var i = 0; i < listSearch.length; i ++) {

			      addMarker(JSON.stringify( listSearch[i]), map);
			}
		}
	}

	// Adds a marker to the map.
	function addMarker(scooter, map) {
		var scooter = JSON.parse(scooter);
		var _lat = parseFloat(scooter.lat);
  		var _long = parseFloat(scooter.long);
		var label = scooter.name;
		var name = scooter.name;

		var marker = new google.maps.Marker({
		    position: { lat: _lat, lng: _long},
		    icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
		    label: label,
		    map: map,
		    title: name,
		    draggable: true,
			animation: google.maps.Animation.DROP
	  	});
	  	marker.setMap(map);
	  	window.markers.push(marker);
		
	}

});


