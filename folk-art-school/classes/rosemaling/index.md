---
published: true
layout: page
title: Rosemaling
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
hero:
  image: 16x9/folk-art-school/rosemaling-girl-mom.jpg
  alt:
  caption:
related:

navigation:
  order: 50
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image: 46x21/folk-art-school/rosemaling.jpg
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description   
---
{% assign class__pagelist = site.data.pagelist | where: 'parent', page.url | sort: 'dtstart' %}
{% include folk-art-school/class-list.html %}
{% assign assign class__pagelist = nil %}

To register for classes, please print a class registration [form](/folk-art-school/registration/forms/class-reg-form.pdf) (pdf) and send the form, along with your class payment to: <br />
Darlene Fossum-Martin<br />
Vesterheim Museum<br />
P.O. Box 379<br />
Decorah, IA 52101

For more information, contact Darlene Fossum-Martin at 563-382-9681, ext. 215, or email at [dfossum-martin@vesterheim.org](mailto:dfossum-martin@vesterheim.org).