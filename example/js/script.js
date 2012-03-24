$(document).ready(function(){
  $('.box').dragon({
    horizontal: true,
    vertical: true,
    right: {
      target: $('.box'),
      threshold: 200,
      end: function(){
        $('.box').animate({
            translateX:'-=150',
            translateY:'+=150',
            scale:'+=2',
            rotateY: '+='+(2*Math.PI),
            rotateX: '+='+Math.PI,
            rotateZ: '+='+Math.PI
        },100);    
      }
    },
    left: {
      target: $('.box'),
      threshold: 200,
      endposition: -400,
      speed: '150ms',
      end: function(){
      }
    },
    up: {
      threshold: 200,
      endposition: -400,
      speed: '150ms',
      end: function(){
      }
    },
    down: {
      target: $('.circle'),
      threshold: 200,
      endposition: -400,
      speed: '150ms',
      end: function(){
      }
    }
  });
});