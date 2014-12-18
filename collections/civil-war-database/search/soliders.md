---
published: true
layout: none
---
{% assign soldiers = site.pages | where: 'layout', 'civil-war-db-record' | sort: 'title' %}
{% for soldier in soldiers %}- [{{ solider.title }}]({{ solider.url }})
{% endfor %}