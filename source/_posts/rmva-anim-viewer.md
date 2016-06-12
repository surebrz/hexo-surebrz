title: RMVA序列帧动画查看工具
date: 2016-06-08 12:10:38
tags: [ruby,rmva]
categories: 成品
---
方便查看一整张大图型序列帧动画的工具
<!--more-->

````ruby
=begin
序列帧动画查看器，方便查看每帧宽高相等的序列帧动画
                                  -- by 烁灵
使用：

* 将大图放在Graphics/Pictures里
* 在game.ini中增加以下设置

[Ani_View]
ROW=8
COL=8
SPEED=1
FILENAME=anim

其中：

ROW : 行数
COL : 列数
SPEED : 播放速度（帧间隔，越大越慢）
FILENAME : 图片名

=end
module Sl_Settings
  module Ani_View
    GetPrivateProfileString = Win32API.new('kernel32', 'GetPrivateProfileString', 'ppppip', 'i')
    def get_info(key, default_value)
      buffer = [].pack('x256')
      section = 'Ani_View'
      filename = './Game.ini'
      get_option = Proc.new do |key, default_value|
        l = GetPrivateProfileString.call(section, key, default_value, buffer, buffer.size, filename)
        buffer[0, l]
      end
      return get_option.call(key, default_value)
    end
    def row
      get_info('ROW', '1').to_i
    end
    def col
      get_info('COL', '1').to_i
    end
    def spd
      get_info('SPEED', '1').to_i
    end
    def filename
      get_info('FILENAME', 'anim')
    end
  end
end
module SceneManager
  class << self
    include Sl_Settings::Ani_View
    def run
      args = $BTEST ? [] : [row, col, spd, filename]
      @scene = first_scene_class.new(*args)
      @scene.main while @scene
    end
    def first_scene_class
      $BTEST ? Scene_Battle : Scene_Ani
    end
  end
end
class Scene_Ani < Scene_Base
  def initialize(row, col, speed = 1, filename = Sl_Settings::Ani_View::FLN)
    super()
    @row = row
    @col = col
    @filename = filename
    @speed = speed
    @frame = 0
    @frame_cnt = 0
    @sprite = Sprite.new
    @sprite.bitmap = Cache.picture(@filename)
    w = @sprite.bitmap.width / @col
    h = @sprite.bitmap.height / @row
    @sprite.x = (Graphics.width - w) / 2
    @sprite.y = (Graphics.width - h) / 2
  end
  def update
    super
    update_ani if @frame_cnt % @speed == 0
    @frame_cnt += 1
    if Input.trigger?(:C) || Input.trigger?(:B)
      SceneManager.exit
    end
  end
  def update_ani
    x = @frame % @col
    y = @frame / @col
    w = @sprite.bitmap.width / @col
    h = @sprite.bitmap.height / @row
    rect = Rect.new(x * w, y * h, w, h)
    @sprite.src_rect = rect
    @frame += 1
    @frame %= @row * @col
  end
  def terminate
    super
    @sprite.dispose
  end
end
````

预览：
![预览图](http://ww4.sinaimg.cn/mw690/a94a86cbjw1f4np5m7jjbj20fa0ccmxu.jpg)

范例[点我](http://pan.baidu.com/s/1o7V29jc)

* 范例中使用的图片作者为[elnineo](http://opengameart.org/content/basic-explosion)，来自OpenGameArt.org