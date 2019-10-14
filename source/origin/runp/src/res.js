var res = {
	pics : [	// 图片
		//"res/back.png", // 背景
		"res/blank.png"	// 空图
	],
	audios : [	// 音乐
		//"res/clock",	// 倒计时时钟
		//"res/click.ogg",	// 按下按钮
		//"res/win.ogg",	// 胜利
		//"res/fail.ogg"	// 失败
	]
}

var preloads = [];

function pushPreloads(preloads, materials) {
	for (var i = 0; i < materials.length; i += 1) {
		preloads.push(materials[i]);
	}
}

pushPreloads(preloads, res.pics);
//pushPreloads(preloads, res.audios);

console.log("res :");
console.log(preloads);