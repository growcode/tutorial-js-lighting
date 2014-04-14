#!/usr/bin/env ruby
require 'rdiscount'
require 'nokogiri'

words = 0
content = $stdin.read

html = RDiscount.new(content).to_html

doc = Nokogiri::HTML(html)

codes = doc.css("pre code")
codes.each do |code|
  words += code.inner_html.split("\n").size * 15
    code.parent.remove
	end

	words += doc.inner_text.split(/\s+/).size

	puts words

	puts "You need to cut #{words - 2700} words"
