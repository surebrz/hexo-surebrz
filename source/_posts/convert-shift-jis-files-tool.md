title: 转换shift_jis文件名乱码脚本
date: 2016-07-17 11:40:54
tags: [ruby,工具脚本]
categories: Ruby
---

转换日站下载的文件shift_jis编码文件名乱码。

<!--more-->

将脚本文件和乱码文件放在同一目录下，执行

    ruby convert.rb

即可， **请放在英文目录下执行** 。

convert.rb

```ruby

require 'find'
require 'FileUtils'

err = []
Find.find("."){|f|
	next unless FileTest.file?(f)
	begin
		from = f.dup.encode("utf-8","shift_jis")
		to = from.encode("shift_jis","utf-8")
		save_path = File.dirname(File.expand_path(to))
		next if f == to
		FileUtils.mkdir_p(save_path)
		FileUtils.cp(f, to)
	rescue
		p "errorfile #{f}, skipped"
		err << f
		next
	end
}
p "finished"
p "errors #{err.size}"
exit if err.size == 0
p "error files:"
err.each{|e|p e}

```