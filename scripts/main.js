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

});

$(window).load(function(){
	
	// initialize nivo slider
	$('div#slider').nivoSlider({
		pauseTime: 5000
	});
	
});