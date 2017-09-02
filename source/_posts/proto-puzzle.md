title: proto折腾
date: 2017-04-04 11:10:48
categories: 笔记
tags: [折腾,protobuf]
---

<!-- more -->

# protoc-gen-lua

- 安装 [proto-python](https://github.com/google/protobuf/releases)

- 安装 [setuptools](https://packaging.python.org/en/latest/installing.html#setup-for-installing-packages
)
	- 下载[get-pip.py](get-pip.py)
    - 然后 `python get-pip.py`
    - 或者直接 `python -m pip install -U pip setuptools`
    - 编译好的 `protoc.exe` 需要放到 `protobuf-python-3.2.0\protobuf-3.2.0\src` 下

- 下载 [protoc-gen-lua](https://github.com/sean-lin/protoc-gen-lua)

- genlua命令：
    `>protoc.exe --lua_out=lua --plugin=protoc-gen-lua="绝对路径\plugin\protoc-gen-lua.bat" xxxx.proto`

- 转码，有些proto文件是gbk

````
require "find"
Find.find("."){|file|
	next unless File.extname(file) == ".proto"
	break_to_next = false
	f = File.open(file, "r")
	line = []
	f.each_line{|l|
		from = l.dup.encode("utf-8","gbk") rescue break_to_next = true;break
		to = from.encode("gbk","utf-8")
		line << to
	}
	f.close
	next if break_to_next
	f = File.open(file, "wb")
	line.each{|l|
		f.puts l
	}
	f.close
}
````

# 项目相关

- 使用 *.proto 通配符时用bash命令行执行（git-bash）

- 改脚本
    
   原 

    `../tools/protoc.exe --cpp_out=. *.proto -I=../ProtoMessage/;./`

    -I后2路径改成两次-I 、

    `../tools/protoc.exe --cpp_out=. *.proto -I=../ProtoMessage/ -I./`

- 给subevent.proto增加import（121~185）

----

# 然而还没搞完

