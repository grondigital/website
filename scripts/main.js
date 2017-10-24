function onYouTubeIframeAPIReady() {
	//play YouTube video on button click
	$('#play-video').click(function() {
		new YT.Player('player', {
			width: '960',
			height: '540',
			videoId: 'ruTB5jBGXsE',
			events: {
				'onReady': onPlayerReady
			}
		});
		
		function onPlayerReady(event) {
			event.target.playVideo();
		}
		
		$(this).hide();
		
		return false;
	});
}
