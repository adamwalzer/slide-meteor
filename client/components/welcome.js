// var resize = function() {
// 	var $this = $('.welcome');
// 	$this.find('.profile-image-container').css({'left': $this.width() - $this.find('img').width()});
// };

// Template.welcome.rendered = function() {
// 	$('.welcome').imagesLoaded(function() {
// 		resize();
// 	});
// 	$(window).on('resize', resize);
// };

// Template.welcome.events({
// 	'click a': function(e) {
// 		e.preventDefault();
// 		$('body').attr('class',($(e.currentTarget).attr('href')));
// 	}
// });