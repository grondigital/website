/**
 * Common manipulations
 */
$(function() {
	//change header style on scroll
	var $body = $('body'),
		$topLink = $('#to-top');
	$body.waypoint(function(dir) {
		if (dir === 'down') {
			$body.addClass('fixed-header');
			$topLink.show();
		} else {
			$body.removeClass('fixed-header');
			$topLink.hide();
		}
	}, {
		offset: -50
	});
	
	$('#copyright-section').waypoint(function (dir) {
		if (dir==='down') {
			$topLink.addClass('raised');
		} else {
			$topLink.removeClass('raised');
		}
	}, {
		offset: '100%'
	});
	
	$('#logo').on('contextmenu', false);
	
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
		var target,
			$icoBanner = $('#ico-banner-section'),
			$topSection = $('#top-section');
		if ($icoBanner.length && $icoBanner.css('position')!=='fixed') {
			//ICO banner is not fixed, scroll to it
			target = 'ico-banner-section';
		} else if ($topSection.length) {
			//ICO banner is fixed, scroll to top section
			target = 'top-section';
		} else {
			target = 0;
		}
		
		$('#to-top').click(function () {
			anchorScrolls.scrollTo(target, false);
			return false;
		});
	});
})(window.document, window.history, window.location);
