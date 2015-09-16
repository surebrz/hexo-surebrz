title: 准备一个node端来控制我的树莓派播放音乐
date: 2015-09-03 09:25:07
tags: nodejs
categories: 折腾
---

# 先用这里记录下需要的东西：

## screen命令
* screen -S yourname -> 新建一个叫yourname的session
* screen -ls（或者screen -list） -> 列出当前所有的session
* screen -r yourname -> 回到yourname这个session
* screen -d yourname -> 远程detach某个session
* screen -d -r yourname -> 结束当前session并回到yourname这个session

## mpg123命令
* 播放列表
mpg123 --list list.lst  
* 循环单曲播放 
mpg123 --loop -1 songname.mp3
	* -1(<0)的数表示无限循环，也可以指定确定的次数。只能是单首循环。 
	* 这个--loop 参数如果用来播放List（文件）中的歌曲时
	* 是不能够达到重头到尾的重复播放的效果的，只是循环第一首。
* 随机循环播放列表
mpg123 --list list.lst -Z

## node端调用
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