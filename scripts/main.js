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

//https://stackoverflow.com/a/901144
function getQueryParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Functions to lock scrolling
 */
$(function () {
  var $html = $('html'),
    $body = $('body');
  lockBody = function () {
    var oWidth = $body.outerWidth(true);
    $body.css({overflow: 'hidden'});
    var sbWidth = $body.outerWidth(true) - oWidth;
    
    if (sbWidth!==0) {
      $html.css({marginRight: sbWidth});
    }
  };
  unlockBody = function () {
    $body.css({overflow: 'visible'});
    $html.css({marginRight: 0});
  }
});

/**
 * Event tracking
 */
function trk(category, action, label) {
	category = category || '';
	action = action || '';
	label = label || '';
	
	dataLayer && dataLayer.push({
		'event': 'eventTracking',
		'category': category,
		'action': action,
		'label': label
	});
	
	fbq && fbq('trackCustom', category, {
		'action': action,
		'label': label
	});
}
$(function () {
	var $tracked = $('[data-ev-category]');
	$tracked.click(function () {
		var $this = $(this);
		
		var category = $(this).data('ev-category'),
				action = $(this).data('ev-action') ? $(this).data('ev-action') : '',
				label = $(this).data('ev-label') ? $(this).data('ev-label') : '';
		
		//special default values for links and buttons
		if (action==='' && $this.is('a')) {
			action = $this.attr('href');
		}
		if (action==='' && ($this.is('button') || $this.is('input[type="submit"]'))) {
			action = $this.attr('name');
		}
		if (label==='' && ($this.is('a') || $this.is('button'))) {
			label = $.trim($this.text());
		}
		if (label==='' && $this.is('input[type="submit"]')) {
			label = $this.val();
		}
		
		trk(category, action, label);
	});
});

/**
 * ICO counter
 */
$(function() {
	// Set the date we're counting down to
	var roundDates = [
		new Date('2018-01-09T00:00:00Z').getTime(), //pre-ICO
		new Date('2018-02-06T00:00:00Z').getTime(), //round 1
		new Date('2018-02-20T00:00:00Z').getTime(), //round 2
		new Date('2018-03-06T00:00:00Z').getTime(), //round 3
		new Date('2018-03-20T00:00:00Z').getTime()  //round 4
	];
	// select first round date which is after current
	var now = new Date().getTime(), countDownDate, currentRound = 4;
	for (var i=0; i<roundDates.length; i++) {
		countDownDate = roundDates[i]; //TODO: what will happen after round 4 will be started?
		if (now < countDownDate) {
			switch (i) {
				case 0:
					currentRound = 'pre-pre';
					break;
				
				case 1:
					currentRound = 'pre';
					break;
				
				default:
					currentRound = i-1;
			}
			
			break;
		}
	}
	
	//set body classes according to current ICO stage
	$('body')
	  .removeClass('ico-current-pre-pre ico-current-pre ico-current-1 ico-current-2 ico-current-3 ico-current-4')
	  .addClass('ico-current-'+currentRound);
	
	var $timer = $('.timer');
	if ($timer.length) {
		updateTimer($timer);
		$timer.addClass('shown');
		
		// Update the count down every 1 second
		setInterval(function () {
			updateTimer($timer);
		}, 1000);
	}
	
	function updateTimer($timer) {
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
	}
	
	function n(n){
		return n > 9 ? "" + n: "0" + n;
	}
});

/**
 * Common manipulations
 */
$(function() {
	//change header style on scroll
	var $header = $('#main-header'),
	    $topLink = $('#to-top');
	$('body > section:first-of-type').waypoint(function(dir) {
		if (dir === 'down') {
			$header.addClass('fixed-header');
			$topLink.show();
		} else {
			$header.removeClass('fixed-header');
			$topLink.hide();
		}
	}, {
		offset: -50
	});
	
	$('#logo, #partners').on('contextmenu', false);
	
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
	
	//top image fade in/out
	var $topImage = $('#top-image'),
		topImgDrag = false;
	//standard hover for desktop browsers
	$topImage.hover(function() {
		$topImage.addClass('hover');
	}, function() {
		$topImage.removeClass('hover');
	});
	//touch click (except draggling) for mobile browsers
	$topImage.on('touchmove', function() {
		topImgDrag = true;
	});
	$topImage.on('touchend', function() {
		if (topImgDrag) {
			topImgDrag = false;
			return;
		}
		$topImage.toggleClass('hover');
		return false; //discard other mouse events - hover, click
	});
	
	//touches & clicks on floating social links
	var $socFloat = $('#social-float a'),
	    socFloatDrag = false;
	//standard hover for desktop browsers
	$socFloat.hover(function() {
		$(this).addClass('hover');
	}, function() {
		$(this).removeClass('hover');
	});
	//touch click (except draggling) for mobile browsers
	$socFloat.on('touchmove', function() {
		socFloatDrag = true;
	});
	$socFloat.on('touchend', function(e) {
		if (socFloatDrag) {
			socFloatDrag = false;
			return;
		}
		
		var $this = $(this);
		
		//disable desktop hover emulation if user used his finger
		$(this).off('mouseenter mouseleave');
		
		//is touch was on social logo
		var isImg = e.target.nodeName.toLowerCase() === 'img';
		
		//discard other mouse events (click) if touch was on logo
		if (isImg) {
			e.preventDefault();
		}
		
		//always change hover state
		$this.toggleClass('hover');
	});
	
	//scroll animation status
	var isScrolling = false;
	$(window).on('scrollStart', function(e, id) {
		isScrolling = true;
	}).on('scrollEnd', function(e, id) {
		isScrolling = false;
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
	
	$('.subscribe-btn').click(function() {
		showSubForm();
		return false;
	});
	if ($subForm.length) {
		$('#timeline-section').waypoint(function() {
			if (
				!getCookie('subscribe_form') &&
				!isScrolling
			)
				showSubForm();
		});
	}
	
	$subForm.submit(function () {
		trk('Subscribe', 'submit', 'Submit');
	});
	
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
 * The Participate form
 */
$(function () {
	//TODO: unify this with Subscribe & Contact Us forms
	var $form = $('#participate-form');
	
	if (!$form.length)
		return;
	
	var $container = $('#participate'),
	    $loader = $container.find('.loader'),
	    $required = $form.find(':required'),
	    $submit = $form.find(':submit');
	
	var currentStep = 1, $steps = $form.find('.form-step');
	function showStep(step) {
		$steps.hide();
		$steps.eq(step-1).show();
	}
	function checkRequired() {
		var passed = true;
		for (var i=0; i < $required.length; i++) {
			var $input = $required.eq(i);
			
			if ($input.is('[type="checkbox"]')) {
				if (!$input.is(':checked')) {
					passed = false;
				}
			} else if ($input.val()==='') {
				passed = false;
			}
		}
		$submit.prop('disabled', !passed);
	}
	
	//check required inputs
	checkRequired();
	$required.change(function () {
		checkRequired();
	});
	
	$form.submit(function () {
		trk('Participate', 'submit', 'Submit');
	});
	
	//$form.submit(function() {
	//	var formData = $form.serialize();
	//	
	//	$form.find('.error').remove();
	//	$container.addClass('loading');
	//	$form.find(':input').prop('disabled', true);
	//	$loader.show();
	//	
	//	$.post($form.attr("action"), formData).done(function () {
	//		currentStep = 2;
	//		showStep(currentStep);
	//	}).fail(function () {
	//		$submit.before('<div class="error">Something went wrong! Please, try again later.</div>');
	//	}).always(function () {
	//		$container.removeClass('loading');
	//		$form.find(':input').prop('disabled', false);
	//		$loader.hide();
	//	});
	//	
	//	return false;
	//});
});

/**
 * The Sign Up form
 */
$(function () {
	var $form = $('#signup-form');
	
	if (!$form.length)
		return;
	
	var $submit = $form.find(':submit');
	
	//form step switching
	var currentStep, $currentStep, $steps = $form.find('.form-step'),
	    $required,
	    $crumbs = $form.find('.form-crumb');
	function showStep(step) {
		currentStep = step;
		$currentStep = $steps.eq(currentStep-1);
		
		//show current step and hide others
		$steps.hide();
		$currentStep.show();
		
		//update form crumbs
		$crumbs.removeClass('active past');
		$crumbs.eq(currentStep-1).addClass('active');
		$crumbs.filter(':lt('+(currentStep-1)+')').addClass('past');
		
		$required && $required.off('.checkRequired');
		//enable/disable current Next step button
		$required = $currentStep.find(':required');
		var $nextBtn = $currentStep.find('button[data-form-step="next"], button[type="submit"]');
		
		$nextBtn.attr('disabled', !checkInputs($required));
		$required.on('change.checkRequired', function () {console.log('check');
			$nextBtn.attr('disabled', !checkInputs($required));
		});
	}
	function checkInputs($inputs) {
		var passed = true;
		for (var i=0; i < $inputs.length; i++) {
			var $input = $inputs.eq(i);
			
			if ($input.is('[type="checkbox"]')) {
				if (!$input.is(':checked')) {
					passed = false;
				}
			} else if ($input.val()==='') {
				passed = false;
			}
		}
		
		return passed;
	}
	
	//switch form steps
	$form.find('[data-form-step]').click(function () {
		switch ($(this).data('form-step')) {
			case 'next':
				showStep(currentStep+1);
				break;
				
			case 'prev':
				showStep(currentStep-1);
				break;
		}
		return false;
	});
	
	showStep(1);
});

/**
 * The Contribution form
 */
$(function () {
	var ethToGro = 14000; //TODO: automatically update exchange rate with ICO rounds
	
	var $address = $('#contribution-address');
	$('#copy-address').click(function () {
		$address.select();
		try {
			document.execCommand('copy');
		} catch (ex) {
			
		}
	});
	$address.click(function () {
		$address.select();
	});
	
	//force input to numerical values
	function forceNumber($input) {
		var value = $input.val().replace(/[^0-9.]/g, '');
		$input.val(value);
		
		return parseFloat(value);
	}
	//convert ETH/GRO
	function convert(fromCurrency, amount) {
		if (isNaN(amount)) {
			return 0;
		}
		
		switch (fromCurrency) {
			case 'eth':
				amount = amount * ethToGro;
				break;
			
			case 'gro':
				amount = amount / ethToGro;
				break;
		}
		
		return amount;
	}
	function formatAmount(amount) {
		if (isNaN(amount)) {
			return 0;
		}
		return Math.round(amount * 1000) / 1000;
	}
	
	var $eth = $('#eth-amount'), $gro = $('#gro-amount');
	
	$eth.on('input propertychange', function () {
		var eth = forceNumber($eth),
		    gro = convert('eth', eth);
		
		$gro.val(gro);
		
		$('.gro-amount').html(formatAmount(gro));
		$('.eth-amount').html(formatAmount(eth));
	});
	
	$gro.on('input propertychange', function () {
		var gro = forceNumber($gro),
		    eth = convert('gro', gro);
		
		$eth.val(eth);
		
		$('.gro-amount').html(formatAmount(gro));
		$('.eth-amount').html(formatAmount(eth));
	});
	
	//initial values
	var eth = forceNumber($eth),
	    gro = forceNumber($gro);
	$('.gro-amount').html(formatAmount(gro));
	$('.eth-amount').html(formatAmount(eth));
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
		var $currentLink = (hash === 'top-section' || hash === 'ico-banner-section')?
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
 * Animate On Scroll initialization
 */
$(function() {
	AOS.init({
		easing: 'ease-out-back',
		once: true,
		disable: (Object.prototype.toString.call(window.operamini) === "[object OperaMini]")
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
 * Timeline slider
 */
$(function() {
	if (!window.Swiper)
		return;
	
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
	if (!window.Swiper)
		return;
	
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
			if (!this.ANCHOR_REGEX.test(href)) {
				return false;
			}
			
			var id = href.slice(1);
			
			return this.scrollTo(id, pushToHistory);
		},
		
		scrollTo: function(idOffset, pushToHistory) {
			var offset, match, evParams = [];
			if (typeof idOffset==='number') {
				offset = idOffset;
			} else {
				match = document.getElementById(idOffset);
				evParams.push(idOffset);
				if (match) {
					offset = $(match).offset().top - this.getFixedOffset();
					
					// Add the state to history as-per normal anchor links
					if (HISTORY_SUPPORT && pushToHistory) {
						history.pushState({}, document.title, location.pathname + '#' + idOffset);
					}
				} else {
					return false;
				}
			}
			
			$('[data-aos]').removeAttr('data-aos');
			$(window).trigger('scrollStart', evParams);
			$('html, body').animate({scrollTop: offset}, 1000).promise().then(function() {
				$(window).trigger('scrollEnd', evParams);
			});
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
	$(function () {
		//The "Back to top" button
		//scroll to page top or to top section if it exists - so menu items will be set active
		//TODO: activate menu items depending only on current scroll position, not on link anchors
		var topSectionId = 'ico-banner-section', target;
		target = document.getElementById(topSectionId)? topSectionId : 0;
		$('#to-top').click(function () {
			anchorScrolls.scrollTo(target, false);
			return false;
		});
	});
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
