module Jekyll
  module AssetFilter
    # Convert a Markdown string into HTML output sans the <p> element.
    #
    # input - The Markdown String to convert.
    #
    # Returns the HTML formatted String.
    #
    # Really need to do a better job, but this is a start.
    def markdownify_inline(input)
      site = @context.registers[:site]
      converter = site.getConverterImpl(Jekyll::Converters::Markdown)
      converter.convert(input).gsub('<p>','').gsub('</p>',' ')
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)