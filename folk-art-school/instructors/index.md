---
published: true
layout: page
title: Our Instructors
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
# Ratio: 16:9 | Recommended: 1492px by 840px | Minimum: 746px by 420px

navigation:
  order: 30
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
{% assign instructors = site.data.pagelist | where: 'parent', page.url | sort: 'name' %}
{% for instructor in instructors %}
- [{{ instructor.title }}]({{ instructor.url }}){% endfor %}