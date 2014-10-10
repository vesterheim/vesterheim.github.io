/** 
 * Faust Gertz <faust@faustgertz.com> 02/17/2014
 * This pattern is a fork of a CSS Tricks' post
 * http://css-tricks.com/equal-height-blocks-in-rows/
 * and Micah Godbolt's Responsive Equal Height Rows
 * http://codepen.io/micahgodbolt/full/FgqLc
 *
 * I customized it to my needs, rewrote it in native JavaScript
 * to remove the jQuery dependancy, and tried to reduce 
 * unnecessary changes to the DOM.
 *
 * Since we are using picturefill for images in the tiles, those
 * images may not have loaded when this function runs. Thus the 
 * height of the title, which is the only thing that might wrap,
 * is checked and modified when necessary instead of the height
 * of the tile.
 *
 * @TODO: Test in browsers other than recent versions of Chrome,
 *        Safari, Firefox, and Opera.
 *        Make sure we are always working in pixels when getting
 *        height, padding, etc... and abort if not.
 */
(function( w ){

  // Enable strict mode
  'use strict';

  w.tileEqualHeightRows = function() {

    // Get tile container
    var wrappers = document.getElementsByClassName('tile__wrapper');

    // If no tile container, quit.
    if (wrappers.length === 0) {
      return;
    }

    // Get tile(s). Assuming all tile(s) are children of tile__wrapper(s)
    var titles = document.getElementsByClassName('tile__title');

    // If no tiles, quit.
    if (titles.length === 0) {
      return;
    }

    // Did we set the silly js__* classes?
    var js_classes = document.getElementsByClassName('js__tile__wrapper').length > 0;

    // If screen is big enough, remove any 
    // js classes and heights.
    if (matchMedia('screen and (max-width: 30em)').matches) {
      if (js_classes === true) {
        w.removeClass(wrappers, 'js__tile__wrapper');
      }
      return;
    }

    // Otherwise add some js_classes
    // the wrapper needs to be position:relative;
    if (js_classes === false) {
      w.addClass(wrappers, 'js__tile__wrapper');
    }
    
    var currentTallest = 0,
    currentRowStart = 0,
    rowTiles = [],
    rowTileHeights = [],
    title,
    currentHeight = 0,
    topPosition = 0;
 //     console.log(titles);
    for (var i = 0, il = titles.length; i < il; i++) {
      var currentTile = 0;
      title = titles[i];
      topPosition = title.offsetTop;
      if (title.style.height !== '' && title.style.height !== 'auto') {
        title.style.height = 'auto';
      }
      currentHeight = w.getHeight(title);

      if(currentRowStart !== topPosition) {
        for (currentTile = 0 ; currentTile < rowTiles.length ; currentTile++) {
          if (rowTileHeights[currentTile] < currentTallest) {
            rowTiles[currentTile].style.height = currentTallest + 'px';
          }
        }
        rowTiles.length = 0; // empty the array
        rowTileHeights.length = 0; // empty the array
        currentRowStart = topPosition;
        currentTallest = currentHeight;
        rowTiles.push(title);
        rowTileHeights.push(currentHeight);
      }
      else {
        rowTiles.push(title);
        rowTileHeights.push(currentHeight);
        currentTallest = (currentTallest < currentHeight ? currentHeight : currentTallest);
      }
      for (currentTile = 0 ; currentTile < rowTiles.length ; currentTile++) {
          if (rowTileHeights[currentTile] < currentTallest) {
            rowTiles[currentTile].style.height = currentTallest + 'px';
          }
      }
    }


  };

  // Convenience functions
  w.getStyle = function(el, styleProp) {
    if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
    }
    else if (el.currentStyle) {
      return el.currentStyle[styleProp];
    }
  };


  w.getHeight = function(el) {
    var height = el.offsetHeight;
    var cssProps = new Array('border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width');
    for (var i = 0, il = cssProps.length; i < il; i++) {
 //     height -= parseInt(getStyle(el, cssProps[i]), 10);
      height -= parseFloat(w.getStyle(el, cssProps[i]));
    }
    return height;
  };

  w.removeClass = function(els, cl) {
    var regex = new RegExp('\\s*\\b' + cl + '\\b', 'gi');
    for (var i = 0, il = els.length; i < il; i++) {
      els[i].className = els[i].className.replace(regex, ' ');
    }
  };
  
  w.addClass = function(els, cl) {
    for (var i = 0, il = els.length; i < il; i++) {
      els[i].className += '  ' + cl;
    }
  };
    
  // Run on resize and domready (w.load as a fallback)
  if( w.addEventListener ){
    w.addEventListener( 'resize', w.tileEqualHeightRows, false );
    w.addEventListener( 'DOMContentLoaded', function(){
      w.tileEqualHeightRows();
      // Run once only
      w.removeEventListener( 'load', w.tileEqualHeightRows, false );
    }, false );
    w.addEventListener( 'load', w.tileEqualHeightRows, false );
  }
  else if( w.attachEvent ){
    w.attachEvent( 'onload', w.tileEqualHeightRows );
  }

}( this ));