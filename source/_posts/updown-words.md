title: 倒着的英文
date: 2018-11-26 11:41:43
tags: [html，javascript]
categories: HTML
---

生成倒映的小写英文：

<div style="text-align:center;width:100%;">
    <div>
        <input type="text" id="word" placeholder="goodbye world"/>
        <input type="button" id="submit_face" value="submit"/>
		<br/>
        <span id="result"></span>
		<br/>
        <span id="result_reverse"></span>
    </div>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
 
<script type="text/javascript">
    function drawWord(word) {
		let map = {
			"a" : "ɐ",
			"b" : "q",
			"c" : "ɔ",
			"d" : "p",
			"e" : "ǝ",
			"f" : "ɟ",
			"g" : "ɓ",
			"h" : "ɥ",
			"i" : "ı",
			"j" : "ſ",
			"k" : "ʞ",
			"l" : "ן",
			"m" : "ɯ",
			"n" : "u",
			"o" : "o",
			"p" : "d",
			"q" : "b",
			"r" : "ɹ",
			"s" : "s",
			"t" : "ʇ",
			"u" : "n",
			"v" : "ʌ",
			"w" : "ʍ",
			"x" : "x",
			"y" : "ʎ",
			"z" : "z"
		}
		let result = word.split("").reduce((r, c) => {return r.concat(map[c] || c)}, "");
		console.log("result", result);
		$("#result").text(result);
		$("#result_reverse").text(result.split("").reverse().join(""));
    }
    $(document).ready(function() {
        drawWord("goodbye world");
        $("#submit_face").click(function(){
            var d = $("#word").val();
            drawWord(d);
        });
    });
 
</script>

源码：
<!-- more -->

```html
<html>
<body style="text-align:center;>
	<div style="text-align:center;width:100%;">
		<div>
			<input type="text" id="word" placeholder="goodbye world"/>
			<input type="button" id="submit_face" value="submit"/>
			<br/>
			<span id="result"></span>
			<br/>
			<span id="result_reverse"></span>
		</div>
	</div>
</body>

<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
<script type="text/javascript">
    function drawWord(word) {
		let map = {
			"a" : "ɐ",
			"b" : "q",
			"c" : "ɔ",
			"d" : "p",
			"e" : "ǝ",
			"f" : "ɟ",
			"g" : "ɓ",
			"h" : "ɥ",
			"i" : "ı",
			"j" : "ſ",
			"k" : "ʞ",
			"l" : "ן",
			"m" : "ɯ",
			"n" : "u",
			"o" : "o",
			"p" : "d",
			"q" : "b",
			"r" : "ɹ",
			"s" : "s",
			"t" : "ʇ",
			"u" : "n",
			"v" : "ʌ",
			"w" : "ʍ",
			"x" : "x",
			"y" : "ʎ",
			"z" : "z"
		}
		let result = word.split("").reduce((r, c) => {return r.concat(map[c] || c)}, "");
		console.log("result", result);
		$("#result").text(result);
		$("#result_reverse").text(result.split("").reverse().join(""));
    }
    $(document).ready(function() {
        drawWord("goodbye world");
        $("#submit_face").click(function(){
            var d = $("#word").val();
            drawWord(d);
        });
    });
</script>
</html>
```
