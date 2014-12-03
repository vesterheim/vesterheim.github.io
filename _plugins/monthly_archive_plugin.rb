# Jekyll Module to create monthly archive pages
#
# Shigeya Suzuki, November 2013
# Copyright notice (MIT License) attached at the end of this file
#

#
# This code is based on the following works:
#   https://gist.github.com/ilkka/707909
#   https://gist.github.com/ilkka/707020
#   https://gist.github.com/nlindley/6409459
#

#
# Archive will be written as #{archive_path}/#{year}/#{month}/index.html
# archive_path can be configured in 'path' key in 'monthly_archive' of
# site configuration file. 'path' is default null.
#

module Jekyll

  module MonthlyArchiveUtil
    def self.archive_base(site)
      site.config['monthly_archive'] && site.config['monthly_archive']['path'] || ''
    end
  end

  # Generator class invoked from Jekyll
  class MonthlyArchiveGenerator < Generator
    def generate(site)
      posts_group_by_year_and_month(site).each do |ym, list|
        site.pages << MonthlyArchivePage.new(site, MonthlyArchiveUtil.archive_base(site),
                                             ym[0], ym[1], list[0]['post'],
                                             list[0]['previous-month'],
                                             list[0]['current-month'],
                                             list[0]['next-month'])
      end
      rescue => exception
        puts exception.backtrace
        raise exception
    end

    def get_next_previous_month(year, month)
        if month == 12 
          {'next-month' => {'year' => year+1, 'month' => '01'}, 'previous-month' => {'year' => year, 'month' => '%02d' % [month-1]}}
        elsif month == 1 
          {'next-month' => {'year' => year, 'month' => '%02d' % [month+1] }, 'previous-month' => {'year' => year-1, 'month' => '12'}}
        else 
          {'next-month' => {'year' => year, 'month' => '%02d' % [month+1] }, 'previous-month' => {'year' => year, 'month' => '%02d' % [month-1]}}
        end
    end

    def posts_group_by_year_and_month(site)
      posts_hash = Hash.new { |hash, key| hash[key] = [] }
      site.posts.each do |post|
        if post.data['occurrences'] then
          post.data['occurrences'].each do |occurrence|
            if occurrence['start-date'].to_date != occurrence['end-date'].to_date then
              # in case an event does not fall on the first day of the month it should still be in that month's events list, by removing the days
              # we're making sure each month is included.
              date_range = Date.new(occurrence['start-date'].year, occurrence['start-date'].month)..Date.new(occurrence['end-date'].year, occurrence['end-date'].month)
              months_in_range = date_range.select {|d| d.day == 1}
              months_in_range.each do |month|
                nxt_previous_months = get_next_previous_month(month.year, month.month)
                current_month = {'year' => month.year, 'month' => '%02d' % [month.month]}
                posts_hash[[month.year, month.month]] << {'post' => [post],
                                                          'previous-month' => nxt_previous_months['previous-month'],
                                                          'current-month' => current_month,
                                                          'next-month' => nxt_previous_months['next-month'] }
              end
            else
              nxt_previous_months = get_next_previous_month(occurrence['start-date'].year, occurrence['start-date'].month)
              current_month = {'year' => occurrence['start-date'].year, 'month' => '%02d' % [occurrence['start-date'].month]}
              posts_hash[[occurrence['start-date'].year, occurrence['start-date'].month]] << {'post' => [post],
                                                                                  'previous-month' => nxt_previous_months['previous-month'],
                                                                                  'current-month' => current_month,
                                                                                  'next-month' => nxt_previous_months['next-month'] }
            end
          end
        end
      end
      posts_hash
    end
  end

  # Actual page instances
  class MonthlyArchivePage < Page

    ATTRIBUTES_FOR_LIQUID = %w[
      year,
      month,
      date,
      content
    ]

    def initialize(site, dir, year, month, posts, previous_month, current_month, nxt_month)
      @site = site
      @dir = dir
      @year = year
      @month = month
      @previous_month = previous_month
      @current_month = current_month
      @next_month = nxt_month
      @archive_dir_name = '%04d/%02d' % [year, month]
      @date = Date.new(@year, @month)
      @layout =  site.config['monthly_archive'] && site.config['monthly_archive']['layout'] || 'monthly_archive'
      self.ext = '.html'
      self.basename = 'index'
      self.content = <<-EOS
{% for post in page.posts %}<li><a href="{{ post.url }}"><span>{{ post.title }}</span></a></li>
{% endfor %}
      EOS
      self.data = {
          'layout' => @layout,
          'navigation' => {
            'exclude' => true
          },
          'type' => 'archive',
          'title' => "Monthly archive for #{@year}/#{@month}",
          'posts' => posts,
          'previous_month' => @previous_month,
          'current_month' => @current_month,
          'next_month' => @next_month,
          'url' => File.join('/',
                     MonthlyArchiveUtil.archive_base(site),
                     @archive_dir_name, 'index.html')
      }
    end

    def render(layouts, site_payload)
      payload = {
          'page' => self.to_liquid,
          'paginator' => pager.to_liquid
      }.merge(site_payload)
      do_layout(payload, layouts)
    end

    def to_liquid(attr = nil)
      self.data.merge({
                               'content' => self.content,
                               'date' => @date,
                               'month' => @month,
                               'year' => @year
                           })
    end

    def destination(dest)
      File.join('/', dest, @dir, @archive_dir_name, 'index.html')
    end

  end
end

# The MIT License (MIT)
#
# Copyright (c) 2013 Shigeya Suzuki
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
