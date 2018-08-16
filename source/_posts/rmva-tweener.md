title: 【RMVA】缓动工具方法移植
date: 2018-07-17 10:26:19
tags: [ruby,rmva]
categories: RPG Maker
---

## 预览

![效果1](http://wx1.sinaimg.cn/mw690/a94a86cbly1ftcmzkpbakg209e0bo4qp.gif)

<!--more-->

![效果2](http://wx3.sinaimg.cn/mw690/a94a86cbly1ftcmzjylx8g209e0bo1kx.gif)

![效果3](http://wx3.sinaimg.cn/mw690/a94a86cbly1ftcmzj1c29g209e0bo1k0.gif)

## 代码

缓动效果来自：[Tweener Documentation](http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html)

```ruby

module Math
  class << self
    def pow(val, times)
      return val ** times
    end
    
  end
  
end
module Ease
  class << self
    def linear(t, b, c, d)
      return c * t / d + b
    end

    def inQuad(t, b, c, d)
      t = t / d
      p Math.pow(t, 2)
      return c * Math.pow(t, 2) + b
    end

    def outQuad(t, b, c, d)
      t = t / d
      return -c * t * (t - 2) + b
    end

    def inOutQuad(t, b, c, d)
      t = t / d * 2
      if t < 1 
        return c / 2 * Math.pow(t, 2) + b
      else
        return -c / 2 * ((t - 1) * (t - 3) - 1) + b
      end
    end

    def outInQuad(t, b, c, d)
      if t < d / 2 
        return outQuad(t * 2, b, c / 2, d)
      else
        return inQuad((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inCubic (t, b, c, d)
      t = t / d
      return c * Math.pow(t, 3) + b
    end

    def outCubic(t, b, c, d)
      t = t / d - 1
      return c * (Math.pow(t, 3) + 1) + b
    end

    def inOutCubic(t, b, c, d)
      t = t / d * 2
      if t < 1 
        return c / 2 * t * t * t + b
      else
        t = t - 2
        return c / 2 * (t * t * t + 2) + b
      end
    end

    def outInCubic(t, b, c, d)
      if t < d / 2 
        return outCubic(t * 2, b, c / 2, d)
      else
        return inCubic((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inQuart(t, b, c, d)
      t = t / d
      return c * Math.pow(t, 4) + b
    end

    def outQuart(t, b, c, d)
      t = t / d - 1
      return -c * (Math.pow(t, 4) - 1) + b
    end

    def inOutQuart(t, b, c, d)
      t = t / d * 2
      if t < 1 
        return c / 2 * Math.pow(t, 4) + b
      else
        t = t - 2
        return -c / 2 * (Math.pow(t, 4) - 2) + b
      end
    end

    def outInQuart(t, b, c, d)
      if t < d / 2 
        return outQuart(t * 2, b, c / 2, d)
      else
        return inQuart((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inQuint(t, b, c, d)
      t = t / d
      return c * Math.pow(t, 5) + b
    end

    def outQuint(t, b, c, d)
      t = t / d - 1
      return c * (Math.pow(t, 5) + 1) + b
    end

    def inOutQuint(t, b, c, d)
      t = t / d * 2
      if t < 1 
        return c / 2 * Math.pow(t, 5) + b
      else
        t = t - 2
        return c / 2 * (Math.pow(t, 5) + 2) + b
      end
    end

    def outInQuint(t, b, c, d)
      if t < d / 2 
        return outQuint(t * 2, b, c / 2, d)
      else
        return inQuint((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inSine(t, b, c, d)
      return -c * Math.cos(t / d * (Math::PI / 2)) + c + b
    end

    def outSine(t, b, c, d)
      return c * Math.sin(t / d * (Math::PI / 2)) + b
    end

    def inOutSine(t, b, c, d)
      return -c / 2 * (Math.cos(Math::PI * t / d) - 1) + b
    end

    def outInSine(t, b, c, d)
      if t < d / 2 
        return outSine(t * 2, b, c / 2, d)
      else
        return inSine((t * 2) -d, b + c / 2, c / 2, d)
      end
    end

    def inExpo(t, b, c, d)
      if t == 0 
        return b
      else
        return c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001
      end
    end

    def outExpo(t, b, c, d)
      if t == d 
        return b + c
      else
        return c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b
      end
    end

    def inOutExpo(t, b, c, d)
      return b if t == 0
      return b + c if t == d
      t = t / d * 2
      if t < 1 
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005
      else
        t = t - 1
        return c / 2 * 1.0005 * (-Math.pow(2, -10 * t) + 2) + b
      end
    end

    def outInExpo(t, b, c, d)
      if t < d / 2 
        return outExpo(t * 2, b, c / 2, d)
      else
        return inExpo((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inCirc(t, b, c, d)
      t = t / d
      return(-c * (Math.sqrt(1 - Math.pow(t, 2)) - 1) + b)
    end

    def outCirc(t, b, c, d)
      t = t / d - 1
      return(c * Math.sqrt(1 - Math.pow(t, 2)) + b)
    end

    def inOutCirc(t, b, c, d)
      t = t / d * 2
      if t < 1 
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
      else
        t = t - 2
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b
      end
    end

    def outInCirc(t, b, c, d)
      if t < d / 2 
        return outCirc(t * 2, b, c / 2, d)
      else
        return inCirc((t * 2) - d, b + c / 2, c / 2, d)
      end
    end

    def inElastic(t, b, c, d, a, p=nil)
      return if t == 0

      t = t / d

      return b + c if t == 1

      p = d * 0.3 if not p

      s = 0

      if not a or a < (c).abs
        a = c
        s = p / 4
      else
        s = p / (2 * Math::PI) * Math.asin(c/a)
      end

      t = t - 1

      return -(a * Math.pow(2, 10 * t) * Math.sin((t * d - s) * (2 * Math::PI) / p)) + b
    end

    # a: amplitud
    # p: period
    def outElastic(t, b, c, d, a, p=nil)
      return b if t == 0

      t = t / d

      return b + c if t == 1

      p = d * 0.3 if not p

      s = 0

      if not a or a < (c).abs
        a = c
        s = p / 4
      else
        s = p / (2 * Math::PI) * Math.asin(c/a)
      end

      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math::PI) / p) + c + b
    end

    # p = period
    # a = amplitud
    def inOutElastic(t, b, c, d, a=nil, p=nil)
      return b if t == 0

      t = t / d * 2

      return b + c if t == 2

      p = d * (0.3 * 1.5) if not p
      a = 0 if not a

      s = 0

      if not a or a < (c).abs
        a = c
        s = p / 4
      else
        s = p / (2 * Math::PI) * Math.asin(c / a)
      end

      if t < 1 
        t = t - 1
        return -0.5 * (a * Math.pow(2, 10 * t) * Math.sin((t * d - s) * (2 * Math::PI) / p)) + b
      else
        t = t - 1
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math::PI) / p ) * 0.5 + c + b
      end
    end

    # a: amplitud
    # p: period
    def outInElastic(t, b, c, d, a, p=nil)
      if t < d / 2 
        return outElastic(t * 2, b, c / 2, d, a, p)
      else
        return inElastic((t * 2) - d, b + c / 2, c / 2, d, a, p)
      end
    end

    def inBack(t, b, c, d, s=nil)
      s = 1.70158 if not s
      t = t / d
      return c * t * t * ((s + 1) * t - s) + b
    end

    def outBack(t, b, c, d, s=nil)
      s = 1.70158 if not s
      t = t / d - 1
      return c * (t * t * ((s + 1) * t + s) + 1) + b
    end

    def inOutBack(t, b, c, d, s=nil)
      s = 1.70158 if not s
      s = s * 1.525
      t = t / d * 2
      if t < 1 
        return c / 2 * (t * t * ((s + 1) * t - s)) + b
      else
        t = t - 2
        return c / 2 * (t * t * ((s + 1) * t + s) + 2) + b
      end
    end

    def outInBack(t, b, c, d, s)
      if t < d / 2 
        return outBack(t * 2, b, c / 2, d, s)
      else
        return inBack((t * 2) - d, b + c / 2, c / 2, d, s)
      end
    end

    def outBounce(t, b, c, d)
      t = t / d
      if t < 1 / 2.75 
        return c * (7.5625 * t * t) + b
      elseif t < 2 / 2.75 
        t = t - (1.5 / 2.75)
        return c * (7.5625 * t * t + 0.75) + b
      elseif t < 2.5 / 2.75 
        t = t - (2.25 / 2.75)
        return c * (7.5625 * t * t + 0.9375) + b
      else
        t = t - (2.625 / 2.75)
        return c * (7.5625 * t * t + 0.984375) + b
      end
    end

    def inBounce(t, b, c, d)
      return c - outBounce(d - t, 0, c, d) + b
    end

    def inOutBounce(t, b, c, d)
      if t < d / 2 
        return inBounce(t * 2, 0, c, d) * 0.5 + b
      else
        return outBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
      end
    end

    def outInBounce(t, b, c, d)
      if t < d / 2 
        return outBounce(t * 2, b, c / 2, d)
      else
        return inBounce((t * 2) - d, b + c / 2, c / 2, d)
      end
    end
  end
end


```

## 范例

[百度云](https://pan.baidu.com/s/1Mu9qqApzxF7LamEDud3aSw)
