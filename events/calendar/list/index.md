---
published: true
layout: page
title: Secret Event List for Becky
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines

related:

navigation:
  exclude: true
pagelist:
  exclude: true  
---
{% capture linefeed %}

{% endcapture %}
{% for post in site.posts %}{% capture this_year %}{{ post.date | date: '%Y' }}{% endcapture %}{% capture next_year %}{{ post.next.date | date: '%Y' }}{% endcapture %}{% if this_year != next_year %}
###{{ post.date | date: '%Y' }}{{ linefeed }}{% endif %}{% capture this_month %}{{ post.date | date: '%B' }}{% endcapture %}{% capture next_month %}{{ post.next.date | date: '%B' }}{% endcapture %}{% if this_month != next_month %}
###{{ post.date | date: '%B' }}{{ linefeed }}{% endif %}- [{{ post.title }}]({{ post.url }})<br />{{ post.excerpt  | strip_html }}
{% endfor %}