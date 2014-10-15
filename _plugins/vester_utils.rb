module Jekyll
	module VesterUtils
  	extend self

		def add_sub_depth(nodes)
			nodes.each.with_index do |node, i|
				level_next = nodes[i+1] ? nodes[i+1]['level'] : 1
				node['sub_depth'] = node['level'] - level_next
			end
		end	

		# Given page and pages, create and return geneology related hash
		def create_geneology_hash(page, pages)	
			hash = {}
			hash['ancestors'] = find_ancestors(page, pages)
			hash['ancestors'].pop		
			hash['root'] = hash['ancestors'].last || page['url']
			hash['parent'] = hash['ancestors'].first || '/'
			hash['ancestors'] << '/'
			hash
		end	

		# Create sorted array based on nodes_hash and add sub_depth
		def create_nodes_array(nodes, nodes_hash)
			menu_nodes = nodes.map { |node| nodes_hash[node['url']] }
			root_nodes = VesterUtils.get_root_nodes(menu_nodes)
			auto_nav_array = VesterUtils.sort_nodes_array(root_nodes, menu_nodes)
			add_sub_depth(auto_nav_array)
		end

		def generate_handle(page)
			slugify(page['url']).
				sub(/^#{slugify(page['parent'])}_*/, '')
		end

		def generate_id(page)
			slugify(page['url'])
		end

		def get_nav_title(page)
			navigation = page['navigation'] || {}
			navigation['title'] || 
				navigation['short_title'] || 
				page['short_title'] || 
				page['title']
		end	

		def get_root_nodes(nodes)
			nodes.select { |n| 
				n['level'] == 1
			}.sort { |x, y| 
				[x['order'], x['title']] <=> [y['order'], y['title']]
			}
		end

		# Given page and pages, return page's ancestors
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
#						ancestors.unshift "#{candidate}#{variant}" 
						ancestors.unshift candidate.clone + variant.clone
						break
					end
				end
			end
			ancestors << '/'
		end	

		# Determine if page is navigable
		def is_navigable?(page)
			navigation = page['navigation'] || {}
			isnt_navigable = 
				get_nav_title(page) == nil || 			 # doesn't have a title
				/^\/(?:index.html?)?$/ =~ page['url'] || # is homepage (handled later)
#				navigation['exclude'] == true || 		 # is explicity excluded
				page['published'] == false || 			 # is explicity unpublished
				page['published'] == 'draft'			 # is a draft
			! isnt_navigable
		end

		def slugify(url)
			unless url.nil?
				url.
					downcase.
					sub(/\.html?$/, ''). 		# Remove trailing '.html'
					sub(/^\//, '').				# Remove leading '/'
					sub(/\/$/, '').				# Remove trailing '/'
					gsub('/', '__').			# Replace '/' with '__'
					gsub(/[^a-z0-9_\-]+/, '-')	# Replace each non-alphanumeric character sequence with a hyphen
			end
		end

		# Sort nodes with selected nodes (roots)
		def sort_nodes_array(selected_nodes, all_nodes)
			nodes_sorted = []
			selected_nodes.
				map {|node| node.clone }.
				each do |node|
					children = all_nodes.
						select { |n| n['parent'] == node['url'] }.
						sort { |x, y| 
							[x['order'], x['title']] <=> [y['order'], y['title']]
						}
					node['has_children?'] = children.size > 0
					nodes_sorted << node				
					nodes_sorted << sort_nodes_array(children, all_nodes) if 
						node['has_children?']
				end
			nodes_sorted.flatten
		end

	end
end