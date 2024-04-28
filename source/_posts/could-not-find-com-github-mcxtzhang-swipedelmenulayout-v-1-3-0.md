title: Could not find com.github.mcxtzhang:SwipeDelMenuLayout:V1.3.0 问题处理
date: 2023-10-11 10:47:50
tags: [Android]
categories: 笔记
---

## 问题

工地安卓项目编译时（2023.10.11）突然报 `Could not find com.github.mcxtzhang:SwipeDelMenuLayout:V1.3.0` 

## 解决

检查发现该组件在 [jitpack.io](https://jitpack.io/#com.github.mcxtzhang/SwipeDelMenuLayout) 上 V1.3.0 版本为 Error 状态，临时改为使用 V1.2.5 版本编译通过。

```
    api 'com.github.mcxtzhang:SwipeDelMenuLayout:V1.2.5'
```

![pic](https://picdl.sunbangyan.cn/2023/10/11/ncvw2x.png)


