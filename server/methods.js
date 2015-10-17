Meteor.methods({
	// methodName: function() {
	// 	// method body
	// },
	addHighScore: function(opts) {
		var sortBy = opts.sort || -1;
		var compare = opts.sort === 1 ? function(s,h) {
				return (s < h);
			} : function(s,h) {
				return (s > h);
			};
		var board = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
		var highs = HighScores.find({userId:this.userId, game:opts.game}, {sort: {score: sortBy}}).fetch();

		for(var i=0;i<4;i++) {
			for(var j=0;j<4;j++) {
				if(opts.board[i][j]) {
					board[j][i] = opts.board[i][j].v;
				}
			}
		}

		if(highs.length < 5) {
			HighScores.insert({
				userId: this.userId,
				game: opts.game,
				score: opts.score,
				board: board
			});
		} else if(highs[4] && highs[4]._id && highs[4].score) {
			if(compare(opts.score,highs[4].score)) {
				HighScores.update(highs[4]._id, {$set: {
					score: opts.score,
					board: board
				}});
			}
		}
	}
});