module Jekyll
	module Pluralize

		def pluralize(number, singular, plural=nil)
			if number == 1
				"#{singular}"
			elsif plural == nil
				"#{singular}s"
			else
				"#{plural}"
			end
		end

	end
end

Liquid::Template.register_filter(Jekyll::Pluralize)