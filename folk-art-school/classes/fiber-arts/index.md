---
published: true
layout: page
title: Fiber Arts
meta_title:        # Appears on bookmarks, search results, etc...
meta_description:  # Used in HTML head and as the description for some search engines
hero:
  image: 16x9/folk-art-school/weaving.jpg
  alt:
  caption:
related:
- /events/calendar/2016/04/02/getting-loopy-gathering-of-nalbinders/ 
- /visit/plan/decorah/

navigation:
  order: 10
pagelist:
  exclude: false
  order:         # Defaults to navigation order  
  image: 46x21/folk-art-school/weaving_juuhl.jpg
  alt:
  caption:
  title:         # Defaults to navigation title
  subtitle:      # Defaults to page subtitle
  teaser:        # Defaults to page meta-description 
---
Vesterheim offers a wide selection of fiber arts classes. Come to learn the ancient art of _nålbinding,_ the detailed stitching of authentic _bunads,_ a variety of traditional Scandinavian weaving styles, and more. The instructors at Vesterheim are known throughout the fiber arts community for their high level of skill in both their artform and teaching methods. Plus, the Decorah community boasts many resources for textile enthusiasts — great artists, wonderful supply stores, and plenty of inspiration.

{% assign class__pagelist = site.data.pagelist | where: 'parent', page.url | sort: 'dtstart' %}
{% include folk-art-school/class-list.html %}
{% assign assign class__pagelist = nil %}

To register for classes, please print a class registration [form](/folk-art-school/registration/forms/class-reg-form.pdf) (pdf) and send the form, along with your class payment to: <br />
Darlene Fossum-Martin<br />
Vesterheim Museum<br />
P.O. Box 379<br />
Decorah, IA 52101

For more information, contact Darlene Fossum-Martin at 563-382-9681, ext. 215, or email at [dfossum-martin@vesterheim.org](mailto:dfossum-martin@vesterheim.org).