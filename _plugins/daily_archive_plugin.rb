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

require 'active_support/time'

module Jekyll

  module DailyArchiveUtil
    def self.archive_base(site)
      site.config['daily_archive'] && site.config['daily_archive']['path'] || ''
    end
  end

  # Generator class invoked from Jekyll
  class DailyArchiveGenerator < Generator
    def generate(site)
      posts = posts_group_by_year_month_day(site)
      first_post =  posts.min_by { |k,v| Date.new(k[0], k[1], k[2]) }
      last_post =  posts.max_by { |k,v| Date.new(k[0], k[1], k[2]) }
      posts.each do |ymd, list|
        site.pages << DailyArchivePage.new(site, DailyArchiveUtil.archive_base(site),
                                             ymd[0], ymd[1], ymd[2], list, Date.new(first_post[0][0], first_post[0][1]), Date.new(last_post[0][0], last_post[0][1]))
      end
      # get the range of possible days for the first and last months including the beginning and end days potentially in the preceding/following months
      first_post_date = Date.new(first_post[0][0], first_post[0][1], first_post[0][2])
      last_post_date = Date.new(last_post[0][0], last_post[0][1], last_post[0][2])
      post_range = first_post_date.all_month.begin.all_week(:sunday).begin..last_post_date.all_month.end.all_week(:sunday).end
      message = "No events exist for the chosen day."
      post_range.each do |potential_date|
          # if posts doesn't have a key for a day in the range create an empty page for that day
          unless posts.has_key?([potential_date.year, potential_date.month, potential_date.day])
              site.pages << MessagePage.new(site, DailyArchiveUtil.archive_base(site), message, potential_date.year, potential_date.month, potential_date.day, Date.new(first_post[0][0], first_post[0][1]), Date.new(last_post[0][0], last_post[0][1]))
          end
      end
      message = "The museum is closed."
      site.data['closed']['dates'].each do |closed_day|
          site.pages << MessagePage.new(site, DailyArchiveUtil.archive_base(site), message, closed_day.year, closed_day.month, closed_day.day, Date.new(first_post[0][0], first_post[0][1]), Date.new(last_post[0][0], last_post[0][1]))
      end
      rescue => exception
        puts exception.backtrace
        raise exception
    end

    def posts_group_by_year_month_day(site)
      posts_hash = Hash.new { |hash, key| hash[key] = [] }
      site.posts.each do |post|
        if post.data['occurrences'] then
          post.data['occurrences'].each do |occurrence|
            if occurrence['start-date'].to_date != occurrence['end-date'].to_date then
              date_range = Date.new(occurrence['start-date'].year, occurrence['start-date'].month, occurrence['start-date'].day)..
                           Date.new(occurrence['end-date'].year, occurrence['end-date'].month, occurrence['end-date'].day)
              date_range.each do |date|
                unless site.data['closed']['dates'].include? date
                    posts_hash[[date.year, date.month, date.day]] << post
                end 
              end
            else
              unless site.data['closed']['dates'].include? occurrence['start-date'] 
                  posts_hash[[occurrence['start-date'].year, occurrence['start-date'].month, occurrence['start-date'].day]] << post
              end 
            end
          end
        end
      end
      posts_hash
    end
  end

  # Actual page instances
  class MessagePage < Page
    
      ATTRIBUTES_FOR_LIQUID = %w[
        year,
        month,
        date,
        content
      ]

      def initialize(site, dir, message, year, month, day, first_month, last_month)
        @site = site
        @dir = dir
        @year = year
        @month = month
        @day = day
        @archive_dir_name = '%04d/%d/%d' % [year, month, day]
        @layout =  site.config['daily_archive'] && site.config['daily_archive']['layout'] || 'daily_archive'
        nxt_previous_months = get_next_previous_month(year, month)
        @previous_month = nxt_previous_months['previous-month']
        @current_month = {'year' => year, 'month' => '%d' % [month]}
        @next_month = nxt_previous_months['next-month']
        if Date.new(@previous_month['year'], @previous_month['month']) < first_month then
            @previous_month = {'year' => nil, 'month' => nil}
        end
        if Date.new(@next_month['year'], @next_month['month']) > last_month then
            @next_month = {'year' => nil, 'month' => nil}
        end
        weeks = build_month_calendar(year, month)
        self.ext = '.html'
        self.basename = 'index'
        self.content = <<-EOS
<p>#{message}</p>
        EOS
        self.data = {
            'layout' => @layout,
            'navigation' => {
              'exclude' => true
            },
            'type' => 'archive',
            'title' => '%d' % [day],
            'posts' => [],
            'previous_month' => @previous_month,
            'current_month' => @current_month,
            'current_month_name' => Date::MONTHNAMES[@month],
            'next_month' => @next_month,
            'calendar' => weeks,
            'url' => File.join('/',
                       DailyArchiveUtil.archive_base(site),
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
  class DailyArchivePage < Page

    ATTRIBUTES_FOR_LIQUID = %w[
      year,
      month,
      date,
      content
    ]

    def initialize(site, dir, year, month, day, posts, first_month, last_month)
      @site = site
      @dir = dir
      @year = year
      @month = month
      @day = day
      @archive_dir_name = '%04d/%d/%d' % [year, month, day]
      @date = Date.new(@year, @month)
      @layout =  site.config['daily_archive'] && site.config['daily_archive']['layout'] || 'daily_archive'
      nxt_previous_months = get_next_previous_month(year, month)
      @previous_month = nxt_previous_months['previous-month']
      @current_month = {'year' => year, 'month' => '%d' % [month]}
      @next_month = nxt_previous_months['next-month']
      if Date.new(@previous_month['year'], @previous_month['month']) < first_month then
          @previous_month = {'year' => nil, 'month' => nil}
      end
      if Date.new(@next_month['year'], @next_month['month']) > last_month then
          @next_month = {'year' => nil, 'month' => nil}
      end
      weeks = build_month_calendar(year, month)
      # Full featured
      self.ext = '.html'
      self.basename = 'index'
      self.content = <<-EOS
{% for post in page.posts %}<li><a href="{% if post.redirect_to %}{{ post.redirect_to }}{% else %}{{ post.url }}{% endif %}"><span>{{ post.title }}</span></a></li>
{% endfor %}
      EOS
      self.data = {
          'layout' => @layout,
          'navigation' => {
            'exclude' => true
          },
          'type' => 'archive',
          'title' => '%d' % [day],
          'posts' => posts,
          'previous_month' => @previous_month,
          'current_month' => @current_month,
          'current_month_name' => Date::MONTHNAMES[@month],
          'next_month' => @next_month,
          'calendar' => weeks,
          'url' => File.join('/',
                     DailyArchiveUtil.archive_base(site),
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

def get_next_previous_month(year, month)
    if month == 12
      {'next-month' => {'year' => year+1, 'month' => 1}, 'previous-month' => {'year' => year, 'month' => month-1}}
    elsif month == 1
      {'next-month' => {'year' => year, 'month' => month+1 }, 'previous-month' => {'year' => year-1, 'month' => 12}}
    else
      {'next-month' => {'year' => year, 'month' => month+1 }, 'previous-month' => {'year' => year, 'month' => month-1}}
    end
end

def build_month_calendar(year, month)
    month = Date.new(year, month)
    month_range = month.all_month
    first_week = month_range.begin.all_week(:sunday)
    last_week = month_range.end.all_week(:sunday)
    month_range = first_week.begin..last_week.end
    weeks = []
    month_range.each_slice(7) do |day1, day2, day3, day4, day5, day6, day7|
        weeks << [{'year'=>day1.strftime('%Y'), 'month'=>day1.strftime('%-m'), 'day'=>day1.strftime('%-d')},
                  {'year'=>day2.strftime('%Y'), 'month'=>day2.strftime('%-m'), 'day'=>day2.strftime('%-d')},
                  {'year'=>day3.strftime('%Y'), 'month'=>day3.strftime('%-m'), 'day'=>day3.strftime('%-d')},
                  {'year'=>day4.strftime('%Y'), 'month'=>day4.strftime('%-m'), 'day'=>day4.strftime('%-d')},
                  {'year'=>day5.strftime('%Y'), 'month'=>day5.strftime('%-m'), 'day'=>day5.strftime('%-d')},
                  {'year'=>day6.strftime('%Y'), 'month'=>day6.strftime('%-m'), 'day'=>day6.strftime('%-d')},
                  {'year'=>day7.strftime('%Y'), 'month'=>day7.strftime('%-m'), 'day'=>day7.strftime('%-d')}
                 ]
    end
    weeks
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
