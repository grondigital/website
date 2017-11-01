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
			['Marketing', 12],
			['Legal Framework and Finance', 5],
			['Contingencies', 5]
		]);
		var colors = ['#60626f', '#727480', '#898b94', '#a5a6ae', '#b9babf', '#cfd0d4'];
		
		drawChart('Funds Allocation', data, colors, document.getElementById('funds-chart'));
	}
	
	var $tokens = $('#tokens-chart'), tokensWidth = $tokens.width(),
		$funds = $('#funds-chart'), fundsWidth = $funds.width();
	
	google.charts.load('current', {packages: ['corechart']});
	google.charts.setOnLoadCallback(drawTokensChart);
	google.charts.setOnLoadCallback(drawFundsChart);
	$(window).resize(function() {
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
	})
})();
