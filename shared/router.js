Router.configure({
	layoutTemplate: 'layout',
	onBeforeAction: function() {
		this.next();
	}
});

Router.route('/', {
	template: 'appBody'
});