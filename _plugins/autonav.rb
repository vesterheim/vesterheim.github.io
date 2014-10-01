#- title: Want To See A Specific Object?
#  url: /visit/plan-your-visit/want-see-specific-object/
#  order: 60
#  handle: want-see-specific-object
#  handle_log: visit__plan-your-visit__want-see-specific-object
#  level: 3
#  parent: /visit/plan-your-visit/
#  ancestors: 
#      - /visit/plan-your-visit/
#      - /visit/
#  root: /visit/
#  ancestor_level_2: /visit/plan-your-visit/
#  ancestor_level_1: /visit/


module Jekyll

	class AutoNavGenerator < Generator
		priority :low
		safe true

		def generate(site)
			navigation = create_navigation(site.pages)
			
			auto_nav_hash = create_auto_nav_hash(navigation)
			site.data['auto_nav_hash'] = auto_nav_hash

			auto_nav = add_sub_depth(navigation)
			site.data['auto_nav'] = auto_nav

#			site.pages.each do |p|
#				next unless is_navigable?(p)	
#				puts p['url']
#				filter_nodes = filter_nodes(p)
#				puts filter_nodes
#				p.data['auto_nav'] = filter_nodes
#				p.data['CAPS'] = p['title']
#				filter_nodes = []
#			end
		end

		def create_navigation(pages)
			nodes = []
			pages.each do |page|
				next unless is_navigable?(page)

				navigation = page['navigation'] || {}

				node = {
					'title' => get_label(page),
					'url' => page['url'],
					'order' => navigation['order'] || 1000
				}
				node.merge!get_geneology_hash(page, pages)
				node['level'] = node['ancestors'].size
				node['handle'] = get_handle(node['url'], node['parent'])
				node['id'] = get_id(node['url'])
				nodes << node
			end
			roots = get_navigation_roots(nodes)
			sort_navigation(roots, nodes)
		end

		def is_navigable?(page)
			navigation = page['navigation'] || {}
			isnt_navigable = 
				get_label(page) == nil ||
				/^\/(?:index.html?)?$/ =~ page['url'] ||
				navigation['exclude'] == true ||
				page['published'] == false ||
				page['published'] == 'draft'
				! isnt_navigable
		end

		def get_label(page)
			navigation = page['navigation'] || {}
			navigation['label'] || navigation['title'] || page['title']
		end	

		def get_geneology_hash(page, pages)	
			hash = {}
			hash['ancestors'] = find_ancestors(page, pages)
			hash['ancestors'].pop
			hash['tancestors'] = test_find_ancestors(page, pages)			
			hash['root'] = hash['ancestors'].last || page['url']
			hash['parent'] = hash['ancestors'].first || '/'
			hash['ancestors'] << '/'
			hash
		end	

		def find_ancestors(page, pages)	
			ancestors = []		
			candidate = '/'
			path = page['url'].sub(/index\.html?$/, '')
			path_parts = path.sub('/', '').split('/')
			path_parts.each do |part|
				candidate << part + '/'
				next if candidate == path
				['', 'index.htm', 'index.html'].each do | variant |
					if pages.select { |p| 
						p['url'] == candidate + variant
					}.size > 0
						ancestors.unshift "#{candidate}#{variant}" 
						break
					end
				end
			end
			ancestors << '/'
		end	

		def test_find_ancestors(page, pages)	
			ancestors = []
			candidate = '/'
			path = page['url'].sub(/index\.html?$/, '')
			path_parts = path.sub('/', '').split('/')
			path_parts.each do |part|
				candidate = candidate + part + '/'
				next if candidate == path
				['', 'index.htm', 'index.html'].each do | variant |
					if pages.select { |p| 
						p['url'] == candidate + variant
					}.size > 0
						ancestors.unshift candidate
						break
					end
				end
			end
#			candidate.sub!(/.*/, '/')
#			i = 0
#			path_parts.each do |part|
#				i = i + 1
#				candidate << '/'
#				candidate << i
#				ancestors.unshift candidate
#			end
			ancestors << '/'
		end	


		def get_handle(url, parent_url)
			get_id(url).
				sub(/^#{get_id(parent_url)}_*/, '')
		end

		def get_id(url)
			url.
				downcase.
				sub(/\.html?$/, '').
				sub(/^\//, '').
				sub(/\.html?$/, '').
				sub(/\/$/, '').
				gsub('/', '__').
				gsub(/[^a-z0-9_\-]/, '-')
		end

		def get_navigation_roots(navigation)
			navigation.select { |n| 
									n['level'] == 1
								}.sort { |x, y| 
									[x['order'], x['title']] <=> [y['order'], y['title']]
								}
		end

		def sort_navigation(selected_nodes, all_nodes)
			nodes_sorted = []
			selected_nodes.each do |node|
				children = all_nodes.
					select { |n| n['parent'] == node['url'] }.
					sort { |x, y| 
						[x['order'], x['title']] <=> [y['order'], y['title']]
					}
				node['has_children?'] = children.size > 0
				nodes_sorted << node				
				nodes_sorted << sort_navigation(children, all_nodes) if 
					node['has_children?']
			end
			nodes_sorted.flatten
		end
		
		def create_auto_nav_hash(nodes)
			hash = {}
			nodes.each do |node|
				hash[node['url']] = {}
				node.each_pair do |key, value|
					hash[node['url']][key] = value
				end
			end
			hash
		end

		def add_sub_depth(nodes_sorted)
			nodes = nodes_sorted
			length = nodes.size - 1
			for i in 0..length
				level_current = nodes[i]['level']
				level_next = nodes[i+1] ? nodes[i+1]['level'] : 1
				nodes[i]['sub_depth'] = level_current - level_next
			end
			nodes
		end	


		def filter_nodes(page)
			hash = {}
			node = @auto_nav_hash[page.url]
			@auto_nav.each do |n| 
				if n['root'] == node['root']
					ancestors = n['ancestors'].slice(0, n['ancestors'].size - 2)
#					puts ancestors.to_s
					if n['level'] <= 2
						hash[n['url']] = true						
					elsif n['url'] == node['parent']
						hash[n['url']] = true
					elsif n['parent'] == node['url']
						hash[n['url']] = true						
					elsif n['url'] == node['url']
						hash[n['url']] = true
					end
				end
			end			
			nodes_filtered = @auto_nav.select {|n| hash[n['url']] }
			auto_nav = fix_has_children(nodes_filtered )
			auto_nav = add_sub_depth(auto_nav)
			auto_nav
		end

		def fix_has_children(nodes)
			fixed = []
			nodes.each do |node|
				children = nodes.select {|n| n['parent'] == node['url'] }
				node['children'] = children
#puts "* " + node['url']
				if children.size > 0
#					puts "* " + node['url']
#					puts "** " + node['children'].to_s
				end
#				node['children'] = []
#				nodes.each do |n|
#					if n['parent'] == node['url']
#						node['children'] << n['parent']
#					end
#					if node['url'] == '/visit/plan/'
#						puts "for #{n['url']}: #{n['parent']} == #{node['url']}"
#						puts n['parent'] == node['url']
#					end
#				end

				node['has_children?'] = children.size > 0
				fixed << node				
			end
			nodes
		end			

	end

end