var $el;
var move = 0;
var moving = false;
var degrees = 0;
var b = Array(Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null),Array(null,null,null,null));

var PieceView = function(opts) {
	this.initialize = function(opts) {
		console.log("piece");
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
	var s = Session.get('twist-score') + z;
	Session.set('twist-score', s);
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
				// self.values.push(b.val());
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
		// opts.z = Math.min.apply(null,this.values);
		opts.z = Math.floor(Math.random()*2*.75+1)*2;
		// opts.z = 2;
		move++;
		updateScore(opts.z);
		b[opts.x][opts.y] = new PieceView(opts);
		$el.find('>div span').css({
			'-webkit-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
			'-moz-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
			'-ms-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
			'transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)'
		});
		_.delay(function() {
			fall(0);
		}, 100);
	}
	if(spaces.length === 1) {
		var alive = false;
		_.each(b, function(c,i) {
			_.each(c, function(d,j) {
				if(d && i != 0) {
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
			alert("No more moves. Your score is "+Session.get('twist-score'));
		}
	}
	// this.values = [];
};


var cw = function() {
	rotate(90);
};

var ccw = function() {
	rotate(-90);
};

var rotate = function(deg) {
	if(!moving) {
		moving = true;
		degrees += deg;
		spinBoard();
		spinPieces();
		fall(1);
	}
};

var spinBoard = function() {
	$el.css({
		'-webkit-transform' : 'rotate('+ degrees +'deg)',
		'-moz-transform' : 'rotate('+ degrees +'deg)',
		'-ms-transform' : 'rotate('+ degrees +'deg)',
		'transform' : 'rotate('+ degrees +'deg)'
	});
};

var spinPieces = function() {
	$el.find('>div span').css({
		'-webkit-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
		'-moz-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
		'-ms-transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)',
		'transform' : 'translateX(-50%) translateY(-50%) rotate('+ -degrees +'deg)'
	});
};

var fall = function(create) {
	create = create || 0;
	var twist = (degrees/90%4+4)%4;
	switch(twist) {
		case 0:
			down(create);
			break;
		case 1:
			right(create);
			break;
		case 2:
			up(create);
			break;
		case 3:
			left(create);
			break;
	}
};

var left = function(create) {
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
							b[i-k][j].val(2*b[i-k][j].val());
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
	if(create) afterMove(moved);
};

var up = function(create) {
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
							b[i][j-k].val(2*b[i][j-k].val());
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
	if(create) afterMove(moved);
}

var right = function(create) {
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
							b[i+k][j].val(2*b[i+k][j].val());
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
	if(create) afterMove(moved);
};

var down = function(create) {
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
							b[i][j+k].val(2*b[i][j+k].val());
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
	if(create) afterMove(moved);
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
	if($('body').hasClass('twist')) {
		var code = e.keyCode || e.which;
		if(code === 37) ccw();
		else if(code === 39) cw();
	}
};

Template.twistGame.created = function() {
	Session.set('twist-score', 0);
};

Template.twistGame.rendered = function() {
	$(document).on('keydown', keyAction);
	$el = $('.twist-game .board').touchswipe({
		swipeLeft: ccw,
		swipeRight: cw
	});
	createPiece();
};

Template.twistGame.helpers({
	score: function() {
		return Session.get('twist-score');
	},
	title: function() {
		return "Slide - Twist";
	}
});

Template.twistGame.events({

});