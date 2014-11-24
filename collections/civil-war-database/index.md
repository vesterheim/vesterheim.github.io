---
published: true
layout: page
title: Civil War Database
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
# Ratio: 16:9 | Recommended: 1492px by 840px | Minimum: 746px by 420px
hero:
  image: 16x9/collections/civil_war.jpg
  alt:
  caption:

navigation:
  exclude: false
  order: 40
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image:  46x21/collections/civil_war.jpg
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description   
---
This database contains information on Civil War soldiers born in Norway, plus many born in Sweden and Denmark. It also includes information on men serving in other American wars, from the Revolutionary War (two men, so far) to the Second World War.

Vesterheim’s Norwegians in the Civil War project is made possible through the generous support of Hamlet and Suzanne Peterson, Rochester, Minn., and a grant from Humanities Iowa and the National Endowment for the Humanities.

The companion volume *Ole Goes to War: Men from Norway who Fought in America’s Civil War*, by Jerry Rosholt, was made possible through a gift from the Government of Norway in honor of Vesterheim’s 125th Anniversary.

## How to Search

### If you know the last name…

If you know the name of the person for whom you are searching, it is best to browse by last name.  It is faster, easier, and more accurate than typing it into the search box. Under “**Browse by last name**,” select the first letter of the person’s last name and then select the first three letters of the person’s last name. This will give you all of the listings with those first three letters in their last name.

### If you don’t know the last name…

If you don’t know the last name, you can try using the search box. It works a lot like Google. If you know you had a relative named “Magnus” who was born in Norway and died or at least was a prisoner in Andersonville, Georgia. You could try:

<form action="<$MTCGIPath$><$MTSearchScript$>" method="get">
<input maxlength="256" name="search" size="40" value="Magnus Norway Andersonville" /><input type="submit" value="Search" />
</form>

Let’s say you looked up the variants of “Bolstad” from the “[Name Variations](/collections/civil-war-database/soldiers-names/)” page.  If you wanted to see all of the listings for “Bolstad” and “Baalstad”, as well as those that may reference “Bolstad” and “Baalstad”, you could try:

<form action="<$MTCGIPath$><$MTSearchScript$>" method="get">
<input maxlength="256" name="search" size="40" value="Bolstad OR Baalstad" /><input type="submit" value="Search" />
</form>