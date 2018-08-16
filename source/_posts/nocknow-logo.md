title: 脑壳LOGO
date: 2017-02-06 14:07:09
tags: [html，javascript]
categories: HTML
---

脑壳logo：

```html
<html>
<body style="text-align:center;background-color:#1e576b">
    <canvas id="logoCanvas"></canvas>
</body>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
    function drawLogo() {
        var w = 11;
        var h = 17;
        var border = 24;
        var map = [
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,1,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,1]
        ]
        var canvas=document.getElementById('logoCanvas');
        var fillWidth = border * w;
        var fillHeight = border * h;
        $(canvas).attr("height", fillHeight + "px");
        $(canvas).attr("width", fillWidth + "px");
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0, 0, fillWidth, fillHeight);
        for (var y = 0; y < h; y += 1) {
            for (var x = 0; x < w; x += 1) {
                if (map[y][x] == 0) {continue;}
                ctx.fillStyle='#FFF';
                ctx.fillRect(x * border, y * border, border, border);
            }
        }
    }
    $(document).ready(function() {
        drawLogo();
 
    });
 
</script>
</html>
```

预览：

<div style="text-align:center;background-color:#1e576b">
    <canvas id="logoCanvas"></canvas>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
    function drawLogo() {
        var w = 11;
        var h = 17;
        var border = 24;
        var map = [
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,1,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,1]
        ]
        var canvas=document.getElementById('logoCanvas');
        var fillWidth = border * w;
        var fillHeight = border * h;
        $(canvas).attr("height", fillHeight + "px");
        $(canvas).attr("width", fillWidth + "px");
        var ctx=canvas.getContext('2d');
        ctx.clearRect(0, 0, fillWidth, fillHeight);
        for (var y = 0; y < h; y += 1) {
            for (var x = 0; x < w; x += 1) {
                if (map[y][x] == 0) {continue;}
                ctx.fillStyle='#FFF';
                ctx.fillRect(x * border, y * border, border, border);
            }
        }
    }
    $(document).ready(function() {
        drawLogo();
 
    });
 
</script>