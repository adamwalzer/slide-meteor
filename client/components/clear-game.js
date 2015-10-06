var $el;
var move = 0;
var moving = false;
var values = [];
var b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
var originalB = Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}));
var gameOver = false;

var PieceView = function(opts) {
	this.initialize = function(opts) {
		var opts = opts || {};
		this.w = opts.w/4 || 80;
		this.x = opts.x || 0;
		this.y = opts.y || 0;
		this.v = opts.z || 2;
		this.m = opts.m || 0
		this.p = opts.p || {};
		this.render();
	};
	this.render = function() {
		this.$el = $('<div style="left:'+this.x*this.w+'px; top:'+this.y*this.w+'px;"><span></span></div>');
		this.$span = this.$el.find('span');
		this.val(this.v);
		$el.append(this.$el);
	};
	this.val = function(nv) {
		this.v = nv || this.v;
		this.$el.attr({'val':this.v})
		this.$span.html(this.v);
		return this.v;
	};
	this.move = function(m) {
		this.m = m || this.m;
		return this.m;
	};
	this.getX = function() {
		return this.x;
	};
	this.moveX = function(nx) {
		this.x = nx;
		this.$el.css({'left':nx*this.w+'px'});
		return this;
	};
	this.getY = function() {
		return this.y;
	};
	this.moveY = function(ny) {
		this.y = ny;
		this.$el.css({'top':ny*this.w+'px'});
		return this;
	};
	this.destroy = function() {
		var self = this;
		self.$el.addClass('destroying');
		_.delay(function() {
			self.$el.remove();
		},250);
	};
	this.initialize(opts);
};

var updateScore = function(z) {
	var s = Session.get('clear-score') + z;
	Session.set('clear-score', s);
}

var createPiece = function(n) {
	if(gameOver) return;
	var spaces = [];
	// for(var i=0;i<4;i++) {
	// 	for(var j=0;j<4;j++) {
	// 		if(!this.b[i][j]) {
	// 			spaces.push({x:i,y:j});
	// 		}
	// 	}
	// }
	_.each(b, function(c,i) {
		_.each(c, function(d,j) {
			if(d) {
				!n && values.push(d.val());
			} else {
				spaces.push({x:i,y:j});
			}
		});
	});
	if(!n && spaces.length === 16) {
		gameOver = true;
		// Session.set('clear-high-score', Math.min(Session.get('clear-score'),Session.get('clear-high-score')));
		var low = Math.min(Session.get('clear-score'),Session.get('clear-high-score'));
		setVar('clear-high-score',low);

		Meteor.call('addHighScore', {
			game: "clear",
			score: Session.get('clear-score'),
			board: originalB,
			// board: b,
			sort: 1,
			compare: function(score, highScore) {
				return (score < highScore);
			}
		});

		var $p = $el.parent();
		$p.find('.game-over-menu h1').html("You scored " + Session.get('clear-score') + "!");
		$p.addClass('game-over');
	} else {
		if(spaces.length > 0) {
			var opts = {};
			opts.p = this;
			var l = Math.floor(Math.random()*spaces.length);
			var space = spaces[l];
			// spaces.splice(l,1);
			opts.w = $el.width();
			opts.x = space.x;
			opts.y = space.y;
			opts.z = n || values[Math.floor(Math.random()*values.length)];
			move++;
			// updateScore(opts.z);
			b[opts.x][opts.y] = new PieceView(opts);
			if(typeof n == "number") {
				originalB[opts.x][opts.y] = {v:opts.z};
			}
		}
		if(spaces.length === 1) {
			var alive = false;
			_.each(b, function(c,i) {
				_.each(c, function(d,j) {
					if(b && i != 0) {
						if(d.val() === b[i-1][j].val()) {
							alive = true;
						}
					}
					if(d && j != 0) {
						if(d.val() === b[i][j-1].val()) {
							alive = true;
						}
					}
				});
			});
			if(!alive) {
				moving = true;
				gameOver = true;
				var $p = $el.parent();
				$p.find('.game-over-menu h1').html("You couldn't clear the board");
				$p.addClass('game-over');
			}
		}
		if(n) {
			createPiece(n-1);
		} else {
			values = [];
			// if(originalB == null) {
			// 	originalB = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
			// 	for(var i=0;i<4;i++) {
			// 		for(var j=0;j<4;j++) {
			// 			if(b[i][j]) {
			// 				originalB[i][j] = {v: b[i][j].v};
			// 			}
			// 		}
			// 	}
			// }
		}
		// moving = false;
	}
};

var renderGame = function() {
	gameOver = false;
	moving = false;
	originalB =  Array(Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}),Array({v:0},{v:0},{v:0},{v:0}));
	createPiece(10);
};

var left = function() {
	if(!moving) {
		moving = true;
		var moved = false;
		for(var j=0; j<4; j++) {
			for(var i=1; i<4; i++) {
				if(b[i][j]) {
					for(var k=1;k<=i;k++) {
						if(!b[i-k][j]) {
							b[i-k][j] = b[i-k+1][j].moveX(i-k);
							b[i-k+1][j] = null;
							moved = true;
						} else {
							if(b[i-k][j].move() != move && b[i-k][j].val() === b[i-k+1][j].val()) {
								b[i-k+1][j].moveX(b[i-k][j].getX()).destroy();
								b[i-k+1][j] = null;
								b[i-k][j].destroy();
								b[i-k][j] = null;
								moved = true;
							}
							break;
						}
					}
				}
			}
		}
		afterMove(moved);
	}
};

var up = function() {
	if(!moving) {
		moving = true;
		var moved = false;
		for(var i=0; i<4; i++) {
			for(var j=1; j<4; j++) {
				if(b[i][j]) {
					for(var k=1;k<=j;k++) {
						if(!b[i][j-k]) {
							b[i][j-k] = b[i][j-k+1].moveY(j-k);
							b[i][j-k+1] = null;
							moved = true;
						} else {
							if(b[i][j-k].move() != move && b[i][j-k].val() === b[i][j-k+1].val()) {
								b[i][j-k+1].moveY(b[i][j-k].getY()).destroy();
								b[i][j-k+1] = null;
								b[i][j-k].destroy();
								b[i][j-k] = null;
								moved = true;
							}
							break;
						}
					}
				}
			}
		}
		afterMove(moved);
	}
}

var right = function() {
	if(!moving) {
		moving = true;
		var moved = false;
		for(var j=0; j<4; j++) {
			for(var i=2; i>-1; i--) {
				if(b[i][j]) {
					for(var k=1;k<=3-i;k++) {
						if(!b[i+k][j]) {
							b[i+k][j] = b[i+k-1][j].moveX(i+k);
							b[i+k-1][j] = null;
							moved = true;
						} else {
							if(b[i+k][j].move() != move && b[i+k][j].val() === b[i+k-1][j].val()) {
								b[i+k-1][j].moveX(b[i+k][j].getX()).destroy();
								b[i+k-1][j] = null;
								b[i+k][j].destroy();
								b[i+k][j] = null;
								moved = true;
							}
							break;
						}
					}
				}
			}
		}
		afterMove(moved);
	}
};

var down = function() {
	if(!moving) {
		moving = true;
		var moved = false;
		for(var i=0; i<4; i++) {
			for(var j=2; j>-1; j--) {
				if(b[i][j]) {
					for(var k=1;k<=3-j;k++) {
						if(!b[i][j+k]) {
							b[i][j+k] = b[i][j+k-1].moveY(j+k);
							b[i][j+k-1] = null;
							moved = true;
						} else {
							if(b[i][j+k].move() != move && b[i][j+k].val() === b[i][j+k-1].val()) {
								b[i][j+k-1].moveY(b[i][j+k].getY()).destroy();
								b[i][j+k-1] = null;
								b[i][j+k].destroy();
								b[i][j+k] = null;
								moved = true;
							}
							break;
						}
					}
				}
			}
		}
		afterMove(moved);
	}
}

var afterMove = function(moved) {
	if(gameOver) return;
	updateScore(1);
	if(moved) {
		_.delay(function() {
			createPiece();
		}, 250);
	}
	moving = false;
};

var keyAction = function(e) {
	if($('body').hasClass('clear')) {
		var code = e.keyCode || e.which;
		if(code === 37) left();
		else if(code === 38) up();
		else if(code === 39) right();
		else if(code === 40) down();
	}
};

var setNewHigh = function(resetBoard) {
	if(resetBoard) {
		Session.set('clear-score', 0);
		_.each(b, function(c) {
			_.each(c, function(d) {
				d && d.destroy();
			});
		});
		b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
		renderGame();
	}
};

Template.clearGame.created = function() {
	Session.set('clear-score', 0);
	if(getVar('clear-high-score')) Session.set('clear-high-score',getVar('clear-high-score'));
	if(!Session.get('clear-high-score')) Session.set('clear-high-score',10000);
};

Template.clearGame.rendered = function() {
	$(document).on('keydown', keyAction);
	$el = $('.clear-game .board').touchswipe({
		swipeLeft: left,
		swipeRight: right,
		swipeUp: down,
		swipeDown: up
	});
	renderGame();
};

Template.clearGame.helpers({
	score: function() {
		return Session.get('clear-score');
	},
	high: function() {
		var highs = HighScores.find({game:'clear'},{sort:{score:1},limit:1}).fetch();
		if(highs[0]) setVar('clear-high-score',Math.min(Session.get('clear-high-score'),highs[0].score));
		return Session.get('clear-high-score')===10000?"N/A":Session.get('clear-high-score');
	},
	title: function() {
		return "Slide - Clear";
	}
});

Template.clearGame.events({
	'click .reset-menu li, touchstart .reset-menu li': function(e) {
		setNewHigh($(e.currentTarget).hasClass('yes'));
		$el.parent().removeClass('reset-open');
	},
	'click .reset, touchstart .reset': function() {
		$el.parent().addClass('reset-open');
	},
	'click .game-over-menu li, touchstart .game-over-menu li': function(e) {
		setNewHigh($(e.currentTarget).hasClass('yes'));
		$el.parent().removeClass('game-over');
	},
	'click .game-over-menu .no, touchstart .game-over-menu .no': function() {
		$('body').removeClass('clear');
	}
});