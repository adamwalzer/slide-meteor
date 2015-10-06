var $el;
var move = 1;
var mx = 0;
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
	var s = Session.get('combine-score') + z;
	Session.set('combine-score', s);
}

var createPiece = function(n) {
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
		opts.z = 15;
		// opts.z = Math.max(Math.min.apply(null,values)-Math.floor(Math.random()*10/9),1);
		// move++;
		// updateScore(opts.z);
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
			moving = true;
			var $p = $el.parent();
			$p.find('.game-over-menu h1').html("You scored "+Session.get('combine-score')+"!");
			$p.addClass('game-over');
			// alert("No more moves. Your score is "+Session.get('combine-score'));
		}
	}
	values = [];
	split(spaces);
};

var split = function(spaces) {
	if(spaces.length > 0) {
		var opts = {};
		opts.p = this;
		var l = Math.floor(Math.random()*spaces.length);
		var space = spaces[l];
		// spaces.splice(l,1);
		opts.w = $el.width();
		opts.x = space.x;
		opts.y = space.y;
		var ps = [];
		if(opts.x>0 && b[opts.x-1][opts.y]) ps.push(b[opts.x-1][opts.y]);
		if(opts.y>0 && b[opts.x][opts.y-1]) ps.push(b[opts.x][opts.y-1]);
		if(opts.x<3 && b[opts.x+1][opts.y]) ps.push(b[opts.x+1][opts.y]);
		if(opts.y<3 && b[opts.x][opts.y+1]) ps.push(b[opts.x][opts.y+1]);
		// console.log("l="+ps.length);
		// console.log(ps);
		if(ps.length) {
			var n = Math.floor(Math.random()*ps.length);
			var p = ps[n];
			// console.log("n="+n);
			// console.log(p);
			opts.z = p.val()-1;
			p.val(opts.z);
			b[opts.x][opts.y] = new PieceView(opts);
			var spaces = [];
			_.each(b, function(c,i) {
				_.each(c, function(d,j) {
					if(!d) {
						spaces.push({x:i,y:j});
					}
				});
			});
			split(spaces);
		} else {
			split(spaces);
		}
		// opts.z = 15;
		// opts.z = Math.max(Math.min.apply(null,values)-Math.floor(Math.random()*10/9),1);
		// move++;
		// updateScore(opts.z);
		// b[opts.x][opts.y] = new PieceView(opts);
	}
};

var renderGame = function() {
	createPiece();
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
							// moved = true;
						} else {
							if(b[i-k][j].move() != move && b[i-k][j].val() === b[i-k+1][j].val()) {
								b[i-k][j].val(1+b[i-k][j].val());
								b[i-k][j].move(move);
								b[i-k+1][j].moveX(b[i-k][j].getX()).destroy();
								b[i-k+1][j] = null;
								updateScore(1);
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
							// moved = true;
						} else {
							if(b[i][j-k].move() != move && b[i][j-k].val() === b[i][j-k+1].val()) {
								b[i][j-k].val(1+b[i][j-k].val());
								b[i][j-k].move(move);
								b[i][j-k+1].moveY(b[i][j-k].getY()).destroy();
								b[i][j-k+1] = null;
								updateScore(1);
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
							// moved = true;
						} else {
							if(b[i+k][j].move() != move && b[i+k][j].val() === b[i+k-1][j].val()) {
								b[i+k][j].val(1+b[i+k][j].val());
								b[i+k][j].move(move);
								b[i+k-1][j].moveX(b[i+k][j].getX()).destroy();
								b[i+k-1][j] = null;
								updateScore(1);
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
							// moved = true;
						} else {
							if(b[i][j+k].move() != move && b[i][j+k].val() === b[i][j+k-1].val()) {
								b[i][j+k].val(1+b[i][j+k].val());
								b[i][j+k].move(move);
								b[i][j+k-1].moveY(b[i][j+k].getY()).destroy();
								b[i][j+k-1] = null;
								updateScore(1);
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
	// if(moved) {
	// 	_.delay(function() {
	// 		createPiece();
	// 	}, 250);
	// }
	var spaces = [];
	_.each(b, function(c,i) {
		_.each(c, function(d,j) {
			if(!d) {
				spaces.push({x:i,y:j});
			}
		});
	});
	if(spaces.length===15) {
		updateScore(100);
		split(spaces);
	}
	mx++;
	if(moved) mx=0;
	move++;
	moving = false;
	if(mx>=11) {
		moving = true;
		var $p = $el.parent();
		$p.find('.game-over-menu h1').html("You scored "+Session.get('combine-score')+"!");
		$p.addClass('game-over');
	}
};

var keyAction = function(e) {
	if($('body').hasClass('combine')) {
		var code = e.keyCode || e.which;
		if(code === 37) left();
		else if(code === 38) up();
		else if(code === 39) right();
		else if(code === 40) down();
	}
};


var setNewHigh = function(resetBoard) {
	var high = Math.max(Session.get('combine-score'),Session.get('combine-high-score'));
	setVar('combine-high-score',high);

	Meteor.call('addHighScore', {
		game: "combine",
		score: Session.get('combine-score'),
		board: b
	}, function() {
		if(resetBoard) {
			var high = Math.max(Session.get('combine-score'),Session.get('combine-high-score'));
			setVar("combine-high-score",high);
			Session.set('combine-score', 0);
			_.each(b, function(c) {
				_.each(c, function(d) {
					d && d.destroy();
				});
			});
			values = [1];
			moving = false;
			b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));
			renderGame();
		}
	});
};

Template.combineGame.created = function() {
	Session.set('combine-score', 0);
	if(getVar('combine-high-score')) Session.set('combine-high-score',getVar('combine-high-score'));
	if(!Session.get('combine-high-score')) Session.set('combine-high-score',0);
};

Template.combineGame.rendered = function() {
	$(document).on('keydown', keyAction);
	$el = $('.combine-game .board').touchswipe({
		swipeLeft: left,
		swipeRight: right,
		swipeUp: down,
		swipeDown: up
	});
	renderGame();
};

Template.combineGame.helpers({
	score: function() {
		return Session.get('combine-score');
	},
	high: function() {
		var highs = HighScores.find({game:'combine'},{limit:1,sort:{score:-1}}).fetch();
		if(highs[0]) setVar('combine-high-score',Math.max(Session.get('combine-high-score'),highs[0].score));
		return Session.get('combine-high-score');
	},
	title: function() {
		return "Slide - Combine";
	}
});

Template.combineGame.events({
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
		$('body').removeClass('combine');
	}
});