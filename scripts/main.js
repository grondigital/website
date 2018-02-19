/* scripts used only on main site (https://grondigital.com) */

/**
 * Common manipulations
 */
$(function() {
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
