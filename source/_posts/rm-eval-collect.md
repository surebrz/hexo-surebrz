title: 【转载】RPG Maker通用脚本收集-打印Eval错误调用详情
date: 2019-04-11 13:47:36
tags: [转载, ruby]
categories: RPG Maker
---

原地址：https://rpg.blue/thread-249703-1-1.html
原作者: 叶子

用于显示eval调用发生错误时的堆栈详情。
脚本:

<!-- more -->

```ruby
#==============================================================================
# ■ EvalStackFix
#------------------------------------------------------------------------------
#   修正eval中抛出的异常的backtrace不正确，进而导致脚本编辑器跳转不正确的问题
# 使用方法：
#   直接插入脚本编辑器
#   放置位置应尽量靠近Main
# 注意事项：
#   本代码仅适用于RPG Maker Ace。相同的机制可应用于其他版本
#==============================================================================
 
module EvalStackFix
  module_function
  #--------------------------------------------------------------------------
  # ● 包装eval内容，截取正确的backtrace
  #--------------------------------------------------------------------------
  def wrap(script)
    "begin
#{script}
  # 上面一行没有缩进是因为script可能包含=begin关键字，而=begin前面不能有空格
rescue Exception=>e
  true_backtrace = Marshal.load(Marshal.dump(e.backtrace)) # deep clone
  e.define_singleton_method(:correct_backtrace) do
    e.backtrace.replace(true_backtrace)
  end
  raise e
end"
  end
end
 
alias rgss_main_no_eval_stack_fix rgss_main
def rgss_main(&proc)
  begin
    rgss_main_no_eval_stack_fix(&proc)
  rescue Exception=>e
    p e
    e.correct_backtrace if e.respond_to?(:correct_backtrace)
    p e.backtrace
    raise e
  end
end
 
alias eval_no_stack_fix eval
def eval(script, *args)
  eval_no_stack_fix(EvalStackFix.wrap(script), *args)
end

```
