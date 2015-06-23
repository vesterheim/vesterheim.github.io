require './_plugins/vester_utils.rb'

module Jekyll

	class PageListGenerator < Generator
		priority :low
		safe true

		def generate(site)
			# All pages and posts
			nodes = site.pages + site.posts

			# All navigable pages and posts for hash
			# Even if pagelist['exclude'] == true, we need them 
			# for breadcrumbs and the like.
			navigable_nodes = nodes.select { |node| VesterUtils.is_navigable?(node) }

			# Save results for reuse and add to site.data
			pagelist_hash = create_pagelist_hash(navigable_nodes)
			site.data['pagelist_hash'] = pagelist_hash

			# Navigable nodes excluding pagelist['exclude'] == true
			# that should not appear in menu
			pagelist_nodes = nodes.select do |node| 
				pagelist = node['pagelist'] || {}
				VesterUtils.is_navigable?(node) && ! pagelist['exclude'] == true
			end

			# Use info from auto_nav_hash. Save results for reuse. 
			# Add to site.data 
			pagelist_array = 
				VesterUtils.create_nodes_array(pagelist_nodes, pagelist_hash)
			site.data['pagelist'] = pagelist_array
		end

		# Create pagelist hash of navigable pages
		def create_pagelist_hash(pages)
			hash = {}
			pages.each do |page|
				next unless VesterUtils.is_navigable?(page)
				redirect_to = page['redirect_to'] || Array.new
				navigation = page['navigation'] || {}
				pagelist   = page['pagelist'] || {}

				node = {
					'page_title' => page['title'] || VesterUtils.get_nav_title(page),
					'title' => get_pagelist_title(page),
					'short_title' => get_pagelist_short_title(page),
					'subtitle' => get_pagelist_subtitle(page),
					'teaser' => get_pagelist_teaser(page),
					'url' => redirect_to.first || page['url'],
					'layout' => page['layout'] || nil,
					'order' => pagelist['order'] || navigation['order'] || 1000,
					'dtstart' =>  pagelist['dtstart'] || page['dtstart'] || nil,
					'dtend' =>  pagelist['dtend'] || page['dtend'] || nil
				}
				node.merge!get_pagelist_image(page)
				node.merge!VesterUtils.create_geneology_hash(page, pages)
				node['level'] = node['ancestors'].size
				node['handle'] = VesterUtils.generate_handle(node)
				node['id'] = VesterUtils.generate_id(node)
				hash[page['url']] = node
			end				
			hash
		end

		def get_pagelist_image(page)
			pagelist = page['pagelist'] || {}
			hero = page['hero'] || {}
			if pagelist['image'] 
				{
					'image' => pagelist['image'],
					'alt' => pagelist['alt'],
					'caption' => pagelist['caption']
				}
			elsif hero['image']
				{
					'image' => hero['image'],
					'alt' => hero['alt'],
					'caption' => hero['caption']
				}
			else
				{
					'image' => '46x21/fpo_46x21-368.png',
					'alt' => nil,
					'caption' => nil
				}				
			end
		end	

		def get_pagelist_short_title(page)
			pagelist = page['pagelist'] || {}
			pagelist['short_title'] || get_pagelist_title(page)
		end	

		# Need to test!
		# Add options for POST with dates and no subtitle?
		def get_pagelist_subtitle(page)
			pagelist = page['pagelist'] || {}
			nil if pagelist['subtitle'] == false
			pagelist['subtitle'] || page['subtitle']
		end

		def get_pagelist_teaser(page)
			pagelist = page['pagelist'] || {}
			pagelist['teaser'] || page['meta_description'] || page['excerpt']
		end

		def get_pagelist_title(page)
			pagelist = page['pagelist'] || {}
			pagelist['title'] ||
				page['title'] ||
				VesterUtils.get_nav_short_title(page)
		end	

	end
end