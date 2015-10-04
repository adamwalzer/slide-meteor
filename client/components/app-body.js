Template.appBody.events({
	'click a': function(e) {
		e.preventDefault();
		var href = $(e.currentTarget).attr('href');
		$('body').attr('class',href);
		ga('send', 'click-'+href);
	}
});