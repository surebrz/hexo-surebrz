title: 使用web端来控制我的树莓派播放音乐
date: 2015-09-03 09:25:07
tags: [nodejs,php]
categories: 折腾
---

web端控制树莓派播放音乐，PHP+NodeJS+mpg123，粗糙版。实现后还可以做个app什么的。

<!--more-->

## 代码

### git

__用到的代码内容可以在[这里](https://github.com/surevision/node_mpg123_pi)看~__

### nodempg.js

* 启动一个server，负责实际播放

### call_node.php

* curl访问nodempg.js

### xmu.php

* 内个啥掉虾米的实际地址并播放（地址解析有bug，不过就这样吧……）

## 效果

### web端

![web端](http://ww4.sinaimg.cn/large/0060lm7Tgw1f01hk9f33sj30pb0q4jwp.jpg)

### node端

![node端](http://ww4.sinaimg.cn/large/0060lm7Tgw1f01hpe4yyyj30pg0dxagf.jpg)

### PI端

唔，你们听不到。

## 一些笔记


### php环境

* php环境的安装看[这里](http://www.linuxde.net/2013/08/15041.html)

* [安装curl扩展](http://www.cnblogs.com/misoag/archive/2013/02/05/2892712.html)

### nodejs-pi环境

* 编译好的nodejs在[这里](https://nodejs.org/dist/v0.10.1/)的[这个](https://nodejs.org/dist/v0.10.1/node-v0.10.1-linux-arm-pi.tar.gz)

* 环境变量配置

        echo "PATH=$PATH:/usr/local/node/bin" >> /etc/profile
        echo "export PATH" >> /etc/profile
        source /etc/profile
        node -v


### screen命令

* screen -S yourname -> 新建一个叫yourname的session
* screen -ls（或者screen -list） -> 列出当前所有的session
* screen -r yourname -> 回到yourname这个session
* screen -d yourname -> 远程detach某个session
* screen -d -r yourname -> 结束当前session并回到yourname这个session

   -m   causes screen  to  ignore  the  $STY  environment  variable.  With
        "screen  -m"  creation  of  a  new session is enforced, regardless
        whether screen is called from within  another  screen  session  or
        not.  This  flag has a special meaning in connection with the `-d'
        option:

   -d -m   Start screen in "detached" mode. This creates a new session but
           doesn't  attach  to  it.  This  is  useful  for  system startup
           scripts.

### mpg123命令

* 播放列表

    mpg123 --list list.lst  

* 循环单曲播放 

        mpg123 --loop -1 songname.mp3

	* -1(<0)的数表示无限循环，也可以指定确定的次数。只能是单首循环。 
	* 这个--loop 参数如果用来播放List（文件）中的歌曲时
	* 是不能够达到重头到尾的重复播放的效果的，只是循环第一首。

* 随机循环播放列表

    mpg123 --list list.lst -Z

### php端调用

* 执行shell(_(:3ゝ∠)_不能用)

        string exec (string command [, string array [, int return_var]])

### node端调用
* 执行shell:

		process.execFile('D:/testweb/aaa.bat',null,{cwd:'D:/'},
		      function (error,stdout,stderr) {
		        if (error !== null) {
		          console.log('exec error: ' + error);
		        }
		});


参考自：

[mpg123 听音乐][1]
[node.js执行shell命令][2]
[Screen会话命令 Linux][3]

[1]:http://blog.csdn.net/changfengxiongfei/article/details/5451027
[2]:http://my.oschina.net/u/252343/blog/185998
[3]:http://www.cnblogs.com/ywl925/p/3604530.html