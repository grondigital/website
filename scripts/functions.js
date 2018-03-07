//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=grondigital.com;path=/";
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
