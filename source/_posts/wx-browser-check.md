title: 检查是否处于微信浏览器内
date: 2018-08-16 13:17:56
tags: [javascript]
categories: JavaScript
---

简单判断userAgent

```javascript
function isInWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
    return false
}
```