// adds index to each item
// UI.registerHelper('indexedArray', function(context, options) {
//   if (context) {
//     return context.map(function(item, index) {
//       item._index = index;
//       return item;
//     });
//   }
// });

setVar = function(name, value) {
  Session.set(name,value);
  localStorage.setItem(name,value);
};

getVar =  function(name) {
  return localStorage.getItem(name);
};

setCookie = function(name, value) {
  Session.set(name,value);
  document.cookie = name + "=" + value + ";";
};

getCookie = function(name) {
    var name = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
};

Meteor.autorun(function() {

  /**
  * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
  * Common usage: wipe images (left and right to show the previous or next image)
  * 
  * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
  * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
  * @version 1.1 (1st September 2010) - support wipe up and wipe down
  * @version 1.0 (15th July 2010)
  */
  (function($) {
   $.fn.touchswipe = function(settings) {
     var config = {
        min_move_x: 20,
        min_move_y: 20,
      swipeLeft: function() { },
      swipeRight: function() { },
      swipeUp: function() { },
      swipeDown: function() { },
      preventDefaultEvents: true
   };
     
     if (settings) $.extend(config, settings);

     this.each(function() {
       var startX;
       var startY;
     var isMoving = false;

       function cancelTouch() {
         this.removeEventListener('touchmove', onTouchMove);
         startX = null;
         isMoving = false;
       }  
       
       function onTouchMove(e) {
         if(config.preventDefaultEvents) {
           e.preventDefault();
         }
         if(isMoving) {
           var x = e.touches[0].pageX;
           var y = e.touches[0].pageY;
           var dx = startX - x;
           var dy = startY - y;
           if(Math.abs(dx) >= config.min_move_x) {
            cancelTouch();
            if(dx > 0) {
              config.swipeLeft();
            }
            else {
              config.swipeRight();
            }
           }
           else if(Math.abs(dy) >= config.min_move_y) {
              cancelTouch();
              if(dy > 0) {
                config.swipeDown();
              }
              else {
                config.swipeUp();
              }
             }
         }
       }
       
       function onTouchStart(e)
       {
         if (e.touches.length == 1) {
           startX = e.touches[0].pageX;
           startY = e.touches[0].pageY;
           isMoving = true;
           this.addEventListener('touchmove', onTouchMove, false);
         }
       }       
       if ('ontouchstart' in document.documentElement) {
         this.addEventListener('touchstart', onTouchStart, false);
       }
     });

     return this;
   };

  })(jQuery);

  GameTemplate = function(opts) {
    opts = opts || {};
    var t = opts.title || "original";

    this.rendered = function() {
      $(document).on('keydown', keyAction);
      $el = $('.'+t+'-game .board').touchswipe({
        swipeLeft: left,
        swipeRight: right,
        swipeUp: down,
        swipeDown: up
      });

      renderGame();
    };

    var renderGame = function() {
      createPiece();
    };

    var PieceView = function(opts) {
      this.initialize = function(opts) {
        var opts = opts || {};
        this.w = opts.w ? 100/opts.w : 25;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.v = opts.z || 2;
        this.m = opts.m || 0
        this.p = opts.p || {};
        this.render();
      };
      this.render = function() {
        this.$el = $('<div style="left:'+this.x*this.w+'%; top:'+this.y*this.w+'%;"><span></span></div>');
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
        this.$el.css({'left':nx*this.w+'%'});
        return this;
      };
      this.getY = function() {
        return this.y;
      };
      this.moveY = function(ny) {
        this.y = ny;
        this.$el.css({'top':ny*this.w+'%'});
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
      var s = Session.get(t+'-score') + z;
      Session.set(t+'-score', s);
    };

    var createPiece = function() {
      var spaces = [];
      // for(var i=0;i<4;i++) {
      //  for(var j=0;j<4;j++) {
      //    if(!this.b[i][j]) {
      //      spaces.push({x:i,y:j});
      //    }
      //  }
      // }
      _.each(b, function(c,i) {
        _.each(c, function(d,j) {
          if(!d) {
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
        opts.w = 4;
        opts.x = space.x;
        opts.y = space.y;
        // opts.z = Math.min.apply(null,this.values);
        opts.z = Math.floor(Math.random()*2*.75+1)*2;
        // opts.z = 2;
        move++;
        updateScore(opts.z);
        b[opts.x][opts.y] = new PieceView(opts);
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
          moving = true;
          var $p = $el.parent();
          $p.find('.game-over-menu h1').html("You scored "+Session.get('original-score')+"!");
          $p.addClass('game-over');
          // alert("No more moves. Your score is "+Session.get('original-score'));
        }
      }
      // this.values = [];
    };

  }

  HighScoreTemplate = function(opts) {
    var t = opts.title || "original";
    var m = opts.max || 0;
    var n = opts.min || 0;
    this.rendered = function() {
      $(document).on('keydown', keyAction);
      $('.'+t+'-high-scores .high-scores').touchswipe({
        swipeLeft: left,
        swipeRight: right
      });
    };
    var left = function() {
      n = 1 - $('.'+t+'-high-scores .high-scores li').length;
      m = Math.max(m-1,n);
      $('.'+t+'-high-scores .high-scores').css({'left':(m*100)+"%"});
    };
    var right = function() {
      m = Math.min(m+1,0);
      $('.'+t+'-high-scores .high-scores').css({'left':(m*100)+"%"});
    };
    var keyAction = function(e) {
      if($('body').hasClass(t+'-high')) {
        var code = e.keyCode || e.which;
        if(code === 37) left();
        else if(code === 39) right();
      }
    };
  };

  $(document).ready(function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-68375108-1', 'auto');
    ga('send', 'pageview');
  });

  window.onload = function() {
    if(!Meteor.userId()) {
      document.body.className = "options";
    }
  };
});