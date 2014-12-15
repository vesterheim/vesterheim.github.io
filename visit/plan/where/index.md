---
published: true
layout: page
title: Where is Vesterheim?
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
# Ratio: 16:9 | Recommended: 1492px by 840px | Minimum: 746px by 420px
hero:
  image: 16x9/maps/aerial-map.jpg
  alt:
  caption:
related:

navigation:
  order: 20
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image:         # Defaults to cropped page hero image
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description   
---
Vesterheim is located in downtown Decorah, Iowa.

Decorah is located at the intersection of U.S. Hwy. 52 (north/south) and Iowa Hwy. 9 (east/west).

I-90 (east/west) is approximately 60 miles north. I-35 (north/south) is about 90 miles west. I-380 (east/west) is 80 miles south.

Decorah is just under a 3-hour drive from the Minneapolis/St. Paul area and is approximately 60 miles from Rochester, Minnesota; La Crosse, Wisconsin; and Waterloo, Iowa.
<style>
  #map_canvas {
    width: 500px;
    height: 400px;
  }
  #map_canvas img{max-width:none!important;background:none!important}
</style>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<div id="map_canvas"></div>
<script>
  function initialize() {
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
      center: new google.maps.LatLng(43.30420669999999,-91.79171429999997),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
    }  
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(43.30420669999999, -91.79171429999997)});
    var infowindow = new google.maps.InfoWindow({content:"<b>Vesterheim</b><br/>520 West Water Street<br/>Decorah, IA 52101<br />563-382-9681" });
    google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});
    infowindow.open(map, marker);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
 </script> 