Template.appBody.events({
	'click a': function(e) {
		e.preventDefault();
		$('body').attr('class',($(e.currentTarget).attr('href')));
	}
});