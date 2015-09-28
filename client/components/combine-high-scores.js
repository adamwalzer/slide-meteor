var opts = {
	title: "combine",
	max: 0,
	min: 0,
	sort: -1,
	limit: 5
};

Template[opts.title+'HighScores'].rendered = function() {
	template = new highScoreTemplate(opts);
	template.rendered();
};

Template[opts.title+'HighScores'].helpers({
	highScores: function() {
		return HighScores.find({game: opts.title}, {sort: {score: opts.sort}});
	}
});