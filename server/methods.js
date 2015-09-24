Meteor.methods({
	// methodName: function() {
	// 	// method body
	// },
	addHighScore: function(opts) {
		var highs = HighScores.find({userId:this.userId, game:opts.game}, {limit:5, sort: {score: -1}}).fetch();

		var board = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
		for(var i=0;i<4;i++) {
			for(var j=0;j<4;j++) {
				if(opts.board[i][j]) {
					board[i][j] = opts.board[i][j].v;
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
		}
		// else {
		// 	_.each(highs, function() {
		// 		if(opts.score > this.score) {
		// 			HighScores.insert({
		// 				game: opts.game,
		// 				score: opts.score,
		// 				board: opts.board
		// 			});
		// 			return;
		// 		}
		// 	});
		// }
	}
});