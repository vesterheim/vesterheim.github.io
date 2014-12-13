---

published: true
layout: civil-war-db-letter

newlink: /collections/civil-war-database/f/
oldlink: /CivilWar/db/f/index.html

title: F Listings
short_title: F
meta_title: Civil War soilder names starting with 'F'
meta_description:  # Used in HTML head and as the description for some search engines

pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image:         # Defaults to cropped page hero image
  alt:
  caption:
  title: F
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description 
---
## Browse Last Names Starting with “F”

<div id="subnavletters"> 
{% assign soldier__pagelist = site.data.pagelist | where: 'parent', page.url | sort: 'title' %}
{% if soldier__pagelist.size > 0 %}
{% for soldier__page in soldier__pagelist %}<a href="{{ soldier__page.url }}">{{ soldier__page.short_title }}</a> {% endfor %}
{% else %}
**There are no last names starting with “F”**
{% endif %}
{% assign assign soldier__pagelist = nil %}
{% assign soldier__page = nil %}
</div>