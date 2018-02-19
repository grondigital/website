/**
 * ICO counter
 */
$(function() {
	// Set the date we're counting down to
	var roundDates = [
		new Date('2018-01-09T00:00:00Z').getTime(), //pre-ICO
		new Date('2018-02-27T00:00:00Z').getTime(), //round 1
		new Date('2018-03-13T00:00:00Z').getTime(), //round 2
		new Date('2018-03-27T00:00:00Z').getTime(), //round 3
		new Date('2018-04-10T00:00:00Z').getTime()  //round 4
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
