title: 一次常规apk逆向
date: 2022-10-01 22:25:23
tags: [crack]
categories: 黑科技
---

## Apktool 解包打包

1. 下载最新版 [apktool.jar](https://bitbucket.org/iBotPeaches/apktool/downloads/) 和 [apktool.bat](https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/windows/apktool.bat)

    > [Installation for Apktool](https://ibotpeaches.github.io/Apktool/install/)

2. 将 apk(以`base.apk`为例) 与 apktool.jar 和 apktool.bat 放在同一目录

3. 解包

    ```shell
    apktool.bat d base.apk
    ```

    生成 `base` 文件夹

4. 修改文件

5. 打包

    ```shell
    apktool.bat b base
    ```

    在 ./base/dist 中找到 `base.apk`

## 使用 SignApk 重新签名

1. 生成 keystore 签名文件

    ```shell
    keytool -genkey -alias 别名 -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
    ```

2. 将 keystore 文件转换为 pk8 和 x509.pem 此部分参考[这里](https://www.jianshu.com/p/3bd5c68cc44d)

    1. 生成 pk12 文件

        ```shell
        keytool -importkeystore -srckeystore test.keystore -destkeystore tmp.p12 -srcstoretype JKS -deststoretype PKCS12
        ```

    2. 生成 rsa.pem

        ```shell
        openssl pkcs12 -in tmp.p12 -nodes -out tmp.rsa.pem 
        ```

    3. 复制 `BEGIN CERTIFICATE`、`END CERTIFICATE` 部分（包含这两行）到新文件 `cert.x509.pem`，即是我们最后需要的 x509.pem 证书文件

    4. 生成 pk8 文件

        ```shell
        openssl pkcs8 -topk8 -outform DER -in tmp.rsa.pem -inform PEM -out private.pk8 -nocrypt
        ```

3. 下载 [SignApk](http://www.top139.com/AndroidTools.html)，将 `base.apk` 放入 `signapk` 目录

4. 签名

    ```shell
    java -jar signapk.jar cert.x509.pem private.pk8 base.apk new.apk
    ```




