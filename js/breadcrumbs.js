/*! Breadcrumbs - If we can show full breadcrumbs on smaller screens without wrapping, do so. Author: Faust Gertz, 2014 */

(function( w ){

	// Enable strict mode
	"use strict";

	w.breadcrumbs = function() {

		// Get breadcrumbs container
		var breadcrumbs = document.getElementById('breadcrumbs');

		// If no breadcrumbs container, quit.
		if (breadcrumbs === null) {
			return;
		}
		
		// Get breadcrumb_item(s)
		var breadcrumbs_items = breadcrumbs.getElementsByClassName('breadcrumbs__item');

		// If no breadcrumb items, quit.
		if (breadcrumbs_items.length === 0) {
			return;
		}

		// Do breadcrumb_item(s) currently have class of js_breadcrumbs__item'?
		var js_breadcrumbs = breadcrumbs.getElementsByClassName('js__breadcrumbs__item').length > 0;

		// If screen is big enough, remove any 
		// js_breadcrumbs__item classes and quit.
		if (matchMedia('screen and (min-width: 40em)').matches) {
			if (js_breadcrumbs === true) {
				w.removeClassJS(breadcrumbs_items);
			}
			return;
		}

		// Get heights for js_breadcrumbs__item and sans 
		// js_breadcrumbs__item versions and make a note
		// if js_breadcrumbs__item is set or not.
		if (js_breadcrumbs === true) {		

			var js_breadcrumbs__height = breadcrumbs.offsetHeight;

			w.removeClassJS(breadcrumbs_items);
			js_breadcrumbs = false;

			var breadcrumbs__height = breadcrumbs.offsetHeight;
		}
		else {
			var breadcrumbs__height = breadcrumbs.offsetHeight;

			w.addClassJS(breadcrumbs_items);
			js_breadcrumbs = true;

			var js_breadcrumbs__height = breadcrumbs.offsetHeight;
		}

		// If js_breadcrumbs__item is set and it wraps, 
		// remove js_breadcrumbs__item classes
		if (js_breadcrumbs__height !== breadcrumbs__height && js_breadcrumbs === true) {
			w.removeClassJS(breadcrumbs_items);
		}

		// If js_breadcrumbs__item isn't set and it doesn't wraps 
		// add js_breadcrumbs__item classes
		if (js_breadcrumbs__height === breadcrumbs__height && js_breadcrumbs === false) {
			w.addClassJS(breadcrumbs_items);
		}
	};

	// Convenience functions
	w.removeClassJS = function(els) {		
		for (var i = 0, il = els.length; i < il; i++) {
			els[i].className = els[i].className.replace(/\s*\bjs__breadcrumbs__item\b/gi, ' ');
		}
	};
	
	w.addClassJS = function(els) {
		for (var i = 0, il = els.length; i < il; i++) {
			els[i].className += '  js__breadcrumbs__item';
		}		
	}
		
	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( "resize", w.breadcrumbs, false );
		w.addEventListener( "DOMContentLoaded", function(){
			w.breadcrumbs();
			// Run once only
			w.removeEventListener( "load", w.breadcrumbs, false );
		}, false );
		w.addEventListener( "load", w.breadcrumbs, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onload", w.breadcrumbs );
	}

}( this ));