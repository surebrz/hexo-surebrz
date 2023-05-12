title: npm install 报 Refusing to delete xxx 问题处理
date: 2023-05-12 08:32:06
tags: [nodejs]
categories: 笔记
---

**问题**

在配置工地项目环境时，执行 `npm install` 初始化时，报错： `Refusing to delete xxx`

```
3621 verbose stack Error: Refusing to delete E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\generator\node_modules\.bin\jsesc.ps1: ../../../../_jsesc@2.5.2@jsesc/bin/jsesc symlink target is not controlled by npm E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\generator\node_modules\jsesc
43621 verbose stack     at clobberFail (D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:121:12)
43621 verbose stack     at isSafeToRm (D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:111:15)
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:54:5
43621 verbose stack     at LOOP (D:\nodejs_12.22.12\node_modules\npm\node_modules\slide\lib\chain.js:7:26)
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\slide\lib\chain.js:18:7
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:138:14
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
43621 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
43621 verbose stack     at callback (D:\nodejs_12.22.12\node_modules\npm\node_modules\graceful-fs\polyfills.js:295:20)
43621 verbose stack     at FSReqCallback.oncomplete (fs.js:168:21)
```

```
46159 verbose stack Error: Refusing to delete E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\.bin\parser.ps1: ../../../../_@babel_parser@7.21.8@@babel/parser/bin/babel-parser.js symlink target is not controlled by npm E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\parser
46159 verbose stack     at clobberFail (D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:121:12)
46159 verbose stack     at isSafeToRm (D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:111:15)
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:54:5
46159 verbose stack     at LOOP (D:\nodejs_12.22.12\node_modules\npm\node_modules\slide\lib\chain.js:7:26)
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\slide\lib\chain.js:18:7
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\lib\rm.js:138:14
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
46159 verbose stack     at D:\nodejs_12.22.12\node_modules\npm\node_modules\gentle-fs\node_modules\iferr\index.js:11:16
46159 verbose stack     at callback (D:\nodejs_12.22.12\node_modules\npm\node_modules\graceful-fs\polyfills.js:295:20)
46159 verbose stack     at FSReqCallback.oncomplete (fs.js:168:21)
```

**解决**
经过反复更换 node、npm 版本无果，删除 package-lock.json 无效，删除 .npmrc 无效后，尝试根据报错删除对应文件，如

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\generator\node_modules\.bin\jsesc.ps1

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\generator\node_modules\.bin\jsesc.cmd

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\@babel\generator\node_modules\.bin\jsesc

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\.bin\parser.ps1

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\.bin\parser.cmd

    E:\git\xxx\node_modules\_babel-eslint@10.1.0@babel-eslint\node_modules\@babel\traverse\node_modules\.bin\parser

后，再次执行 `npm install` 不再报错，安装成功。