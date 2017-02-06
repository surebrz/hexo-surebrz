title: docker实、实验报告......
date: 2017-02-06 11:50:42
tags: [docker]
categories: 笔记
---

TAT以下是折腾docker折腾quick-server0.4.0的经历，而非过程
<!--more-->
--
 
查看镜像:

    docker@boot2docker:~$ docker images
 
运行镜像并进到bash模式，映射8080端口到宿主50002端口:

    docker@boot2docker:~$ docker run -t -i -p 50002:8080 chukong/quick-server:0.4.0
 
关闭镜像并保存:

记下当前id: |root@ID| ←

    |root@ID| exit
    docker@boot2docker:~$ docker commit ID chukong/quick-server:0.4.0
 
开启ssh后台运行镜像:

    docker@boot2docker:~$ docker run -d -p 50003:22 chukong/quick-server:0.4.0 /usr/sbin/sshd -D
 
创建用户sure52:

    |root@ID| useradd sure52
    |root@ID| passwd sure52
 
建立git仓库:

    |root@ID| cd /home/sure52
    |root@ID| mkdir qs_code
    |root@ID| chmod o+w -R qs_code
    |root@ID| cd qs_code
    |root@ID| git init
    |root@ID| vim README.md
    |root@ID| git add "."
    |root@ID| git commit -m "base version"
    
    |root@ID| git remote add origin ssh://sure52@127.0.0.1/home/sure52/qs_code/.git
    |root@ID| git push origin
    |root@ID| git remote show origin
 
测试git仓库

    E:\> git clone ssh://sure52@192.168.59.103:50003/home/sure52/qs_code/.git
 
*push 无写权限remote: fatal: failed to write object解决:*

    |root@ID| chmod -R 777 .git
 
*push master -> master (branch is currently checked out)出错解决:*

    |root@ID| cd .git
    |root@ID| vi config
    
    添加：    
       [receive]
       denyCurrentBranch = ignore
 
Quick-Server取session_id:

    curl "http://192.168.59.103:50002/_server/user/session/?id=sure52"
 
提交usercode:

    本地路径结构：
    module1/actions/SayHello.lua
    提交至
    /home/sure52/qs_code/module1/actions/Sayhello.lua
    实际运行时
    /opt/qs/openresty/server/user_codes/module1/actions/SayHello.lua
    config.lua配置:

    userDefinedCodes = {
        luaRepoPrefix = "server.user_codes",
        localRepo  = "/home/sure52/qs_code/",
        localDest  = "/opt/qs/openresty/server/user_codes",
        --localRepo = "/home/cheeray/work/user_codes",
        --localDest = "/home/cheeray/work/quick-server/src/server/user_codes",
        uriPrefix  = {
            module1 = "http_test1",
            module2 = "http_test2",
        },
    },

    运行命令：
    curl "http://192.168.59.103:50002/_Server/user/uploadcodes?    commit=f54ab5e0ddd0d93b55ae4f9169c25caf52a88392&session_id=f56b3cb7fc96dfb25e501c56e8f9b057"
 
sayHello: 

    curl "http://192.168.59.103:50002/http_test1/Say/SayHello?session_id=f56b3cb7fc96dfb25e501c56e8f9b057&name=a_name"
 
因为用的是坑爹windows……
让本机localhost:8088能直接连到容器内：（windows 127.0.0.1:8088->docker虚拟机192.168.59.103:50002->容器内x.x.x.x:8088）

    在virtual box中做本机端口映射
        VM -> 设置 -> 网络 -> 网卡1 -> 端口转发 添加
        名称任意 协议:TCP 主机IP:127.0.0.1 主机端口:8088 子系统IP不填 子系统端口:50002

参考：
    http://www.cnblogs.com/bjfuouyang/p/3798421.html
