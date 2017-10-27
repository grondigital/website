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

/**
 * Common manipulations
 */
$(function() {
	var $header = $('#main-header'),
	    $menu = $('#top-menu');
	
	//change header style on scroll
	$('#top-section').waypoint(function(dir) {
		if (dir === 'down') {
			$header.addClass('fixed-header');
		} else {
			$header.removeClass('fixed-header');
		}
	}, {
		offset: -50
	});
	
	//top menu open/close events
	$menu.find('.menu-button').click(function() {
		$menu.toggleClass('open');
		return false;
	});
	$menu.find('ul a').click(function() {
		$menu.removeClass('open');
	});
});

/**
 * Animate On Scroll initialization
 */
$(function() {
	AOS.init({
		easing: 'ease-out-back',
		once: true
	});
});

/**
 * Smooth page scrolling
 * 
 * See:
 * - https://css-tricks.com/snippets/jquery/smooth-scrolling/#article-header-id-1
 * - https://css-tricks.com/smooth-scrolling-accessibility/#article-header-id-3
 * - http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links
 */
$(function() {
	// filter handling for a /dir/ OR /indexordefault.page
	function filterPath(string) {
		return string
			.replace(/^\//, '')
			.replace(/(index)\.html?$/, '')
			.replace(/\/$/, '');
	}
	
	var locationPath = filterPath(location.pathname);
	$('a[href*="#"]')
		// Remove links that don't actually link to anything
		.not('[href="#"]')
		.not('[href="#0"]')
		.each(function() {
			var thisPath = filterPath(this.pathname) || locationPath;
			var hash = this.hash.replace(/#/, '');
			if (hash !== '' &&
				locationPath === thisPath &&
				(location.hostname === this.hostname || !this.hostname)) {
				var $target = $(this.hash);
				if ($target.length) {
					$(this).click(function(event) {
						event.preventDefault();
						$('html, body').animate({scrollTop: $target.offset().top}, 1000, function () {
							location.hash = hash;
							$target.focus();
							if ($target.is(":focus")){ //checking if the target was focused
								return false;
							}else{
								$target.attr('tabindex', '-1'); //Adding tabindex for elements not focusable
								$target.focus(); //Setting focus
							}
						});
					});
				}
			}
	});
});
