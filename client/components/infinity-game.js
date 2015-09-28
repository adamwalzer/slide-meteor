var $el;
var move = 0;
var moving = false;
var values = [1];
var b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));

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
	var s = Session.get('infinity-score') + z;
	Session.set('infinity-score', s);
}

var createPiece = function() {
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
				values.push(d.val());
			} else {
				spaces.push({x:i,y:j});
			}
		});
	});
	if(spaces.length > 0) {
		var opts = {};
		opts.p = this;
		var l = Math.floor(Math.random()*spaces.length);
		var space = spaces[l];
		// spaces.splice(l,1);
		opts.w = $el.width();
		opts.x = space.x;
		opts.y = space.y;
		opts.z = Math.max(Math.min.apply(null,values)-Math.floor(Math.random()*10/9),1);
		move++;
		updateScore(opts.z);
		b[opts.x][opts.y] = new PieceView(opts);
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
			var $p = $el.parent();
			$p.find('.game-over-menu h1').html("You scored "+Session.get('infinity-score')+"!");
			$p.addClass('game-over');
			// alert("No more moves. Your score is "+Session.get('infinity-score'));
		}
	}
	values = [];
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
								b[i-k][j].val(1+b[i-k][j].val());
								b[i-k][j].move(move);
								b[i-k+1][j].moveX(b[i-k][j].getX()).destroy();
								b[i-k+1][j] = null;
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
								b[i][j-k].val(1+b[i][j-k].val());
								b[i][j-k].move(move);
								b[i][j-k+1].moveY(b[i][j-k].getY()).destroy();
								b[i][j-k+1] = null;
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
								b[i+k][j].val(1+b[i+k][j].val());
								b[i+k][j].move(move);
								b[i+k-1][j].moveX(b[i+k][j].getX()).destroy();
								b[i+k-1][j] = null;
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
								b[i][j+k].val(1+b[i][j+k].val());
								b[i][j+k].move(move);
								b[i][j+k-1].moveY(b[i][j+k].getY()).destroy();
								b[i][j+k-1] = null;
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
	if(moved) {
		_.delay(function() {
			createPiece();
		}, 250);
	}
	moving = false;
};

var keyAction = function(e) {
	if($('body').hasClass('infinity')) {
		var code = e.keyCode || e.which;
		if(code === 37) left();
		else if(code === 38) up();
		else if(code === 39) right();
		else if(code === 40) down();
	}
};

var setNewHigh = function(resetBoard) {
	var high = Math.max(Session.get('infinity-score'),Session.get('infinity-high-score'));
	setVar("infinity-high-score",high);

	Meteor.call('addHighScore', {
		game: "infinity",
		score: Session.get('infinity-score'),
		board: b
	}, function() {
		if(resetBoard) {
			Session.set('infinity-score', 0);
			_.each(b, function(c) {
				_.each(c, function(d) {
					d && d.destroy();
				});
			});
			values = [1];
			b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
			createPiece();
		}
	});
};

Template.infinityGame.created = function() {
	Session.set('infinity-score', 0);
	if(getVar('infinity-high-score')) Session.set('infinity-high-score',getVar('infinity-high-score'));
	if(!Session.get('infinity-high-score')) Session.set('infinity-high-score',0);
};

Template.infinityGame.rendered = function() {
	$(document).on('keydown', keyAction);
	$el = $('.infinity-game .board').touchswipe({
		swipeLeft: left,
		swipeRight: right,
		swipeUp: down,
		swipeDown: up
	});
	createPiece();
};

Template.infinityGame.helpers({
	score: function() {
		return Session.get('infinity-score');
	},
	high: function() {
		var highs = HighScores.find({game:'infinity'},{limit:1,sort:{score:-1}}).fetch();
		if(highs[0]) setVar('infinity-high-score',Math.max(Session.get('infinity-high-score'),highs[0].score));
		return Session.get('infinity-high-score');
	},
	title: function() {
		return "Slide - Infinity";
	}
});

Template.infinityGame.events({
	'click .reset-menu li': function(e) {
		setNewHigh($(e.currentTarget).hasClass('yes'));
		$el.parent().removeClass('reset-open');
	},
	'click .reset': function() {
		$el.parent().addClass('reset-open');
	},
	'click .game-over-menu li': function(e) {
		setNewHigh($(e.currentTarget).hasClass('yes'));
		$el.parent().removeClass('game-over');
	},
	'click .game-over-menu .no': function() {
		$('body').removeClass('infinity');
	}
});