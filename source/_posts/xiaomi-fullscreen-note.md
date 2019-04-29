title: 小米 MIX 一次全屏问题解决笔记
date: 2019-04-29 11:40:30
tags: [Android, 小米]
categories: 笔记
---

# 问题描述

有玩家报告工地游戏在开启全面屏并隐藏虚拟键的小米 MIX 手机上无法全屏，表现为：

![screen](http://wx4.sinaimg.cn/mw690/a94a86cbly1g2jczie60xj20kt079gld.jpg '左边是出现黑边的情况，右边是期望的正常全屏显示状态。')

# 解决方法

在 设置->全面屏->应用全屏运行设置 里给应用开启全屏模式。

下边是折腾的过程，最后才发现是这个系统设置的问题，所以没有兴趣的可以跳过。

<!-- more -->

之前游戏是有专门做过全面屏适配的，正好自己也在用 MIX，试了一下确实右侧有黑边，开始查原因。

游戏是使用 quick-cocos 的老项目，启动时会打印系统信息。首先看log：

    D cocos2d-x debug info: [0.0293] [INFO] # CONFIG_SCREEN_AUTOSCALE      = function: 0xe50b0168
    D cocos2d-x debug info: [0.0294] [INFO] # CONFIG_SCREEN_WIDTH          = 1190.52
    D cocos2d-x debug info: [0.0294] [INFO] # CONFIG_SCREEN_HEIGHT         = 640.00
    D cocos2d-x debug info: [0.0295] [INFO] # display.widthInPixels        = 2009.00
    D cocos2d-x debug info: [0.0295] [INFO] # display.heightInPixels       = 1080.00
    D cocos2d-x debug info: [0.0295] [INFO] # display.contentScaleFactor   = 1.00
    D cocos2d-x debug info: [0.0296] [INFO] # display.width                = 1190.52
    D cocos2d-x debug info: [0.0296] [INFO] # display.height               = 640.00
    D cocos2d-x debug info: [0.0297] [INFO] # display.cx                   = 595.26
    D cocos2d-x debug info: [0.0297] [INFO] # display.cy                   = 320.00
    D cocos2d-x debug info: [0.0297] [INFO] # display.left                 = 0.00
    D cocos2d-x debug info: [0.0298] [INFO] # display.right                = 1190.52
    D cocos2d-x debug info: [0.0298] [INFO] # display.top                  = 640.00
    D cocos2d-x debug info: [0.0298] [INFO] # display.bottom               = 0.00
    D cocos2d-x debug info: [0.0299] [INFO] # display.c_left               = -595.26
    D cocos2d-x debug info: [0.0299] [INFO] # display.c_right              = 595.26
    D cocos2d-x debug info: [0.0300] [INFO] # display.c_top                = 320.00
    D cocos2d-x debug info: [0.0300] [INFO] # display.c_bottom             = -320.00

获取到的分辨率竟然是完全不知所谓的 2009x1080，而全面屏 MIX 分辨率应该是 2040x1080 才对。

检查应用设置的显示主题
`android:theme="@android:style/Theme.NoTitleBar.Fullscreen" `
这并没有问题。

循源码找到设置分辨率的地方 __/libcocos2dx/src/org/cocos2dx/lib/Cocos2dxGLSurfaceView.java__

```` java
	/*
	 * This function is called before Cocos2dxRenderer.nativeInit(), so the
	 * width and height is correct.
	 */
	@Override
	protected void onSizeChanged(final int pNewSurfaceWidth, final int pNewSurfaceHeight, final int pOldSurfaceWidth, final int pOldSurfaceHeight) {
		if(!this.isInEditMode()) {
			this.mCocos2dxRenderer.setScreenWidthAndHeight(pNewSurfaceWidth, pNewSurfaceHeight);
		}
	}

````

取到的 pNewSurfaceWidth, pNewSurfaceHeight 分别为 2009 * 1080
考虑到如果是分辨率适配的原因的话，黑边应该均匀地出现在屏幕两侧才对，所以判断并不是适配的问题，而是系统给游戏分配的显示区域确实只有左边这一块。
之后观察了下发现黑边位于屏幕圆角之前

![screen2](http://wx1.sinaimg.cn/mw690/a94a86cbgy1g2jdgfzwl8j20fi07zmwx.jpg '左侧正常，右侧圆角部分为黑边')

猜测可能和圆角设置有关，但是设置里并没有找到圆角大小的设定，反而在全面屏设置里找到了全屏开关……
之后开启全屏开关，回到游戏，已经正常全屏。

