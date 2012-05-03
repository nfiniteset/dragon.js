$(document).ready(function(){
  $('.square').dragon({
    horizontal: true,
    vertical: true,
    right: {
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
    down: {
      target: $('.circle')
    }
  });
  $('.circle').dragon({
    horizontal: true
  });
});
