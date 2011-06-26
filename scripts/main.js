$(document).ready(function(){
	
	// check pathname and add selected class to nav link
	var pathname = window.location.pathname;
	$('nav ul#nav li a').each(function(){
		if($(this).attr('href') == pathname){
			$(this).addClass('selected');
		}
	});	
	
	$('ul#nav li').click(function(){
		$(this).find('ul.subnav').slideDown('fast').show();
		},
		function(){
			$(this).find('ul.subnav').slideUp('fast');
		}
	);
	
	updateClock();
	setInterval('updateClock()', 60000 );
	updateDate();

});

$(window).load(function(){
	
	// initialize nivo slider
	$('div#slider').nivoSlider({
		pauseTime: 5000
	});
	
});

function updateClock ( )
{
  var currentTime = new Date ( );

  var currentHours = currentTime.getHours ( );
  var currentMinutes = currentTime.getMinutes ( );
  var currentSeconds = currentTime.getSeconds ( );

  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Choose either "AM" or "PM" as appropriate
  var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

  // Update the time display
  document.getElementById("clock").firstChild.nodeValue = currentTimeString;
}

function updateDate(){
	var date = new Date(); var day = date.getDay()+'/'+date.getMonth();
	document.getElementById("day").firstChild.nodeValue = day;
}
