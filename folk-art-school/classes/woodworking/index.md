---
published: true
layout: page
title: Woodworking
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
hero:
  image: 16x9/folk-art-school/woodworking.jpg
  alt:
  caption:
related:
- /visit/plan/decorah/
- /folk-art-school/housing-and-food/

navigation:
  order: 60
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image: 46x21/folk-art-school/woodworking.jpg
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description   
---
Woodworking is a blast at Vesterheim! Some of the most highly-respected and fun-loving woodworkers in the country and from Norway teach their woodworking techniques at Vesterheim. From simple carved figures and chip-carved ornaments to elaborate acanthus furniture, you're sure to find a woodworking class that's right for you.

{% assign class__pagelist = site.data.pagelist | where: 'parent', page.url | sort: 'dtstart' %}
{% include folk-art-school/class-list.html %}
{% assign assign class__pagelist = nil %}

To register for classes, please print a class registration [form](/folk-art-school/registration/forms/class-reg-form.pdf) (pdf) and send the form, along with your class payment to: <br />
Darlene Fossum-Martin<br />
Vesterheim Museum<br />
P.O. Box 379<br />
Decorah, IA 52101

For more information, contact Darlene Fossum-Martin at 563-382-9681, ext. 215, or email at [dfossum-martin@vesterheim.org](mailto:dfossum-martin@vesterheim.org).