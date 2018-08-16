title: cocos2dx-js显示/隐藏左下角fps信息
date: 2016-07-15 21:15:01
tags: [cocos2dx,javascript]
categories: Cocos2d-X
---

cocos2dx-js 3.x版本控制左下角debug信息的显示和隐藏方法。

<!--more-->

# 不显示debug信息

- 在 *project.json* 中增加设置

    ``` 
    "showFPS"	: 0,
    ```

# 使用代码控制显示/隐藏

1. 显示debug信息

    ```
    cc.Director.sharedDirector.setDisplayStats(true);
    ```
2. 隐藏debug信息

    ```
    cc.Director.sharedDirector.setDisplayStats(false);
    ```
