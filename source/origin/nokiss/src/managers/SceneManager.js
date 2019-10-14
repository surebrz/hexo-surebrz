var SceneManager = {
	runningScene : null,
	call : function(scene) {
		// 切换场景
		cc.director.runScene(scene);
		//记录当前场景
		SceneManager.runningScene = scene;
	}
}