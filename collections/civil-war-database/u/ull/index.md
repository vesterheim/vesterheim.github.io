---
published: true
layout: civil-war-db-letters

newlink: /collections/civil-war-database/u/ull/
oldlink: /CivilWar/db/u/ull/index.html

title: ULL Listings
short_title: ULL
meta_title: Civil War soilder names starting with 'ULL'
meta_description:  # Used in HTML head and as the description for some search engines

pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image:         # Defaults to cropped page hero image
  alt:
  caption:
  title: ULL
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description 

previous:
  title: ULE
  url: /collections/civil-war-database/u/ule/
next:
  title: ULR
  url: /collections/civil-war-database/u/ulr/

---
Browse Last Names Starting with “ULL”
====================================================

{% assign soldier__pagelist = site.data.pagelist | where: 'parent', page.url | sort: 'title' %}
{% if soldier__pagelist.size > 0 %}
  {% assign soldier__pages = '' | split: '' %}

  {% for soldier__page in soldier__pagelist %}
    {% assign sp = site.pages | where: 'url', soldier__page.url | first %}
    {% assign soldier__pages = soldier__pages | push: sp %}
  {% endfor %}
<dl>
  {% for soldier__page in soldier__pages %}
  <dt class="title"><a href="{{ soldier__page.url }}">{{ soldier__page.title | markdownify | remove: '<p>' | remove: '</p>' | strip_newlines }}</a></dt>
  <dd>{{ soldier__page.content }}</dd>{% endfor %}
</dl>
{% endif %}
{% assign assign soldier__pagelist = nil %}
{% assign soldier__pages = nil %}
{% assign soldier__page = nil %}