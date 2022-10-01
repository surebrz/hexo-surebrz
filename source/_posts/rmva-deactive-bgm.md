title: RMVA切换到后台时停止BGM思路
date: 2022-10-01 14:32:10
tags: [ruby,rmva]
categories: RPG Maker
---

微博图床挂了……
![效果](./origin/imgs/QQ20221001143505.png)
借助 @晴兰 和 @yangff 大佬的 WndProc 总算实现了切换后台事件的监听，之前从第三方 Player 入手一直不成功，目测是加载 RGSSXXX.dll 后 WndProc 被接管了。
![WIN32API](./origin/imgs/QQ20221001161636.png)
这样一来就可以处理 RM 默认切到后台后渲染暂停但 BGM 继续播放的情况，避免演出和音乐不同步。

原版 Audio 没有暂停，续播功能只支持 ogg 格式，需要使用第三方音乐引擎。

目前找到的有 

- [SEAL](https://rpg.blue/thread-256937-1-1.html)

- [FMOD](https://www.rpgmakercentral.com/topic/5259-audio-pump-up-fmod-ex-14/)(注意 fmod 收费)

代码：
<!--more-->
```ruby
$apicache = {}
class String
   def apicall(*args)
       $apicache[self] = Win32API.new(*self.split("|")) unless $apicache.include? self
       $apicache[self].call(*args)
   end
end
class Symbol
  def method_missing(*args, &block)
        self.to_s.send(*args, &block)
  end
end
class Win32API
  WM_MOVE	= 0x3
  WM_MOVING = 0x216
  WM_ACTIVATE = 0x6
  WM_WINDOWPOSCHANGED = 0x47
  WM_WINDOWPOSCHANGING = 0x46
end
module Roost   
    module MainWindow
        def self.getwndproc
           @wndproc
         end
        def self.setwndproc(obj)
           @wndproc=obj
        end
        def self.addwndproc(obj)
          @@wndprocs.push(obj)
        end
        @@wndprocs=[]
        @wndproc = lambda {|hwnd, msg, wp, lp|
          @@handle=false
          for i in @@wndprocs
            i.call(hwnd, msg, wp, lp)
          end
          return Roost::MainWindow.use_rm_proc(hwnd, msg, wp, lp)
        }
        def self.use_rm_proc(hwnd,msg,wp,lp)
          if (not @@handle)
            @@handle=true
            return :"user32|CallWindowProc|iiiii|i".apicall(@@oHandle,hwnd,msg,wp,lp)
          end
        end
        def self.disable_rm_proc
          @@handle=true
        end
        def self.enable
              Roost::MainWindow.instance_eval do
                def self.enable
                end
              end
            Roost::MainWindow.instance_eval do
              @msg = "\0"*24
              @hwnd = 0
              while @hwnd==0
               :"user32|GetMessage|piii|v".apicall(@msg, 0, 0, 0)
               @kmsg = @msg
               :"user32|TranslateMessage|p|v".apicall(@kmsg)
               :"user32|DispatchMessage|p|v".apicall(@kmsg)
               @hwnd = @msg.unpack("i*")[0]
             end
            @hdc = :"user32|GetDC|i|i".apicall(@hwnd)
            def self.hwnd
               return @hwnd
            end
            def self.hdc
              return @hdc
            end
            
            def self.findProc(l, n)
                   lib = :"kernel32|LoadLibrary|p|i".apicall(l);
                   ret = :"kernel32|GetProcAddress|ip|l".apicall(lib, n);
                   :"kernel32|FreeLibrary|l|v".apicall(lib)
                   return ret
            end
                 def self.loadfindProc(l, n)
                   lib = :"kernel32|LoadLibrary|p|i".apicall(l);
                   ret = :"kernel32|GetProcAddress|ip|l".apicall(lib, n);
                   return ret
            end
            def self.enableWndProc
              Roost::MainWindow.instance_eval do
                def self.enableWndProc
                end
              end
              @malloc = :"msvcrt|malloc|i|i"
              @memcpy = :"msvcrt|memcpy|ipi|v"
              
              
             sprintf    = self.findProc("msvcrt",    "sprintf")
             rgsseval   = self.findProc("RGSS300",  "RGSSGetInt")
             old        = :"user32|GetWindowLong|ll|l".apicall(@hwnd, -4)
             buf        = @malloc.apicall(1024)  
             fmt        = @malloc.apicall(2048)
             sprintfvar = @malloc.apicall(8)
             rgssevalvar= @malloc.apicall(8)
             oldvar     = @malloc.apicall(8)
             fmtvar     = @malloc.apicall(8)
             bufvar     = @malloc.apicall(8)
             defvar     = @malloc.apicall(8)
            
             :"msvcrt|strcpy|pp|p".apicall(fmt, "Roost::MainWindow.getwndproc.call(%d,%d,%d,%d)")
            
             @memcpy.apicall(sprintfvar, [sprintf].pack("i"),  4)
             @memcpy.apicall(rgssevalvar,[rgsseval].pack("i"), 4)
             @memcpy.apicall(oldvar,     [old].pack("i"),      4)
             @memcpy.apicall(fmtvar,     [fmt].pack("i"),      4)
             @memcpy.apicall(bufvar,     [buf].pack("i"),      4)
             @memcpy.apicall(defvar,     [self.findProc("user32", "DefWindowProcA")].pack("i"),      4)
            
             @code = [0x55,0x89,0xe5,0xff,0x75,0x14,
                      0xff,0x75,0x10,0xff,0x75,0x0c,
                      0xff,0x75,0x08,0xff,0x35].pack('C*')
             @code << [fmtvar].pack('l') << [0xff, 0x35].pack('C*')
             @code << [bufvar].pack('l') << [0xff, 0x15].pack('C*')
             @code << [sprintfvar].pack("l")
             @code << [0xff, 0x15].pack('C*')
             @code << [rgssevalvar].pack("l")
=begin
             @code << [0x83,0xc4,0x18, 0xff, 0x75, 0x14,
                       0xff,0x75, 0x10, 0xff, 0x75, 0x0c,
                       0xff,0x75, 0x08, 0xff, 0x15].pack('C*')
             @code << [oldvar].pack("l")
=end
             @code << [0x83,0xc4,0x18].pack('C*')
             @code << [0xc9,0xc2,0x10,0x00].pack('C*')
             #0xD1, 0xE8
             @shellcode = @malloc.apicall(2048)  
             @memcpy.apicall(@shellcode, @code, @code.size)
             @@oHandle= :"user32|SetWindowLong|iii|i".apicall(@hwnd, -4, @shellcode)
              #Returning Test : should be 5
              #Roost::MainWindow.setwndproc (lambda{|hwnd, msg, wp, lp| 5})
              #p :"user32|CallWindowProc|iiiii|i".apicall(@shellcode, 0, 0, 0, 0)
            end
          end
         
        end
        
  end
end

Roost::MainWindow.enable
Roost::MainWindow.enableWndProc

Roost::MainWindow.addwndproc (lambda {|hwnd, msg, wp, lp|
  if msg == Win32API::WM_MOVING
      p "WM_MOVING"
      unless RPG::BGM.last.name.empty?
        Audio.bgm_stop  # 停止bgm
      end
  end
  if msg == Win32API::WM_MOVE
      p "WM_MOVE"
      unless RPG::BGM.last.name.empty?
        RPG::BGM.last.replay # 继续bgm
      end
  end
  if msg == Win32API::WM_WINDOWPOSCHANGED
      p "WM_WINDOWPOSCHANGED"
      unless RPG::BGM.last.name.empty?
        Audio.bgm_stop  # 停止bgm
      end
  end
  if msg == Win32API::WM_WINDOWPOSCHANGING
      p "WM_WINDOWPOSCHANGING"
      unless RPG::BGM.last.name.empty?
        RPG::BGM.last.replay # 继续bgm
      end
  end
  if msg==Win32API::WM_ACTIVATE
    if wp == 0
      p "WM_ACTIVATE", wp
      unless RPG::BGM.last.name.empty?
        Audio.bgm_stop  # 停止bgm
      end
    else
      p "WM_ACTIVATE", wp
      unless RPG::BGM.last.name.empty?
        RPG::BGM.last.replay # 继续bgm
      end
      
    end
  end
})
```

事件码值参考 MSDN 或者 [这里](http://pinvoke.net/default.aspx/Constants.WM)
