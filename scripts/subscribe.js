/**
 * Subscribe form
 */
$(function () {
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
		lockBody();
		showSubForm();
		return false;
	});
	if ($subForm.length) {
		$('#timeline-section').waypoint(function() {
			if (
				!getCookie('subscribe_form') &&
				!isScrolling
			) {
				lockBody();
				//wait after locking scroll, because desktop Safari has glitch - 
				//it scrolls content for a few ms after locking if user scrolls fast
				setTimeout(function () {
					showSubForm();
				}, 100);
			}
		});
	}
	
	$subForm.submit(function () {
		trk('Subscribe', 'submit', 'Submit');
	});
});
