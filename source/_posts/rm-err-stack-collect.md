title: 【转载】RPG Maker通用脚本收集-打印异常堆栈
date: 2019-04-11 13:47:36
tags: [转载, ruby]
categories: RPG Maker
---

原地址：https://rpg.blue/thread-409158-1-1.html
原作者: SailCat

用于显示异常堆栈详情。

**脚本内容根据评论有修改。**

VA版脚本:
用法：替换main脚本

```ruby
begin
  rgss_main { SceneManager.run } 
rescue StandardError
  # 加载脚本数据结构
  scripts = $RGSS_SCRIPTS
  # 显示出错详细信息
  t = $!.backtrace.collect do |s| 
    s.sub(/^{([0-9]+)}/) {"#<#{scripts[$1.to_i][1]}>"}
  end
  msgbox [$!.class, "-" * 80, $!.message, "-" * 80, t].flatten.join("\n")
end
```
