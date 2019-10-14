var res = {
	pics : [	// 图片
		//"res/back.png", // 背景
		"res/faceLeft.png", // 左脸
		"res/faceRight.png",	// 右脸
		//"res/btnRed.png",	// 红色按钮
		//"res/btnBlue.png",	// 蓝色按钮
		//"res/btnYellow.png",	// 黄色按钮
		//"res/btnYellowClicked.png",	// 黄色按钮按下
		"res/flash.png",
		"res/panel.png",
		"res/light.png",
		"res/lighting.png",
		"res/heart.png",		// 心
		//"res/fire.png"	// 火动画序列帧图片
		//"res/fire.plist"	// 火动画plist
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