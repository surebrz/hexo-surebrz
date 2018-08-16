title: Ruby计算文件的md5值
date: 2018-08-16 13:26:01
tags: [ruby]
categories: Ruby
---

```ruby
require "digest/md5"
md5 = Digest::MD5.hexdigest(File.open(filename, 'rb'){|fs|fs.read})
```