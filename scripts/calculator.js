/**
 * The Buy Tokens form
 */
$(function () {
	var ethToGro = 10000,
		roundBonus = [0.4, 0.3, 0.2, 0.1, 0],
		bonusFr = 0;
	
	//determine current ICO round
	var roundDates = [
		new Date('2018-01-09T00:00:00Z').getTime(),//pre-ICO
		new Date('2018-02-27T00:00:00Z').getTime(), //round 1
		new Date('2018-03-13T00:00:00Z').getTime(), //round 2
		new Date('2018-03-27T00:00:00Z').getTime(), //round 3
		new Date('2018-04-10T00:00:00Z').getTime()  //round 4
	];
	// select first round date which is after current
	var now = new Date().getTime();
	var countDownDate, currentRound = 4;
	for (var i=0; i<roundDates.length; i++) {
		countDownDate = roundDates[i]; //TODO: what will happen after round 4 will be started?
		if (now < countDownDate) {
			currentRound = i-1;
			if (currentRound>=0 && currentRound<roundBonus.length) {
				bonusFr = roundBonus[currentRound];
			} else {
				bonusFr = 0;
			}
			break;
		}
	}
	
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
	$address.on('copy cut', function () {
		trk('Contribute', 'copy-address', 'Copy contribution address');
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
	//calculate bonus amount
	function calcBonus(gro) {
		return gro*bonusFr;
	}
	//calculate GRO amount from GRO+bonus amount
	function calcGro(groB) {
		return groB/(1+bonusFr);
	}
	function formatAmount(amount) {
		if (isNaN(amount)) {
			return 0;
		}
		return Math.round(amount * 1e12) / 1e12;
	}
	
	var $eth = $('#eth-amount'), $gro = $('#gro-amount');
	if (!$eth.length || !$gro.length)
		return;
	
	$eth.on('input propertychange', function () {
		var eth = forceNumber($eth),
			gro = convert('eth', eth),
			bonus = calcBonus(gro),
			groB = gro + bonus;
		
		$gro.val(groB? groB : '');
		
		$('.gro-amount').html(formatAmount(groB));
		$('.eth-amount').html(formatAmount(eth));
		$('.bonus-amount').html(formatAmount(bonus));
	});
	
	$gro.on('input propertychange', function () {
		var groB = forceNumber($gro),
			gro = calcGro(groB),
			eth = convert('gro', gro),
			bonus = calcBonus(gro);
		
		$eth.val(eth? eth : '');
		
		$('.gro-amount').html(formatAmount(groB));
		$('.eth-amount').html(formatAmount(eth));
		$('.bonus-amount').html(formatAmount(bonus));
	});
	
	//initial values
	var eth = forceNumber($eth),
		groB = forceNumber($gro),
		gro = calcGro(groB),
		bonus = calcBonus(gro);
	$('.gro-amount').html(formatAmount(groB));
	$('.eth-amount').html(formatAmount(eth));
	$('.bonus-amount').html(formatAmount(bonus));
});
