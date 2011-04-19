$(document).ready(function(){
	
	// check pathname and add selected class to nav link
	var pathname = window.location.pathname;
	$('ul.nav li a').each(function(){
		if($(this).attr('href') == pathname){
			$(this).addClass('selected');
		}
	});	
	
	$('ul.nav li').hover(function(){
		$(this).find('ul.subnav').slideDown('fast').show();
		},
		function(){
			$(this).find('ul.subnav').slideUp('fast');
		}
	);
	
	//hide last 5 links
	$('a.more').click(function(){
		$('div#feed ul li:gt(5)').slideDown(fast);
	});
	
});

$(window).load(function(){
	
	// initialize nivo slider
	$('#slider').nivoSlider();

	
});

//load google feeds
google.load('feeds','1');