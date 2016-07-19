title: vsftpd安装笔记
date: 2016-07-19 17:26:49
tags: [linux,vsftpd]
categories: 笔记
---

vsftpd安装笔记，照例只写过程，非教程。
<!--more-->

# 前提

php使用lnmp一键安装脚本安装，web目录位于

    /home/wwwroot/

站点目录位于

    /home/wwwroot/www.domain.com/

# 过程

## 创建ftp用户

    sudo useradd -d /home/wwwroot/www.domain.com/ -s /sbin/nologin ftpuser

*此步有问题，改为使用*

    /home/wwwroot/

*为用户主目录。*

## 安装vsftpd

    sudo apt-get install vsftpd

## 配置vsftpd

    screen vim /etc/vsftpd.conf

### 允许本地用户

    local_enable=YES

### 允许写

    write_enable=YES

### 设置写文件默认权限

    local_umask=775

这步很蠢的出错，umask为禁止的权限，改为

    local_umask=022

### 设置默认进入用户主目录

    chroot_local_user=NO
    chroot_list_enable=YES
    chroot_list_file=/etc/vsftpd.chroot_list

修改 *chroot_list_file=/etc/vsftpd.chroot_list* 文件，加入 *ftpuser* 。文件格式为用户名列表，一行一个用户名

# 测试

## 使用ftpuser登录

- 报错

        530 Login incorrect

- 解决

将 */etc/vsftpd.conf* 中

        pam_service_name=vsftpd

改为

        pam_service_name=ftp

原因不知。

## 写文件

- 报错

        550 create directory operation failed

- 解决

1. 修改用户主目录为/home/wwwroot/

        usermod -d /home/wwwroot/ ftpuser

2. 给/home/wwwroot/www.domain.com/目录写权限

        chmod +w /home/wwwroot/www.domain.com/

    *※给wwwroot写权限会报错*

        vsftpd: refusing to run with writable root inside chroot()
        
    *所以不能将ftpuser主目录直接设置到domain路径*

3. 修改umask

        local_umask=022
    