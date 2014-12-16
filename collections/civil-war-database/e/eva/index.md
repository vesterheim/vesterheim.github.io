---
published: true
layout: civil-war-db-letters

newlink: /collections/civil-war-database/e/eva/
oldlink: /CivilWar/db/e/eva/index.html

title: EVA Listings
short_title: EVA
meta_title: Civil War soilder names starting with 'EVA'
meta_description:  # Used in HTML head and as the description for some search engines

pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image:         # Defaults to cropped page hero image
  alt:
  caption:
  title: EVA
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description 

previous:
  title: EST
  url: /collections/civil-war-database/e/est/
next:
  title: EVE
  url: /collections/civil-war-database/e/eve/

---
Browse Last Names Starting with “EVA”
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