// 场景基类
var SceneBase = cc.Scene.extend({
	ctor : function() {
		this._super();
		this.size = cc.director.getWinSize();
		console.log(this.size);
	},
	onEnter:function () {
		this._super();
		this.start();
		this.scheduleUpdate();
	},
	onExit : function() {
		this._super();
		this.unscheduleUpdate();
		this.terminate();
	},
	update : function(dt) {
		this.updateLogic(dt);
		Input.update(dt);
	},
	updateLogic : function(dt) {

	},
	start : function() {
	},
	terminate : function() {
	}
});