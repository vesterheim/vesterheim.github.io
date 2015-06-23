---
published: true
layout: page
title: Our Instructors
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
# Ratio: 16:9 | Recommended: 1492px by 840px | Minimum: 746px by 420px
related:
- /visit/plan/decorah/

navigation:
  order: 30
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image: 46x21/folk-art-school/woodworking_sannerud.jpg
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description  
---
{% assign instructors = site.data.pagelist | where: 'parent', page.url | sort: 'url' %}
{% for instructor in instructors %}
- [{{ instructor.title }}]({{ instructor.url }}){% endfor %}

To register for classes, please print a class registration [form](/folk-art-school/registration/forms/class-reg-form.pdf) (pdf) and send the form, along with your class payment to: <br />
Darlene Fossum-Martin<br />
Vesterheim Museum<br />
P.O. Box 379<br />
Decorah, IA 52101

For more information, contact Darlene Fossum-Martin at 563-382-9681, ext. 215, or email at [dfossum-martin@vesterheim.org](mailto:dfossum-martin@vesterheim.org).
