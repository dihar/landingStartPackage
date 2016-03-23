
$(document).ready(function() {

	var showSize = ShowSize($(window).width(), $(window).height());

	$(window).resize(function() {
		
		showSize($(window).width(), $(window).height());

	});
});

function ShowSize(winW, winH){

	var scrollBarWidth = winH < $(document).find('body').height() ? 17 : 0; 

	$('body')
		.find(".size-window")
		.remove()
		.end()
		.append('<div class="size-window">'+(winW + scrollBarWidth) +' x '+winH+'</div>')
		.find(".size-window")
		.css({
			position: 'fixed',
			right: '10px',
			top: '10px',
			color: '#fff',
			background: 'rgba(0,0,0,0.5)',
			padding: '5px'
		});
	return function(winW, winH){
		scrollBarWidth = winH < $(document).find('body').height() ? 17 : 0;

		$('body').find(".size-window").text(winW+ scrollBarWidth +' x '+winH);
	}
}