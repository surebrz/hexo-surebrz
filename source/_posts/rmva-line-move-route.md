title: RMVA 设置移动直线
date: 2015-12-17 21:47:12
tags: [ruby,rmva]
categories: RPG Maker
---
沿直线向指定坐标移动。图形学作业……使用Bresenham直线算法计算直线并按其移动。
<!--more-->

````ruby
# 沿直线向指定位置移动

# 设置移动路线
#     脚本：line_move(x, y)


LINE_MOVE_DEBUG = false # 开启显示调试路径

class Game_Character < Game_CharacterBase
  # 计算直线坐标点
  def collect_points(startX, startY, endX, endY)
    points = []
    
    dx = endX - startX
    dy = endY - startY
    
    if (endX > startX && endY < startY && dy.abs > dx.abs) ||
      (endX <= startX && endY <= startY) ||
      (endX < startX && endY > startY && dy.abs <= dx.abs) then
      tx, ty = startX, startY
      startX, startY = endX, endY
      endX, endY = tx, ty
    end
    
    dx = endX - startX
    dy = endY - startY
    
    stepX = dx < 0 ? -1 : 1
    stepY = dy < 0 ? -1 : 1
    
    d2x = (dx * 2).abs
    d2y = (dy * 2).abs
    x = startX
    y = startY
    points << [x, y]
    if d2y > d2x
      p0 = d2x * 2 - d2y # *2不影响判定正负
      pt = p0
      while y < endY do
        if pt >= 0
          x = x + stepX
          pt = pt - d2y
        end
        y = y + stepY
        pt = pt + d2x
        points << [x, y]
      end
    else      
      p0 = d2y * 2 - d2x # *2不影响判定正负
      pt = p0      
      while x < endX do
        if pt >= 0
          y = y + stepY
          pt = pt - d2x
        end
        x = x + stepX
        pt = pt + d2y
        points << [x, y]
      end
    end
    # 调试
    if LINE_MOVE_DEBUG
      s = SceneManager.scene
      def s.spriteset;@spriteset;end
      sp = s.spriteset
      def sp.tilemap;@tilemap;end
      tilemap = sp.tilemap
      w,h = $game_map.width,$game_map.height
      tilemap.flash_data = Table.new(w,h)
      points.each{|data|
      x = data[0];y = data[1]
      tilemap.flash_data[x, y] = 0xf84
      }
    end
    return points
  end
  def route_up
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_UP
    route.parameters = []
    return route
  end
  def route_down
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_DOWN
    route.parameters = []
    return route
  end
  def route_left
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_LEFT
    route.parameters = []
    return route
  end
  def route_right
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_RIGHT
    route.parameters = []
    return route
  end
  def route_left_up
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_UPPER_L
    route.parameters = []
    return route
  end
  def route_right_up
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_UPPER_R
    route.parameters = []
    return route
  end
  def route_left_down
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_LOWER_L
    route.parameters = []
    return route
  end
  def route_right_down
    route = RPG::MoveCommand.new
    route.code = ROUTE_MOVE_LOWER_R
    route.parameters = []
    return route
  end
  # 路径结束
  def route_end
    route = RPG::MoveCommand.new
    route.code = ROUTE_END
    route.parameters = []
    return route
  end
  # 计算移动方式
  def calc_route(points, index = 0)
    last_point = points[index]
    next_point = points[index + 1]
    if index == 0
      sx, sy = points[0]
      px, py = self.x, self.y
      if sx != px || sy != py
        points.reverse!
        last_point = points[index]
        next_point = points[index + 1]
      end
    end
#~     p [last_point, next_point]
    return [] unless next_point
    lx, ly = last_point
    nx, ny = next_point
    if lx < nx && ly == ny
      # 向右
      return [route_right] + calc_route(points, index + 1)
    elsif lx < nx && ly < ny
      # 右下
      return [route_right_down] + calc_route(points, index + 1)
    elsif lx < nx && ly > ny
      # 右上
      return [route_right_up] + calc_route(points, index + 1)
    elsif lx == nx && ly == ny
      # 不动..
      return [] + calc_route(points, index + 1)
    elsif lx == nx && ly < ny
      # 向下
      return [route_down] + calc_route(points, index + 1)
    elsif lx == nx && ly > ny
      # 向上
      return [route_up] + calc_route(points, index + 1)
    elsif lx > nx && ly == ny
      # 向左
      return [route_left] + calc_route(points, index + 1)
    elsif lx > nx && ly < ny
      # 左下
      return [route_left_down] + calc_route(points, index + 1)
    elsif lx > nx && ly > ny
      # 左上
      return [route_left_up] + calc_route(points, index + 1)
    end
    p "-_-？"
    return [] + calc_route(points, index + 1)
  end
  def line_move(ex, ey)
    sx = self.x
    sy = self.y
    points = collect_points(sx, sy, ex, ey)
#~     p points
    list = calc_route(points)
#~     p list
    list += [route_end]
    move_route = RPG::MoveRoute.new
    move_route.list = [nil] + list # nil占位
    move_route.wait = true
    move_route.repeat = false
    force_move_route(move_route)
  end
end
````
