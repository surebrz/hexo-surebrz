title: 解决VS2015无法创建新项目问题
date: 2017-08-01 14:44:46
tags: [ide]
categories: [笔记]
---

## 问题



VS2015无法建立新项目，点击确定会反复弹出创建工程窗口：


![问题](https://i.stack.imgur.com/KxC49.gif)


## 解决



- 删除 `C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE` 下的 `ItemTemplatesCache` 和 `ProjectTemplatesCache` 两个文件夹

- 在VS2015开发人员命令提示（开始-程序-visual studio 2015-visual studio tools下）中输入

    ``` 
    devenv /InstallVSTemplates 
    ```

- 执行成功后输入

    ``` 
    devenv /Setup
    ```

之后再打开就可以成功创建了。