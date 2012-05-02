// jQuery Plugin Boilerplate
// A boilerplate for kick-starting jQuery plugins development
// version 1.3, May 07th, 2011
// by Stefan Gabos
// with help from Roger Padilla, Shinya, JohannC, Steven Black, Rob Lifford

(function($) {

    var id = 0;
    $.fn.dragon = function(method) {

        var drag = {};
        // Determine if device is a touch device
        var isTouchDevice = function() {
          var el = document.createElement('div');

          el.setAttribute('ongesturestart', 'return;');
          return (typeof el.ongesturestart == "function") ? true : false;
        }

        if (isTouchDevice()){
          // prevent scrolling the screen with touch dragging
          $('html').bind('touchmove', function(){ event.preventDefault() });
        }

        // Find event types for mouse clicks or touches
        var dragStartEventType = isTouchDevice() ? 'touchstart' : 'mousedown';
        var dragMoveEventType = isTouchDevice() ? 'touchmove' : 'mousemove';
        var dragEndEventType = isTouchDevice() ? 'touchend' : 'mouseup';

        // Find the position of the mouse or of a touch
        var inputX = function(e){return isTouchDevice() ? e.originalEvent.touches[0].clientX : e.pageX;}
        var inputY = function(e){return isTouchDevice() ? e.originalEvent.touches[0].clientY : e.pageY;}

        // Parse translate3D CSS values
        var matrixToArray = function(matrix) {
          return matrix.substr(7, matrix.length - 8).split(', ');
        }


        // public methods
        // to keep the $.fn namespace uncluttered, collect all of the plugin's methods in an object literal and call
        // them by passing the string name of the method to the plugin
        //
        // public methods can be called as
        // element.dragon('methodName', arg1, arg2, ... argn)
        // where "element" is the element the plugin is attached to, "dragon" is the name of your plugin and
        // "methodName" is the name of a function available in the "methods" object below; arg1 ... argn are arguments
        // to be passed to the method
        //
        // or, from inside the plugin:
        // methods.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "methods" object below
        var methods = {

            // this the constructor method that gets called when the object is created
            init : function(options) {

                var dragon = this.dragon
                // iterate through all the DOM elements we are attaching the plugin to
                var els = this.each(function() {

                    var $element = $(this), // reference to the jQuery version of the current DOM element
                        element = this;     // reference to the actual DOM element
                    $element.data('dragon_id', id);

                    // the plugin's final properties are the merged default and user-provided properties (if any)
                    // this has the advantage of not polluting the defaults, making them re-usable
                    dragon.settings[id] = $.extend({}, dragon.defaults, options);

                    $element.bind(dragStartEventType, helpers.onDragStart);
                    id++;
                });
                return els;
            }

        }

        // private methods
        // these methods can be called only from inside the plugin
        //
        // private methods can be called as
        // helpers.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "helpers" object below; arg1 ... argn are
        // arguments to be passed to the method
        var helpers = {

          onDragStart: function(event){
            var $element = $(this);
            var id = $element.data('dragon_id');

            var $target = $.fn.dragon.settings[id].target;

            if (typeof $target === "undefined"){
              $target = $element;
            }

            drag = {
              startInputX: inputX(event),
              startInputY: inputY(event),
              lastInputX: inputX(event),
              lastInputY: inputY(event),
              direction: null
            }
            $(document).bind(dragMoveEventType, onDragMove);
            $(document).bind(dragEndEventType, onDragEnd);

            function onDragMove(event){
              mouseDiff = getMouseDiff(event);
              newPosition = getNewTargetPosition(mouseDiff, id);
              translate(newPosition);
            }

            function onDragEnd(){
              $(document).unbind(dragMoveEventType, onDragMove);
              $(document).unbind(dragEndEventType, onDragEnd);

              var matrix = matrixToArray($target.css("-webkit-transform"));
              $target.endX = parseInt(matrix[4]);
              $target.endY = parseInt(matrix[5]);

              helpers.log(matrix);

              var deltaX = Math.abs($target.startX - $target.endX);
              var deltaY = Math.abs($target.startY - $target.endY);

              helpers.log("x=" + deltaX + " " + "y=" + deltaY);

              if (typeof $.fn.dragon.settings[id][drag.direction].end !== "undefined"){
                switch(drag.direction)
                {
                case "up":
                case "down":
                  var delta = deltaY;
                  break;
                case "left":
                case "right":
                  var delta = deltaX;
                  break;
                }

                if (delta > $.fn.dragon.settings[id][drag.direction].threshold){
                  $.fn.dragon.settings[id][drag.direction].end();
                }

              }
            }

            function getMouseDiff(event){
              var diffX = inputX(event) - drag.lastInputX;
              var diffY = inputY(event) - drag.lastInputY;

              drag.lastInputX = inputX(event);
              drag.lastInputY = inputY(event);

              return {
                x: diffX,
                y: diffY
              }
            }

            function getNewTargetPosition(mouseDiff){
              var newX = mouseDiff.x;
              var newY = mouseDiff.y;

              if (drag.direction == null) {
                drag.direction = getDirection(drag.startInputX, drag.startInputY, drag.lastInputX, drag.lastInputY);

                if (drag.direction != null){
                    //helpers.log(drag.direction);
                    //helpers.log("t=" + $.fn.dragon.settings[id][drag.direction].target);
                    //helpers.log($target);
                    if (typeof $.fn.dragon.settings[id][drag.direction].target !== "undefined") {
                      helpers.log($.fn.dragon.settings[id][drag.direction].target);
                      $target = $.fn.dragon.settings[id][drag.direction].target;
                    }
                }

                if($target.css('-webkit-transform') == 'none'){
                  $target.css('-webkit-transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
                }

                var matrix = matrixToArray($target.css("-webkit-transform"));
                $target.startX = parseInt(matrix[4]);
                $target.startY = parseInt(matrix[5]);

                return {x: 0, y: 0}
              }

              if($.fn.dragon.settings[id].horizontal === true && $.fn.dragon.settings[id].vertical === false){
                newY = 0;
              } else if($.fn.dragon.settings[id].horizontal === false && $.fn.dragon.settings[id].vertical === true){
                newX = 0;
              } else if ($.fn.dragon.settings[id].horizontal === true && $.fn.dragon.settings[id].vertical === true) {
                switch(drag.direction)
                {
                case "up":
                case "down":
                  newX = 0;
                  break;
                case "left":
                case "right":
                  newY = 0;
                  break;
                }
              }

              return {
                x: newX,
                y: newY
              }
            }

            function translate(position){
              var matrix = matrixToArray($target.css("-webkit-transform"));
              var newX = parseInt(matrix[4]) + position.x;
              var newY = parseInt(matrix[5]) + position.y;

              $target.css({
                translateX:newX,
                translateY:newY
              });

              //$target.css('-webkit-transform', 'translate3d(' + newX + 'px,'+ newY +'px,0)');
            }

            function move(position){
              $target.css('-webkit-transition','all 100ms ease-in-out')
                     .css('-webkit-transform', 'translate3d(0px,400px,0)');
            }

            function getDirection(startX, startY, lastX, lastY){
              var diffX = lastX - startX;
              var diffY = lastY - startY;
              if(diffX > 2 || diffX < -2 || diffY > 2 || diffY < -2){
                var angle = getAngle(startX, startY, lastX,lastY);
                if (angle <= -30 && angle >= -150){
                  return 'up';
                }
                else if (angle < 150 && angle > 30){
                  return 'down';
                }
                else if (angle <= 30 && angle >= -30 ){
                  return 'right';
                }
                else {
                  return 'left';
                }
              };
              return null;
            }

            function getAngle(startX, startY, lastX,lastY) {
              var angle = Math.atan2(lastY - startY, lastX - startX);
              var degree = angle * 180/Math.PI;
              return degree;
            }
          },

          log: function(message){
            LOG_ENABLED = false;
            if (LOG_ENABLED){
              console.log(message);
            }
          }

        }

        // if a method as the given argument exists
        if (methods[method]) {

            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {

            // call the initialization method
            return methods.init.apply(this, arguments);

        // otherwise
        } else {

            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in dragon plugin!');

        }

    }

    // plugin's default options
    $.fn.dragon.defaults = {
        target: undefined,
        horizontal: false,
        vertical: false,
        right: {},
        left: {},
        up: {},
        down: {},
    }

    // this will hold the merged default and user-provided options
    // you will have access to these options like:
    // this.dragon.settings.propertyName from inside the plugin or
    // element.dragon.settings.propertyName from outside the plugin, where "element" is the element the
    // plugin is attached to;
    $.fn.dragon.settings = {};

})(jQuery);
