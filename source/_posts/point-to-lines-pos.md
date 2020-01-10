title: 点到线段的最短位置
date: 2020-01-10 21:23:58
tags: [JavaScript, 算法]
categories: JavaScript
---

# 效果

计算点到线段的最短位置，效果如下：

<div style="text-align:center;background-color:#1e576b">
    <canvas id="point_to_lines_pos_canvas"></canvas>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
	/**
	* 定义向量
	*/
	var Vec2 = function(x, y) {
		this.x = x;
		this.y = y;
	};
	Vec2.prototype.add = function(vector, out) {
        out = out || new Vec2();
        out.x = this.x + vector.x;
        out.y = this.y + vector.y;
        return out;
	};
	
    Vec2.prototype.sub = function (vector, out) {
        out = out || new Vec2();
        out.x = this.x - vector.x;
        out.y = this.y - vector.y;
        return out;
    };
	
	Vec2.prototype.magSqr = function () {
		return this.x * this.x + this.y * this.y;
	};
	
	Vec2.prototype.mul = function (num, out) {
		out = out || new Vec2();
		out.x = this.x * num;
		out.y = this.y * num;
		return out;
	};
	
	Vec2.prototype.dot = function (vector) {
		return this.x * vector.x + this.y * vector.y;
	};
	
	Vec2.prototype.project = function (vector) {
		return vector.mul(this.dot(vector) / vector.dot(vector));
	};
	
	/**
     * 计算点到直线距离最短的点（垂足或离点最近的两端点）
     * @param {*} x 
     * @param {*} y 
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} x2 
     * @param {*} y2 
     */
    function calcShortestPoint(x, y, x1, y1, x2, y2) {
        var op = new Vec2(x, y);
        var op1 = new Vec2(x1, y1);
        var op2 = new Vec2(x2, y2);

        // 做垂足
        var p1p2 = op2.sub(op1);
        var p1p = op.sub(op1);
        var p2p = op.sub(op2);
        var proj_pp2_p1p2 = p2p.project(p1p2);
        var ot = op2.add(proj_pp2_p1p2);    // t的坐标
		// 计算距离
        var pt = op.sub(ot);
		var tp1 = op1.sub(ot);
		var tp2 = op2.sub(ot);
		var len2_pp1 = p1p.magSqr();
		var len2_pp2 = p2p.magSqr();
		var len2_pt = pt.magSqr();
		var pos = [op1, op2, ot][[len2_pp1, len2_pp2, len2_pt].indexOf(Math.min(len2_pp1, len2_pp2, len2_pt))];
        // 判断垂足点在线段内
		if (tp1.magSqr() + tp2.magSqr() - p1p2.magSqr() > 0) {
			pos = [op1, op2][[len2_pp1, len2_pp2].indexOf(Math.min(len2_pp1, len2_pp2))];
		}
        return pos;
    }
	var positions = null;
	var lastPos = null;
    function draw(fillWidth, fillHeight) {
        var canvas = document.getElementById('point_to_lines_pos_canvas');
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0, 0, fillWidth, fillHeight);
		ctx.strokeStyle="#FFFFFF";
		ctx.strokeRect(0, 0, fillWidth, fillHeight);
		var center = new Vec2(fillWidth / 2, fillHeight / 2);
		var shortest = 1/0;
		positions = positions || [new Vec2(Math.random() * fillWidth, Math.random() * fillHeight), new Vec2(Math.random() * fillWidth, Math.random() * fillHeight)];
		if (positions.length >= 2) {
			for (var i = 0; i < positions.length - 1; i += 1) {
				var p1 = positions[i];
				var p2 = positions[i + 1];
				var calcP = calcShortestPoint(center.x, center.y, p1.x, p1.y, p2.x, p2.y);
				var center_calcP = center.sub(calcP);
				if (shortest > center_calcP.magSqr()) {
					lastPos = calcP;
					shortest = center_calcP.magSqr();
				}
				ctx.beginPath();
				ctx.strokeStyle="#FFFFFF";
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
				ctx.strokeStyle="#00FF00";
				ctx.strokeRect(center.x, center.y, 1, 1);
				ctx.strokeStyle="#0000FF";
				ctx.strokeRect(p1.x, p1.y, 1, 1);
				ctx.strokeRect(p2.x, p2.y, 1, 1);
			}
			ctx.beginPath();
			ctx.strokeStyle="#FFFFFF";
			ctx.moveTo(center.x, center.y);
			ctx.lineTo(lastPos.x, lastPos.y);
			ctx.stroke();
		} else if (positions.length > 0) {
			ctx.strokeStyle="#0000FF";
			ctx.strokeRect(positions[0].x, positions[0].y, 1, 1);
			ctx.strokeStyle="#00FF00";
			ctx.strokeRect(center.x, center.y, 1, 1);
		}
    }
    $(document).ready(function() {
        var w = 17;
        var h = 17;
        var border = 24;
        var fillWidth = border * w;
        var fillHeight = border * h;
        $("#point_to_lines_pos_canvas").attr("height", fillHeight + "px");
        $("#point_to_lines_pos_canvas").attr("width", fillWidth + "px");
		$("#point_to_lines_pos_canvas").click(function(event) {
			positions.push(new Vec2(event.offsetX, event.offsetY));
			draw(fillWidth, fillHeight);
		});
		draw(fillWidth, fillHeight);
    });
 
</script>

# 代码

```JavaScript
	/**
	* 定义向量
	*/
	var Vec2 = function(x, y) {
		this.x = x;
		this.y = y;
	};
	Vec2.prototype.add = function(vector, out) {
        out = out || new Vec2();
        out.x = this.x + vector.x;
        out.y = this.y + vector.y;
        return out;
	};
	
    Vec2.prototype.sub = function (vector, out) {
        out = out || new Vec2();
        out.x = this.x - vector.x;
        out.y = this.y - vector.y;
        return out;
    };
	
	Vec2.prototype.magSqr = function () {
		return this.x * this.x + this.y * this.y;
	};
	
	Vec2.prototype.mul = function (num, out) {
		out = out || new Vec2();
		out.x = this.x * num;
		out.y = this.y * num;
		return out;
	};
	
	Vec2.prototype.dot = function (vector) {
		return this.x * vector.x + this.y * vector.y;
	};
	
	Vec2.prototype.project = function (vector) {
		return vector.mul(this.dot(vector) / vector.dot(vector));
	};
	
	/**
     * 计算点到直线距离最短的点（垂足或离点最近的两端点）
     * @param {*} x 
     * @param {*} y 
     * @param {*} x1 
     * @param {*} y1 
     * @param {*} x2 
     * @param {*} y2 
     */
    function calcShortestPoint(x, y, x1, y1, x2, y2) {
        var op = new Vec2(x, y);
        var op1 = new Vec2(x1, y1);
        var op2 = new Vec2(x2, y2);

        // 做垂足
        var p1p2 = op2.sub(op1);
        var p1p = op.sub(op1);
        var p2p = op.sub(op2);
        var proj_pp2_p1p2 = p2p.project(p1p2);
        var ot = op2.add(proj_pp2_p1p2);    // t的坐标
		// 计算距离
        var pt = op.sub(ot);
		var tp1 = op1.sub(ot);
		var tp2 = op2.sub(ot);
		var len2_pp1 = p1p.magSqr();
		var len2_pp2 = p2p.magSqr();
		var len2_pt = pt.magSqr();
		var pos = [op1, op2, ot][[len2_pp1, len2_pp2, len2_pt].indexOf(Math.min(len2_pp1, len2_pp2, len2_pt))];
        // 判断垂足点在线段内
		if (tp1.magSqr() + tp2.magSqr() - p1p2.magSqr() > 0) {
			pos = [op1, op2][[len2_pp1, len2_pp2].indexOf(Math.min(len2_pp1, len2_pp2))];
		}
        return pos;
    }
```
# 算法解析
<!-- more -->

点到直线的最短距离为**点到直线的垂线段的长度**，所以点到直线的最短位置即为**垂足的位置**。

所以，当垂足在线段内时，垂足即为所求的点，否则为线段两端点中距离最近的点，问题转化为求垂足的位置。

使用解析式求垂足计算量巨大，这里采用向量运算求解。

## 求垂足

![pic](http://www.surebrz.com/origin/imgs/p-t-l-1.png)

如图，已知点 P 和线段 p1p2 可知，垂足 T 的坐标即为向量 **P1P** 在向量 **P1P2** 上**投影**的点的坐标。

## 判断点是否在线段内

由于已知 p1、t、p2共线，故当线段 p1t 长度 + 线段 tp2 长度大于线段 p1p2 长度时，点 T 不在线段内。