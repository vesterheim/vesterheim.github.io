(function( w ){

  // Enable strict mode
  "use strict";   

    w.setupCarousel = function() {  

    // Get carousel container
    var carousel = w.document.getElementById('carousel');

    // If no carousel container, quit.
    if (carousel === null) {
      return;
    }

    // Add class to enable correct styles
    carousel.className += '  js__layout__carousel__wrapper';

    // Get slides
    var slides = carousel.getElementsByClassName('carousel__item'),
    slidesLength = slides.length;

    // If no slides, quit.
    if (slidesLength <= 1) {
      return;
    }

    // Good idea to use the fragment, must not have worked.
    // var frag = w.document.createDocumentFragment();

    // Create and add previous and next arrows
    var prev = w.document.createElement('div');
    prev.className = 'js__layout__carousel__control  js__carousel__control  js__layout__carousel__control__prev  js__carousel__control__prev';
    prev.setAttribute('onClick', 'mySwipe.prev()');
    prev.setAttribute('title', 'Previous'); 

    var next = w.document.createElement('div');
    next.className = 'js__layout__carousel__control  js__carousel__control  js__layout__carousel__control__next  js__carousel__control__next';
    next.setAttribute('onClick', 'mySwipe.next()'); 
    next.setAttribute('title', 'Next');

    carousel.appendChild(prev);
    carousel.appendChild(next);

    // Create and add position bullets
    var bullets = w.document.createElement('ol');
    bullets.setAttribute('id', 'carousel__position');
    bullets.className = 'layout__page  js__layout__carousel__position  js__carousel__position'; 
    var frag = w.document.createDocumentFragment();     
    for (var i = 0; i < slidesLength; i++) {
      var bullet = w.document.createElement('li');
      bullet.className = 'js__carousel__position__indicator';
      if (i === 0) {
        bullet.className += ' is_active';
      }
      bullet.setAttribute('data-slide-to', i);
      bullet.setAttribute('onClick', 'mySwipe.slide(' + i + ')'); 
      bullets.appendChild(bullet);
    }
    carousel.appendChild(bullets);
    
    // Get individual bullets for later
    var indicators = bullets.getElementsByClassName('js__carousel__position__indicator');

    // Initalize the carousel
    window.mySwipe = Swipe(carousel, {
       startSlide: 0,
       speed: 600,
       auto: 6000,
       continuous: true,
       disableScroll: false,
       stopPropagation: false,
       callback: function(index, elem) {
          // somehow don't make bullets global and messy
          var i = indicators.length;
          while (i--) {
//            indicators[i].className = 'carousel__position__indicator';
            indicators[i].className = indicators[i].className.replace(/\s*\bis_active\b/ig, '');
          }
          // replace with add classname
          indicators[index].className += '  is_active';
       },
       transitionEnd: function(index, element) {}
    });
  }

    w.positionCarouselControlls = function() {  

// set captions equal height if media query less then 40em
// 

    // Get carousel container
    var carousel = w.document.getElementById('carousel');

    // If no carousel container, quit.
    if (carousel === null) {
      return;
    }

    // Get bullets and controls
    var bullets       = carousel.getElementsByClassName('js__layout__carousel__position'),
      controls      = carousel.getElementsByClassName('js__layout__carousel__control'),
      imageWrappers = carousel.getElementsByClassName('layout__carousel__image__wrapper');

    // If screen is big enough, remove any inlined styles & quit.
    if (matchMedia('screen and (min-width: 40em)').matches) {
 //     w.setStyle(bullets, 'top', 'auto');
      w.setStyle(controls, 'height', 'auto');
      w.setStyle(imageWrappers, 'minHeight', 'auto');
      return;
    }

    /**
     * As the image may not have already loaded when this runs, 
     * we will get the width and assume the 25:9 image ratio to
     * calulate the our positioning.
     */
     var imageWidth  = carousel.offsetWidth,
         imageHeight = imageWidth * 9 / 25;

//    w.setStyle(bullets, 'top', (imageHeight - 24) + 'px');
    w.setStyle(controls, 'height', imageHeight + 'px');
    w.setStyle(imageWrappers, 'minHeight', imageHeight + 'px');   
  }

  w.setStyle = function(els, st, val) {
    for (var i = 0, il = els.length; i < il; i++) {
      if (val == 'auto' && els[i].style[st] != '' && els[i].style[st] != 'auto') {
            els[i].style[st] = val;        
          }
          else {
            els[i].style[st] = val;
          }
    }   
  } 

  // Run on domready (w.load as a fallback)
  if( w.addEventListener ){
    w.addEventListener( "resize", w.positionCarouselControlls, false );
    w.addEventListener( "DOMContentLoaded", function(){
      w.setupCarousel();
      w.positionCarouselControlls();
      // Run once only
      w.removeEventListener( "load", w.setupCarousel, false );
      w.removeEventListener( "load", w.positionCarouselControlls, false );
    }, false );
    w.addEventListener( "load", w.setupCarousel, false );
    w.addEventListener( "load", w.positionCarouselControlls, false );
  }
  else if( w.attachEvent ){
    w.attachEvent( "onload", w.setupCarousel );
    w.attachEvent( "onload", w.positionCarouselControlls );
  }
}(this));