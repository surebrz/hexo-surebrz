title: ADT导入FacebookSDK4.6.0
date: 2015-11-10 10:15:45
tags: [SDK,Android]
categories: Android
---

一次FacebookSDK4.6.0折腾笔记，惯例写折腾过程，非教程。

<!--more-->

4.6.0版本的sdk是Android Studio项目格式，为了导入Eclipse做了以下步骤：

1. 导入Eclipse
    - Import -> facebook

2. 配置Properties
    - Android -> Android4.4.2
    - Android -> IsLibrary打钩

3. 指定JDK版本
    - Eclipse中修改java complier -> 1.7
    - ant打包时增加ant.properties

            java.source=1.7
            java.target=1.7

4. 自动生成4.4.2配置

        android update project -p facebook_sdk_dir --subprojects

5. 拷贝lib
    - 拷贝旧版facebookSDK中lib库

            android-support-v4.jar
            bolts-android-1.1.2.jar

    __android-support-v4.jar中包含android.support.annotation__