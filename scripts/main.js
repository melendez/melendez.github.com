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
	
	// load google feeds
	google.load('feeds','1');
	
});

$(window).load(function(){
	
	// initialize nivo slider
	$('#slider').nivoSlider();
	



	// initialze google feed
	rssfeedsetup();
	
	// feeds
	//$('div#feed ul li').hide();
	
});

// google feeds
var feedcontainer = document.getElementById('feed');
var feedurl = 'http://www.houselogic.com/news/rss/';
var feedlimit = 10;
var rssoutput = '<strong>Latest HouseLogic News:</strong><ul>';

function rssfeedsetup() {
	var feedpointer = new google.feeds.Feed(feedurl);
	feedpointer.setNumEntries(feedlimit);
	feedpointer.load(displayfeed);
}

function displayfeed(result){
	if(!result.error){
		var thefeeds = result.feed.entries;
		for(var i=0; i < thefeeds.length; i++){
			rssoutput += "<li>&#187; <a href='"+thefeeds[i].link+"'>"+thefeeds[i].title+"</a></li>";
		}
		rssoutput += '</ul>';
		feedcontainer.innerHTML = rssoutput;
	}
	else {
		document.getElementById('feed').innerHTML = '[Error fetching feeds]';
	}
}