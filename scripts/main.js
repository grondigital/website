//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

/**
 * ICO counter
 */
$(function() {
	// Set the date we're counting down to
	var countDownDate = new Date("Dec 1, 2017 00:00:00").getTime();
	var $timer = $('#timer');
	
	if ($timer.length) {
		// Update the count down every 1 second
		setInterval(function () {
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
		}, 1000);
	}
	
	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}
});

/**
 * Common manipulations
 */
$(function() {
	//functions to lock scrolling
	var $html = $('html'),
		$body = $('body');
	function lockBody() {
		var oWidth = $body.outerWidth(true);
		$body.css({overflow: 'hidden'});
		var sbWidth = $body.outerWidth(true) - oWidth;
		
		if (sbWidth!==0) {
			$html.css({marginRight: sbWidth});
		}
	}
	function unlockBody() {
		$body.css({overflow: 'visible'});
		$html.css({marginRight: 0});
	}
	
	
	//change header style on scroll
	var $header = $('#main-header');
	$('body > section:first-of-type').waypoint(function(dir) {
		if (dir === 'down') {
			$header.addClass('fixed-header');
		} else {
			$header.removeClass('fixed-header');
		}
	}, {
		offset: -50
	});
	
	
	//top menu open/close events
	var $menu = $('#top-menu'),
		$menuButton = $menu.find('.menu-button'),
		$shim = $('#shim');
	function showMenu() {
		lockBody();
		$menu.addClass('open');
		$menuButton.removeClass('icon-menu').addClass('icon-cancel');
		$shim.show().on('click.menu', function() {
			hideMenu();
		});
	}
	function hideMenu() {
		unlockBody();
		$menu.removeClass('open');
		$menuButton.removeClass('icon-cancel').addClass('icon-menu');
		$shim.hide().off('click.menu');
	}
	$menuButton.click(function() {
		if (!$menu.hasClass('open')) {
			showMenu();
		} else {
			hideMenu();
		}
		return false;
	});
	$menu.find('ul a').click(function() {
		hideMenu();
	});
	
	
	//subscribe form
	var $subFormShim = $('#subscribe-shim'), 
		$subForm = $('#subscribe-form');
	function showSubForm() {
		lockBody();
		$subFormShim.show();
		$('#subscribe-email').focus();
		setCookie('subscribe_form', '1', 30);
	}
	function hideSubForm() {
		unlockBody();
		$subFormShim.hide();
	}
	$subForm.find('.close-popup').click(function() {
		hideSubForm();
		return false;
	});
	//hide on click on shim...
	$subFormShim.on('click.subForm', function() {
		hideSubForm();
	});
	//... but do not close if clicked on form
	$subForm.on('click', function(e) {
		e.stopPropagation();
	});
	
	$('#subscribe-btn').click(function() {
		showSubForm();
		return false;
	});
	if ($subForm.length) {
		$('#timeline-section').waypoint(function() {
			if (!getCookie('subscribe_form'))
				showSubForm();
		});
	}
	
	
	//Contact us form
	var $contactFormContainer = $('#contact-form-container'),
		$contactForm = $('#contact-form'),
		$contactFormLoader = $contactFormContainer.find('.loader');
	$contactForm.submit(function() {
		var formData = $contactForm.serialize();
		
		$contactForm.find('.error').remove();
		$contactFormContainer.addClass('loading');
		$contactForm.find(':input').prop('disabled', true);
		$contactFormLoader.show();
		
		$.post($contactForm.attr("action"), formData).done(function() {
			$contactForm.replaceWith('<div class="thank-you">Thank you!</div>');
		}).fail(function() {
			$contactForm.prepend('<div class="error">Something went wrong! Please, try again later.</div>')
		}).always(function() {
			$contactFormContainer.removeClass('loading');
			$contactForm.find(':input').prop('disabled', false);
			$contactFormLoader.hide();
		});
		
		return false;
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
 * Particle background
 */
$(function() {
	if (window.Particles) {
		Particles.init({
			selector: '#particles',
			color: '#6b7a8f',
			maxParticles: 200,
			connectParticles: true,
			responsive: [
				{
					breakpoint: 1200,
					options: {
						maxParticles: 100
					}
				}, {
					breakpoint: 375,
					options: {
						maxParticles: 50
					}
				}
			]
		});
	}
});

/**
 * Smooth page scrolling
 * 
 * See:
 * - https://stackoverflow.com/a/13067009
 * - http://jsfiddle.net/ianclark001/rkocah23/
 */
(function(document, history, location) {
	var HISTORY_SUPPORT = !!(history && history.pushState);
	
	var anchorScrolls = {
		ANCHOR_REGEX: /^#[^ ]+$/,
		OFFSET_HEIGHT_PX: 50,
		
		/**
		 * Establish events, and fix initial scroll position if a hash is provided.
		 */
		init: function() {
			this.scrollToCurrent();
			$(window).on('hashchange', $.proxy(this, 'scrollToCurrent'));
			$('body').on('click', 'a', $.proxy(this, 'delegateAnchors'));
		},
		
		/**
		 * Return the offset amount to deduct from the normal scroll position.
		 * Modify as appropriate to allow for dynamic calculations
		 */
		getFixedOffset: function() {
			return this.OFFSET_HEIGHT_PX;
		},
		
		/**
		 * If the provided href is an anchor which resolves to an element on the
		 * page, scroll to it.
		 * @param  {String} href
		 * @return {Boolean} - Was the href an anchor.
		 */
		scrollIfAnchor: function(href, pushToHistory) {
			var match, anchorOffset;
			
			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}
			
			match = document.getElementById(href.slice(1));
			
			if (match) {
				anchorOffset = $(match).offset().top - this.getFixedOffset();
				$('html, body').animate({scrollTop: anchorOffset}, 1000);
				
				// Add the state to history as-per normal anchor links
				if (HISTORY_SUPPORT && pushToHistory) {
					history.pushState({}, document.title, location.pathname + href);
				}
			}
			
			return !!match;
		},
		
		/**
		 * Attempt to scroll to the current location's hash.
		 */
		scrollToCurrent: function(e) {
			if (this.scrollIfAnchor(window.location.hash) && e) {
				e.preventDefault();
			}
		},
		
		/**
		 * If the click event's target was an anchor, fix the scroll position.
		 */
		delegateAnchors: function(e) {
			var elem = e.target;
			
			if (this.scrollIfAnchor(elem.getAttribute('href'), true)) {
				e.preventDefault();
			}
		}
	};
	
	$(document).ready($.proxy(anchorScrolls, 'init'));
})(window.document, window.history, window.location);

(function() {
	function drawChart(title, data, colors, el) {
		var chart = new google.visualization.PieChart(el);
		chart.draw(data, {
			title: title,
			titleTextStyle: {
				color: '#415275',
				fontSize: 16
			},
			backgroundColor: '#f3f4f6',
			colors: colors,
			chartArea: {
				left: '5%',
				top: 10,
				width: '90%',
				height: '90%'
			},
			pieSliceText: 'value',
			tooltip: {
				trigger: 'none'
			},
			legend: {
				position: 'labeled'
			}
		});
		
		return chart;
	}
	
	function drawTokensChart() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Distribution');
		data.addColumn('number', '%');
		data.addRows([
			['Public Token Sale', 60],
			['Initial Bank Roll', 16],
			['Team incentives and bonuses', 12],
			['Founders', 12]
		]);
		var colors = ['#415275', '#76819b', '#a4acbd', '#dbdee5'];
		
		drawChart('Token Distribution', data, colors, document.getElementById('tokens-chart'));
	}
	
	function drawFundsChart() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Distribution');
		data.addColumn('number', '%');
		data.addRows([
			['Software Development', 50],
			['Operations', 15],
			['Advisors', 15],
			['Marketing', 10],
			['Legal Framework and Finance', 5],
			['Contingencies', 5]
		]);
		var colors = ['#60626f', '#727480', '#898b94', '#a5a6ae', '#b9babf', '#cfd0d4'];
		
		drawChart('Funds Allocation', data, colors, document.getElementById('funds-chart'));
	}
	
	var $tokens = $('#tokens-chart'), tokensWidth = $tokens.width(),
		$funds = $('#funds-chart'), fundsWidth = $funds.width();
	
	if (!$tokens.length && !$funds.length)
		return;
	
	google.charts.load('current', {packages: ['corechart']});
	google.charts.setOnLoadCallback(drawTokensChart);
	google.charts.setOnLoadCallback(drawFundsChart);
	
	//resize debouncing https://css-tricks.com/snippets/jquery/done-resizing-event/
	var resizeTimer;
	$(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			//resizing has "stopped"
			var newTokensWidth = $tokens.width(),
				newFundsWidth = $funds.width();
			if (newTokensWidth !== tokensWidth) {
				drawTokensChart();
				tokensWidth = newTokensWidth;
			}
			if (newFundsWidth !== fundsWidth) {
				drawFundsChart();
				fundsWidth = newFundsWidth;
			}
		}, 250);
	});
})();
