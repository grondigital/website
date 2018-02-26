/**
 * The Contribute form
 */
$(function () {
	var $form = $('#contribute-form');
	
	var campSource = getCookie('camp_source'),
		affiliates = ['icoanimals'];
	$form.find('[name="contributor[affiliate]"]').val(affiliates.indexOf(campSource)>=0? campSource : 'grondigital');
	
	if (campSource === 'icoanimals') {
		var $addrBlock = $form.find('#eth-address'),
			$addr = $addrBlock.find('input');
		
		$addr.prop('required', true);
		$addrBlock.show();
		
		$form.submit(function () {
			var img = document.createElement('img');
			img.src = '//grondigital.icoref.link/success?afc_address=' + $addr.val();
		});
	}
	
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
		//TODO: does all this events needed?
		$required.on('input.checkRequired propertychange.checkRequired change.checkRequired', function () {
			$nextBtn.attr('disabled', !checkInputs($required));
		});
	}
	function checkInputs($inputs) {
		var passed = true;
		for (var i=0; i < $inputs.length; i++) {
			var $input = $inputs.eq(i);
			
			//TODO: use .checkValidity()?
			if ($input.is('[type="checkbox"]')) {
				if (!$input.is(':checked')) {
					passed = false;
				}
			} else if ($input.is('[type="email"]')) {
				passed = /.+@.+\..+/.test($input.val());
			} else if ($input.is('[pattern]')) {
				var exp = new RegExp($input.attr('pattern'), 'u');
				passed = exp.test($input.val());
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
