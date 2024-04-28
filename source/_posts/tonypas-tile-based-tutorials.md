title: 【原创翻译】Tonypa 基于 tile 地图的游戏开发指引 (Tonypa's tile-based tutorials)
date: 2024-04-25 19:09:20
tags: [教程,翻译,游戏开发]
categories: 教程
---

# 简介

略

# 为何使用瓦片？

## 为何使用瓦片？

在开始游戏编码前，我们先讨论一下基于瓦片地图的游戏。为何你一定要使用瓦片？瓦片地图游戏是否做起来更简单，或者可能更困难？Flash 是否对制作瓦片地图游戏更加便利？

瓦片从很久以前就已经在游戏开发中使用。在计算机没有上 GHz 的 CPU 和几百 MB 的内存之前，较低的运算速度和受限的内存意味着游戏开发者不得不开动脑筋，创造各种方式让游戏看起来更漂亮，运行得高效。

比如，如果你想要给游戏加入漂亮的背景图，但图片太大使得游戏运行很慢时，要怎么办呢？把图片切割成瓦片！

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p02_1.gif)

在上图中，你可以看到图片中的一些部分是完全一样的，1 和 4 相同，2 和 3 相同，5 到 9 的部分是完全一样的。将图片切割便得到了瓦片。整图比瓦片的文件大小要大得多，而你只需要 4 个不同的瓦片就可以绘制该图片。

瓦片另一个良好的特性是当你想要替换背景图片的一些部分时，并不需要完全重画，你可以仅仅重画 1 个瓦片的图片，比如你可以使用草地和鲜花的瓦片，然后在草地不变的情况下替换新的花朵。

## FLASH 和瓦片地图

众所周知，Flash 是基于矢量图的工具，因此 Flash 的图片文件通常有着较小的尺寸并且可以改变大小。单因此你就不必基于瓦片来制作游戏了？

As we all know Flash is vector based, so Flash files have small size and you can resize them. So, you wont need tiles at all to create game? Well, you can easily do art based games in Flash, but when your game area gets bigger and you want more features, you might be in trouble. Some things are so much easier to do in tile based games (isometric view, pathfinding and depth sorting to name few). Dont forget, tile based games have been around for a long time and much of the theory is usable with Flash too.

Sad part about tile based games in Flash is, that we wont benefit much from the drawing or timeline parts, our game is made with actionscript and basically we just have bunch of code to create, move and modify images on the stage.

Its also good idea to use bitmap images as tiles graphics. Yes, we could draw everything inside Flash and have the vector graphics, but when the game is run, player has to calculate the vectors on screen and we dont want anything to slow down our game. Bitmaps are pre-rendered and usually they look better too. If you want to import bitmap tiles into Flash, its usually best to save the images as GIF files with transparent background (for objects).

Enough boring talk, lets make something :)

First, we will see how to store our tile based maps.

# 地图格式

# 更多地图

# 创建瓦片地图

# 主角

# 按键移动

# 墙壁碰撞

# 开门

# 跳跃

# 拟态墙壁

# 楼梯

# 笨笨的敌人

# 更多敌人

# 射击

# 获取物品

# 会移动的瓦片

# 卷轴

# 更多类型的卷轴

# 深度

# 斜视角

# 鼠标移动

# 斜视角鼠标移动

# 斜视角卷轴

# 旋转主角

# 旋转背景

# 寻路

# 更多寻路

# 斜坡
