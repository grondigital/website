/* scripts used only on home page */
/**
 * Common manipulations
 */
$(function() {
	$('#partners').on('contextmenu', false);
	
	//top image fade in/out
	var $topImage = $('#top-image'),
		topImgDrag = false;
	//standard hover for desktop browsers
	$topImage.hover(function () {
		$topImage.addClass('hover');
	}, function () {
		$topImage.removeClass('hover');
	});
	//touch click (except draggling) for mobile browsers
	$topImage.on('touchmove', function () {
		topImgDrag = true;
	});
	$topImage.on('touchend', function () {
		if (topImgDrag) {
			topImgDrag = false;
			return;
		}
		$topImage.toggleClass('hover');
		return false; //discard other mouse events - hover, click
	});
});

/**
 * Main menu item highlighting
 */
$(function() {
	var $menu = $('#top-menu'),
		$links = $menu.find('a'),
		isScrolling = false; //whether we're doing scroll animation now
	
	/**
	 * Set active main menu item by link hash
	 *
	 * @param {string} hash
	 */
	function setActiveItem(hash) {
		var $currentLink = (hash === 'top-section')?
			$menu.find('li:first-child a') :
			$menu.find('a[href*="' + hash + '"]');
		if ($currentLink.length) {
			$links.removeClass('active');
			$currentLink.addClass('active');
		}
	}
	
	/**
	 * Called when user scrolls to a section
	 *
	 * Activates menu item if we're not animating scroll now
	 * @param {string} id Section ID.
	 */
	function onEnterSection(id) {
		if (!isScrolling) {
			setActiveItem(id);
		}
	}
	
	//set active menu item on link click and determine scroll animation status
	$(window).on('scrollStart', function(e, id) {
		isScrolling = true;
		setActiveItem(id);
	}).on('scrollEnd', function(e, id) {
		isScrolling = false;
	});
	
	//2 waypoints are created for each section:
	// first is triggered when user scrolls down and top of section hits center of the screen
	// second is triggered when user scrolls up and bottom of section reaches center of the screen
	var $sections = $('section');
	$sections.waypoint(function(dir) {
		var id = this.element.id;
		if (dir === 'down' && id !== '') {
			onEnterSection(id);
		}
	}, {
		offset: '50%'
	});
	$sections.waypoint(function(dir) {
		var id = this.element.id;
		if (dir === 'up' && id !== '') {
			onEnterSection(id);
		}
	}, {
		offset: function() {
			//center of screen minus element height,
			//see example here: http://imakewebthings.com/waypoints/api/viewport-height/
			return Waypoint.viewportHeight()*0.5 - this.element.clientHeight;
		}
	});
});

/**
 * Particle background
 */
$(function() {
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
});

/**
 * Statistics progress
 */
/*
$(function () {

	var num = parseInt($('#progress_sold').text().replace(/,/g, ""));
	var sold = num / (17000000 / 100);
	var left = 100 - sold;
	
	$('.bg-sold').css('width', sold.toFixed(2) + '%');
	$('.bg-sold .progress-number').text(sold.toFixed() + '%');
	$('.bg-available').css('width', left.toFixed(2) + '%');
});
*/

/**
 * YouTube API load callback
 */
function onYouTubeReady() {
	var player = new YT.Player('gro-video', {
		events: {
			'onStateChange': onPlayerStateChange
		}
	});
	
	function onPlayerStateChange(event) {
		//show CTA button when video ends
		var $btn = $('#video-btn');
		switch (event.data) {
			case YT.PlayerState.ENDED:
				$btn.show();
				break;
			
			default:
				$btn.hide();
		}
	}
}

/**
 * Contact US form
 */
$(function () {
	var $contactFormContainer = $('#contact-form-container'),
		$contactForm = $('#contact-form'),
		$contactFormLoader = $contactFormContainer.find('.loader');
	$contactForm.submit(function() {
		var formData = $contactForm.serialize();
		
		$contactForm.find('.error').remove();
		$contactFormContainer.addClass('loading');
		$contactForm.find(':input').prop('disabled', true);
		$contactFormLoader.show();
		
		trk('Participate', 'Contact us', 'Send Message');
		$.post($contactForm.attr("action"), formData).done(function() {
			$contactForm.replaceWith('<div class="thank-you">Thank you for enquiry. We will get back to you shortly.</div>');
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
 * Timeline slider
 */
$(function() {
	var slider = new Swiper('#timeline-slider .swiper-container', {
		//spaceBetween: 20,
		slidesPerView: 'auto',
		slidesPerGroup: 5,
		breakpoints: {
			1169: {
				slidesPerGroup: 3
			},
			899: {
				slidesPerGroup: 2
			},
			609: {
				slidesPerGroup: 1
			}
		},
		pagination: {
			el: '#timeline-slider .pagination-bullets',
			clickable: true,
			bulletClass: 'bullet',
			bulletActiveClass: 'active'
		},
		navigation: {
			nextEl: '#timeline-slider .next',
			prevEl: '#timeline-slider .prev',
			disabledClass: 'disabled',
			hiddenClass: 'disabled'
		}
	});
});

/**
 * Media slider
 */
$(function() {
	var slider = new Swiper('#media-slider .swiper-container', {
		slidesPerView: 1,
		pagination: {
			el: '#media-slider .pagination-bullets',
			clickable: true,
			bulletClass: 'bullet',
			bulletActiveClass: 'active'
		},
		navigation: {
			nextEl: '#media-slider .next',
			prevEl: '#media-slider .prev',
			disabledClass: 'disabled',
			hiddenClass: 'disabled'
		}
	});
});

/**
 * Charts
 */
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
