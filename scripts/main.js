function onYouTubeIframeAPIReady() {
	//play YouTube video on button click
	$('#play-video').click(function() {
		new YT.Player('player', {
			width: '960',
			height: '540',
			videoId: 'ruTB5jBGXsE',
			events: {
				'onReady': onPlayerReady
			}
		});
		
		function onPlayerReady(event) {
			event.target.playVideo();
		}
		
		$(this).hide();
		
		return false;
	});
}

/**
 * ICO counter
 */
$(function() {
	// Set the date we're counting down to
	var countDownDate = new Date("Nov 1, 2017 00:00:00").getTime();
	var $timer = $('#timer');
	
	// Update the count down every 1 second
	setInterval(function() {
		// Get today's date and time
		var now = new Date().getTime();
		
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		$timer.find('.timer-day').html(n(days));
		$timer.find('.timer-hour').html(n(hours));
		$timer.find('.timer-min').html(n(minutes));
		$timer.find('.timer-sec').html(n(seconds));
		
		// If the count down is over, write some text
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("demo").innerHTML = "EXPIRED";
		}
	}, 1000);
	
	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}
});

$(function() {
	var $header = $('#main-header');
	$header.waypoint(function(dir) {
		console.log(dir);
		if (dir === 'down') {
			$header.addClass('fixed-header');
		} else {
			$header.removeClass('fixed-header');
		}
	}, {
		offset: -50
	});
});
