title: Cocos DrawNode绘制实心圆
date: 2017-12-23 11:36:10
tags: [javascript,cocos2dx]
categories: 成品
---

原 cc.DrawNode 的 *drawCircle* 方法绘制的是空心圆，而 *drawDot* 方法绘制的是指定 radius 的矩形，这里扩展 cc.DrawNode ，绘制实心圆。

# 环境

- Cocos Creator 1.7.0 release

# 脚本

```javascript
(function() {
    // 扩展cc.DrawNode
    var cc_DrawNode = cc.DrawNode;
    /**
     * 绘制实心圆
     */
    cc_DrawNode.prototype.drawSolidCircle = function(center, r, color) {
        // 利用cc.Mask类型为ellipse的算法
        var radius = {
            x: r,
            y: r
        };
        var segements = 64;
        var polies =[];
        var anglePerStep = Math.PI * 2 / segements;
        for(var step = 0; step < segements; ++ step) {
            polies.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x,
                radius.y * Math.sin(anglePerStep * step) + center.y));
        }
        this.drawPoly(polies, color, 0, color);
    };
})();
```

算法本身是绘制 segement 边的实心多边形，故 segement 越大，越接近圆。

# 使用方法

1. 保存为js文件
2. 在 Creator 编辑器中将脚本导入为插件