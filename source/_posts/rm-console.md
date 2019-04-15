title: RPG Maker XP/VX 控制台窗口
date: 2019-04-15 13:04:30
tags: [ruby]
categories: RPG Maker
---

为XP、VX增加通用控制台窗口，用于调试，发布时需要去掉
脚本:

```ruby
#==============================================================================
# ■ Kernel
#------------------------------------------------------------------------------
# 　该模块中定义了可供所有类使用的方法。Object 类中包含了该模块。
#==============================================================================
module Kernel
  #--------------------------------------------------------------------------
  # ● 需要的 Windows API 函数
  #--------------------------------------------------------------------------
  GetWindowThreadProcessId = Win32API.new("user32", "GetWindowThreadProcessId", "LP", "L")
  GetWindow = Win32API.new("user32", "GetWindow", "LL", "L")
  GetClassName = Win32API.new("user32", "GetClassName", "LPL", "L")
  GetCurrentThreadId = Win32API.new("kernel32", "GetCurrentThreadId", "V", "L")
  GetForegroundWindow = Win32API.new("user32", "GetForegroundWindow", "V", "L")
  #--------------------------------------------------------------------------
  # ● 获取窗口句柄
  #--------------------------------------------------------------------------
  def get_hWnd
    # 获取调用线程（RM 的主线程）的进程标识
    threadID = GetCurrentThreadId.call
    # 获取 Z 次序中最靠前的窗口
    hWnd = GetWindow.call(GetForegroundWindow.call, 0)
    # 枚举所有窗口
    while hWnd != 0
      # 如果创建该窗口的线程标识匹配本线程标识
      if threadID == GetWindowThreadProcessId.call(hWnd, 0)
        # 分配一个 11 个字节的缓冲区
        className = " " * 11
        # 获取该窗口的类名
        GetClassName.call(hWnd, className, 12)
        # 如果匹配 RGSS Player 则跳出循环
        break if className == "RGSS Player"
      end
      # 获取下一个窗口
      hWnd = GetWindow.call(hWnd, 2)
    end
    return hWnd
  end
end
module Kernel
  Console = Win32API.new('kernel32', 'AllocConsole', 'v', 'v').call
  Conout = File.open("CONOUT$", "w")
  def p(str)
    Conout.write str.inspect 
    Conout.write "\n"
    Conout.flush
  end
  #显示控制台
  def show_console
    _console_switch
  end
  #隐藏控制台
  def hide_console
    _console_switch(false)
  end
  #
  def _console_switch(show = true)
    Win32API.new('user32', 'ShowWindow', 'll', 'l').call(
      Win32API.new('kernel32', 'GetConsoleWindow', 'v', 'l').call, show ? 5 : 0
    )
  end
  def facus_this
    hWnd = Kernel.get_hWnd
    Win32API.new('user32', 'SetForegroundWindow', 'l', 'l').call(
      hWnd
    )
  end
end
facus_this
```
