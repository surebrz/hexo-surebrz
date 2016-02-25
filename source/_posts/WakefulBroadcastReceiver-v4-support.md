title: 解决“WakefulBroadcastReceiver cannot be resolved to a type”问题
date: 2016-02-25 10:08:55
tags: [Android,SDK]
categories: 笔记
---

最近在接的韩国推广渠道IGAWorks LiveOps SDK在接收推送消息时闪退。

<!--more-->

## 问题

检查日志发现闪退原因是Receiver找不到父类：

    02-24 12:04:25.910: W/dalvikvm(10964): Unable to resolve superclass of Lcom/igaworks/liveops/pushservice/LiveOpsGCMBroadcastReceiver; (199)
    02-24 12:04:25.910: W/dalvikvm(10964): Link of class 'Lcom/igaworks/liveops/pushservice/LiveOpsGCMBroadcastReceiver;' failed

使用jd解jar包发现LiveOpsGCMBroadcastReceiver父类为

    android.support.v4.content.WakefulBroadcastReceiver

发现未引入v4-support库。

# 解决

使用Eclipse功能导入android support library：

* 右击项目->Android Tooles->Add Support Library，之后等待即可。

![导入](http://ww2.sinaimg.cn/mw690/a94a86cbgw1f1bdf8pxu0j20ih09lacd.jpg)

自动导入后的android-support-v4.jar位于libs文件夹，包含WakefulBroadcastReceiver

![class](http://ww1.sinaimg.cn/mw690/a94a86cbjw1f1bdjov7c6j209j08y0uq.jpg)