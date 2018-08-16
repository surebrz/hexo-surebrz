title: 简单像素脸图
date: 2017-02-06 14:16:45
tags: [javascript,html]
categories: HTML
---

利用对称的随机点形成脸图/o\

<div style="text-align:center;background-color:#1e576b;width:100%;height:400px;">
    <div>
        <input type="text" id="dim_face" placeholder="dim"/>
        <input type="button" id="submit_face" value="submit"/>
    </div>
    <div style="margin:1em"><canvas id="faceCanvas"></canvas></div>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
    function drawFace(w, h) {
         
        var w = w || 8;
        var h = h || 8;
        var border = 12;
        var val = [];
        for (var i = 0; i < h; i += 1) {
            var str = [];
            for (var j = 0; j < w / 2; j += 1) {
                var rand = parseInt(Math.random() * 2);
                str[j] = rand;
                str[w - j] = rand;
            }
            val.push(str.join(""));
            console.log(str.join(""));
        }
         
        var canvas=document.getElementById('faceCanvas');
        var fillWidth = border * w;
        var fillHeight = border * h;
        $(canvas).attr("height", fillHeight + "px");
        $(canvas).attr("width", fillWidth + "px");
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0, 0, fillWidth, fillHeight);
        for (var y = 0; y < h; y += 1) {
            for (var x = 0; x < w; x += 1) {
                ctx.fillStyle= val[y][x] == "1" ? '#000' : '#FFF';
                console.log("x y v, %d %d %s", x, y, val[y][x]);
                ctx.fillRect(x * border, y * border, border, border);
            }
        }
    }
    $(document).ready(function() {
        drawFace();
        $("#submit_face").click(function(){
            var d = $("#dim_face").val();
            drawFace(d, d);
        });
    });
 
</script>

<!--more-->

代码：

```html

<div style="text-align:center;background-color:#1e576b;width:100%;height:400px;">
    <div>
        <input type="text" id="dim_face" placeholder="dim"/>
        <input type="button" id="submit_face" value="submit"/>
    </div>
    <div style="margin:1em"><canvas id="faceCanvas"></canvas></div>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
    function drawFace(w, h) {
         
        var w = w || 8;
        var h = h || 8;
        var border = 12;
        var val = [];
        for (var i = 0; i < h; i += 1) {
            var str = [];
            for (var j = 0; j < w / 2; j += 1) {
                var rand = parseInt(Math.random() * 2);
                str[j] = rand;
                str[w - j] = rand;
            }
            val.push(str.join(""));
            console.log(str.join(""));
        }
         
        var canvas=document.getElementById('faceCanvas');
        var fillWidth = border * w;
        var fillHeight = border * h;
        $(canvas).attr("height", fillHeight + "px");
        $(canvas).attr("width", fillWidth + "px");
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0, 0, fillWidth, fillHeight);
        for (var y = 0; y < h; y += 1) {
            for (var x = 0; x < w; x += 1) {
                ctx.fillStyle= val[y][x] == "1" ? '#000' : '#FFF';
                console.log("x y v, %d %d %s", x, y, val[y][x]);
                ctx.fillRect(x * border, y * border, border, border);
            }
        }
    }
    $(document).ready(function() {
        drawFace();
        $("#submit_face").click(function(){
            var d = $("#dim_face").val();
            drawFace(d, d);
        });
    });
 
</script>

```
