/*! Site Search - Progressively enhance the google search. Author: Faust Gertz, 2014 */

(function( w ){

	// Enable strict mode
	'use strict';

	w.enhanceSiteSearch = function() {

		// Get items to change
		var siteSearch = document.getElementById('site-search');
		var siteSearchCX = document.getElementById('site-search__cx');
		var siteSearchNoJS = document.getElementById('site-search__nojs');

		// If we can't get all of the items, quit.
		if (siteSearch === null || siteSearchCX === null || siteSearchNoJS === null) {
			return;
		}

		siteSearch.action='/search/';
		siteSearchCX.value = '005748589984410066710:rpuk4fvq7ak';
		siteSearchNoJS.parentNode.removeChild(siteSearchNoJS);
	};

	// Run on resize and domready (w.load as a fallback)
	if( w.addEventListener ){
		w.addEventListener( 'DOMContentLoaded', function(){
			w.enhanceSiteSearch();
			// Run once only
			w.removeEventListener( 'load', w.enhanceSiteSearch, false );
		}, false );
		w.addEventListener( 'load', w.enhanceSiteSearch, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( 'onload', w.enhanceSiteSearch );
	}

}( this ));