/**
 * Event tracking
 */
function trk(category, action, label) {
	category = category || '';
	action = action || '';
	label = label || '';
	
	window.dataLayer && dataLayer.push({
		'event': 'eventTracking',
		'category': category,
		'action': action,
		'label': label
	});
	
	window.fbq && fbq('trackCustom', category, {
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
 * Remember campaign source
 */
(function () {
	var source = getQueryParam('utm_source');
	if (source !== null) {
		setCookie('camp_source', source, 7);
	}
})();
