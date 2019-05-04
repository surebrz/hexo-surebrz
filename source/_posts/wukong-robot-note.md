title: wukong-robot智能音箱折腾笔记
date: 2019-04-30 07:42:09
tags: [wukong-robot, 折腾]
categories: 笔记
---

周末尝试在自己的树莓派上安装了一下 [wukong-robot智能音箱](https://wukong.hahack.com/#/)，使用起来非常简单的智能音箱项目，记录一下安装和使用时用到的工具和踩的坑，留作之后扩展编码使用。

<!-- more  -->

## 笔记和工具

### 模型训练

> snowboy 官方建议在树莓派上先用 rec t.wav 这样的命令录制唤醒词，然后在训练的时候通过上传按钮上传到服务器中进行训练

- 录音命令

    ```
    arecord -D "plughw:1,0" -d 5 test.wav
    ```
    其中 plughw:1,0 指第一个usb麦克风

## 安装时踩的坑

### pyaudio

一开始使用了自带的 pyaudio，后来折腾其他东西时可能把其他依赖库降级了，录音出问题无法唤醒，重装时报错。

解决：

** 如果你使用了virtualenv，一般会发现pyaudio安装失败。这种情况下你需要安装APT中的PortAudio开发头文件，然后安装PyAudio **：
	
	```
	sudo apt-get install portaudio19-dev
	pip install pyaudio
	```
	
解决方案来自 [这篇文章](https://segmentfault.com/a/1190000013854294)
	
### libatlas-base-dev

首先更换了软件源 (可用列表见[这里](http://www.raspbian.org/RaspbianMirrors))

```
pi@raspberrypi:~ $ sudo nano /etc/apt/sources.list
```

将内容改为：

```
deb http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie main contrib non-free rpi
deb-src http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie main contrib non-free rpi
```

执行

```
sudo apt-get update
sudo apt-get upgrade
```

之后安装 libatlas-base-dev 时出现问题:

    pi@raspberrypi:~ $ sudo apt-get install -y libatlas-base-dev
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树
    正在读取状态信息... 完成
    有一些软件包无法被安装。如果您用的是 unstable 发行版，这也许是
    因为系统无法达到您要求的状态造成的。该版本中可能会有一些您需要的软件
    包尚未被创建或是它们已被从新到(Incoming)目录移出。
    下列信息可能会对解决问题有所帮助：

    下列软件包有未满足的依赖关系：
    libatlas-base-dev : 依赖: **libatlas-dev** 但是它将不会被安装
    E: 无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系

根据提示尝试依次手动安装依赖：

1.
    pi@raspberrypi:~ $ sudo apt-get install libatlas-dev
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树
    正在读取状态信息... 完成
    有一些软件包无法被安装。如果您用的是 unstable 发行版，这也许是
    因为系统无法达到您要求的状态造成的。该版本中可能会有一些您需要的软件
    包尚未被创建或是它们已被从新到(Incoming)目录移出。
    下列信息可能会对解决问题有所帮助：

    下列软件包有未满足的依赖关系：
    libatlas-dev : 依赖: **libblas-dev** 但是它将不会被安装
    E: 无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系。

2.
    pi@raspberrypi:~ $ sudo apt-get install libblas-dev
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树
    正在读取状态信息... 完成
    有一些软件包无法被安装。如果您用的是 unstable 发行版，这也许是
    因为系统无法达到您要求的状态造成的。该版本中可能会有一些您需要的软件
    包尚未被创建或是它们已被从新到(Incoming)目录移出。
    下列信息可能会对解决问题有所帮助：

    下列软件包有未满足的依赖关系：
    libblas-dev : 依赖: libblas3 **(= 1.2.20110419-10)** 但是 3.7.0-2 正要被安装
    E: 无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系。

3.
    pi@raspberrypi:~ $ sudo apt-get install libblas3=1.2.20110419-10
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树
    正在读取状态信息... 完成
    下列软件包将被【降级】：
    libblas3
    升级了 0 个软件包，新安装了 0 个软件包，降级了 1 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。
    需要下载 120 kB 的归档。
    解压缩后会消耗 76.8 kB 的额外空间。
    您希望继续执行吗？ [Y/n] y
    获取:1 http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie/main armhf libblas3 armhf 1.2.20110419-10 [120 kB]
    已下载 120 kB，耗时 0秒 (256 kB/s)
    dpkg: 警告: 即将把 libblas3 从 3.7.0-2 降级到 1.2.20110419-10
    (正在读取数据库 ... 系统当前共安装有 134025 个文件和目录。)
    正准备解包 .../libblas3_1.2.20110419-10_armhf.deb  ...
    正在将 libblas3 (1.2.20110419-10) 解包到 (3.7.0-2) 上 ...
    正在设置 libblas3 (1.2.20110419-10) ...
    update-alternatives: 链接组 libblas.so.3 已更改次要链接，故更新候选项 /usr/lib/libblas/libblas.so.3

之后重新安装 libatlas-base-dev

    pi@raspberrypi:~ $ sudo apt-get install -y libatlas-base-dev
    正在读取软件包列表... 完成
    正在分析软件包的依赖关系树
    正在读取状态信息... 完成
    将会同时安装下列软件：
    libatlas-dev libatlas3-base libblas-dev
    建议安装：
    libblas-doc liblapack-doc liblapack-dev
    下列【新】软件包将被安装：
    libatlas-base-dev libatlas-dev libatlas3-base libblas-dev
    升级了 0 个软件包，新安装了 4 个软件包，要卸载 0 个软件包，有 0 个软件包未被升级。
    需要下载 4,485 kB 的归档。
    解压缩后会消耗 29.7 MB 的额外空间。
    获取:1 http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie/main armhf libatlas3-base armhf 3.10.2-7+rpi1 [1,841 kB]
    获取:2 http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie/main armhf libblas-dev armhf 1.2.20110419-10 [117 kB]
    获取:3 http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie/main armhf libatlas-dev all 3.10.2-7+rpi1 [65.0 kB]
    获取:4 http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie/main armhf libatlas-base-dev armhf 3.10.2-7+rpi1 [2,462 kB]
    已下载 4,485 kB，耗时 3秒 (1,343 kB/s)
    正在选中未选择的软件包 libatlas3-base。
    (正在读取数据库 ... 系统当前共安装有 134027 个文件和目录。)
    正准备解包 .../libatlas3-base_3.10.2-7+rpi1_armhf.deb  ...
    正在解包 libatlas3-base (3.10.2-7+rpi1) ...
    正在选中未选择的软件包 libblas-dev。
    正准备解包 .../libblas-dev_1.2.20110419-10_armhf.deb  ...
    正在解包 libblas-dev (1.2.20110419-10) ...
    正在选中未选择的软件包 libatlas-dev。
    正准备解包 .../libatlas-dev_3.10.2-7+rpi1_all.deb  ...
    正在解包 libatlas-dev (3.10.2-7+rpi1) ...
    正在选中未选择的软件包 libatlas-base-dev。
    正准备解包 .../libatlas-base-dev_3.10.2-7+rpi1_armhf.deb  ...
    正在解包 libatlas-base-dev (3.10.2-7+rpi1) ...
    正在设置 libatlas3-base (3.10.2-7+rpi1) ...
    update-alternatives: 使用 /usr/lib/atlas-base/atlas/libblas.so.3 来在自动模式中提供 /usr/lib/libblas.so.3 (libblas.so.3)
    update-alternatives: 使用 /usr/lib/atlas-base/atlas/liblapack.so.3 来在自动模式中提供 /usr/lib/liblapack.so.3 (liblapack.so.3)
    正在设置 libblas-dev (1.2.20110419-10) ...
    update-alternatives: 使用 /usr/lib/libblas/libblas.so 来在自动模式中提供 /usr/lib/libblas.so (libblas.so)
    正在设置 libatlas-dev (3.10.2-7+rpi1) ...
    正在设置 libatlas-base-dev (3.10.2-7+rpi1) ...
    update-alternatives: 使用 /usr/lib/atlas-base/atlas/libblas.so 来在自动模式中提供 /usr/lib/libblas.so (libblas.so)
    update-alternatives: 使用 /usr/lib/atlas-base/atlas/liblapack.so 来在自动模式中提供 /usr/lib/liblapack.so (liblapack.so)

解决。

## 运行时踩的坑

- 重复询问

我使用的版本__1.6.6__有无限循环 “抱歉，刚刚没听清，能再说一遍吗？” 的问题，简单修改代码减少重试次数，期待有官方修复。

Conversation.py

将

```
    def pardon(self):
        self.say("抱歉，刚刚没听清，能再说一遍吗？", onCompleted=lambda: self.doResponse(self.activeListen()))
```

改为

```
    def pardon(self):
        self.pardonTimes || = 0
        self.pardonTimes += 1
        if self.pardonTimes > 1:
            self.pardonTimes = 0
            return
        self.say("抱歉，刚刚没听清，能再说一遍吗？", onCompleted=lambda: self.doResponse(self.activeListen()))
```

修改 doResponse :

```
def doResponse(self, query, UUID='', onSay=None):
        statistic.report(1)
        self.interrupt()

        if onSay:
            self.onSay = onSay

        if isnull(query):
            self.pardon()
            return

        if query.strip() == '':
            return
            
        self.appendHistory(0, query, UUID)

        lastImmersiveMode = self.immersiveMode

        if not self.brain.query(query):
            # 没命中技能，使用机器人回复
            msg = self.ai.chat(query)
            self.say(msg, True, onCompleted=self.checkRestore)
        else:
            if lastImmersiveMode is not None and lastImmersiveMode != self.matchPlugin:
                time.sleep(1)
                if self.player is not None and self.player.is_playing():
                    logger.debug('等说完再checkRestore')
                    self.player.appendOnCompleted(lambda: self.checkRestore())
                else:
                    logger.debug('checkRestore')
                    self.checkRestore()
```