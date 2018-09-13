title: Unity擦除Tilemap上的图块后cellBounds大小未改变的解决方法
date: 2018-09-13 11:28:06
tags: [Unity]
categories: Unity
---

# 问题

试用 Tilemap 取地图大小时发现在地图上绘制图块后，就算擦掉图块，Grid 的 cellBounds 大小也会一直保留被擦掉的图块占用的部分。

# 原因

来自官方解释

> The size of the Tilemap represents the largest bounds which was previously covered by the Tilemap. ** For performance reasons, erasing tiles does not automatically reduce the size of the Tilemap **.

# 解决

- 对 Tilemap 组件点击设置按钮 -> Compress Tilemap Bounds

或

- 使用代码

```c#
tilemap.CompressBounds();
```


