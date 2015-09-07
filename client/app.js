// adds index to each item
// UI.registerHelper('indexedArray', function(context, options) {
//   if (context) {
//     return context.map(function(item, index) {
//       item._index = index;
//       return item;
//     });
//   }
// });

setCookie = function(name, value) {
  Session.set(name,value);
  document.cookie = name + "=" + value + ";";
}

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
  // Whenever this session variable changes, run this function.
  // var displayMessage = Session.get('displayMessage');
  // if (displayMessage) {
  //   var stringArray = displayMessage.split('&amp;');
  //   ui.notify(stringArray[0], stringArray[1])
  //     .effect('slide')
  //     .closable();

  //   Session.set('displayMessage', null);
  // }

  // if (Accounts._resetPasswordToken) {
  //   Session.set('resetPassword', Accounts._resetPasswordToken);
  // }

  // if(Meteor.user()) console.log(Meteor.user().emails[0].address);
});