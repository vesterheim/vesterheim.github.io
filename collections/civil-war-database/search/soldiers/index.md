---
published: false
layout: none
---
{% assign soldiers = site.pages | where: 'layout', 'civil-war-db-record' | sort: 'title' %}
{% for soldier in soldiers %}- [{{ soldier.title }}]({{ soldier.url }})
{% endfor %}