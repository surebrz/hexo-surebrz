title: 从前的一个A*
date: 2017-02-06 12:01:25
tags: [ruby, A*]
categories: 成品
---

以前的一个a*练习，搬过来凑个数……

A*算法描述见[这篇博文](http://www.policyalmanac.org/games/Chine%20Translation%20-%20For%20beginners.html)

<!--more-->

```ruby
#encoding=utf-8
MAP = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],       
      ]     
class Point
    attr_accessor       :x
    attr_accessor       :y
    attr_accessor       :g
    attr_accessor       :h
    attr_accessor       :f
    attr_accessor       :parent
    def initialize(x, y, parent)
        self.x = x
        self.y = y
        self.parent = parent
    end
    def to_s
        "#{super.to_s}, #{[self.x, self.y, self.g, self.h, self.f]}"
    end
end
 
$open = {}
$close = {}
 
def find(sx, sy, ex, ey)
    startP = Point.new(sx, sy, nil)
    startP.g = 0
    pos = startP
    while (!$open[[ex, ey]]) do
        dealAround(pos, ex, ey) # 检查周围元素，计算f
        pos = getMinFPos
    end
    pos = $open[[ex, ey]]
    path = []
    while (pos.parent) do
        path << [pos.x, pos.y]
        pos = pos.parent
    end
    path << [pos.x, pos.y]
    for y in 0...MAP.size
        for x in 0...MAP[0].size
            print (path.include?([x, y])) ? "☆" : (MAP[y][x] == 0 ? "□" : "■")
        end
        print "\r\n"
    end
    p path
end
def getMinFPos
    return nil if $open.size < 1
    minG = $open.values[0].g
    minGPos = $open.values[0]
    $open.values.each{|pos|
        if minG > pos.g
            minG = pos.g
            minGPos = pos
        end
    }
    return minGPos
end
def dealAround(pos, endx, endy)
    # 将pos加入close列表
    $close[[pos.x, pos.y]] = pos    
    # 将pos从open列表中移出
    $open.delete([pos.x, pos.y])
    # 检查周围元素
    [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].each{|posOffset|
        # 跳过边界
        next if pos.x + posOffset[0] < 0 or pos.y + posOffset[1] < 0 or pos.x + posOffset[0] > MAP[0].size - 1 or pos.y + posOffset[1] > MAP.size - 1
        # 跳过不可通行的方块
        next if MAP[pos.y + posOffset[1]][pos.x + posOffset[0]] != 0
        # 跳过close列表
        next if $close[[pos.x + posOffset[0], pos.y + posOffset[1]]]
         
        newPos = Point.new(pos.x + posOffset[0], pos.y + posOffset[1], pos)
        # 计算g
        if posOffset[0].abs + posOffset[1].abs == 2 # 斜向
            newPos.g = pos.g + 14
        else
            newPos.g = pos.g + 10
        end
        # 计算h
        newPos.h = (endx - newPos.x).abs * 10 + (endy - newPos.y).abs * 10
        # 计算f
        newPos.f = newPos.g + newPos.h
        # 添加到open列表
        if $open[[newPos.x, newPos.y]] # 已存在
            thePos = $open[[newPos.x, newPos.y]]    
            tempG = ((thePos.x - pos.x).abs + (thePos.y - pos.y).abs == 2) ? (pos.g + 14) : (pos.g + 10)
            if tempG < thePos.g  # 当前节点使g更小
                thePos.g = tempG
                thePos.f = tempG + thePos.h
                thePos.parent = pos # 修改父节点为当前节点
            end
        else    # 不存在
            $open[[newPos.x, newPos.y]] = newPos
        end
    }
end
 
find(0, 0, 7, 7)
```

效果

![预览图](http://wx2.sinaimg.cn/mw690/a94a86cbly1fcgmb6sujgj20it0aw757.jpg)