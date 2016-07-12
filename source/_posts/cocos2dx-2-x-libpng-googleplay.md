title: cocos2dx-2.x解决GooglePlay警告的libpng版本问题
date: 2016-07-12 10:56:42
tags: [cocos2dx]
categories: 笔记
---

谷歌近日对使用低版本libpng库的应用发出下架警告：

![图片](http://ww4.sinaimg.cn/mw690/a94a86cbjw1f5qyi97j5hj20tc0og76x.jpg)

<!--more-->
工地使用的quickcocos2.2.3版本，对于cocos2dx2.x版本修复方案如下：

1. 到[这里](http://bengigi.com/wp-content/uploads/libpng_fix.zip)下载libpng_fix库

2. 解压zip包中的内容到

        cocos2dx\platform\third_party\android\prebuilt

    路径下。

3. 修改 **cocos2dx** 目录中的 *Android.md* 文件

    1. 将

        ```
        LOCAL_WHOLE_STATIC_LIBRARIES := cocos_libpng_static
        ```

        改为

        ```
        LOCAL_WHOLE_STATIC_LIBRARIES := cocos_libzlib_static
        LOCAL_WHOLE_STATIC_LIBRARIES += cocos_libpng_static
        ```

   2. 将

        ```
        $(call import-module,libpng)
        ```

        改为

        ```
        $(call import-module,libzlib)
        $(call import-module,libpng)
        ```

4. 打包完毕查看libpng版本

    ```
    unzip -p YourApp.apk | strings | grep "libpng"
    ```

