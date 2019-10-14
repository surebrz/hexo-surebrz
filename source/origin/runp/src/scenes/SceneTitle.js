// 标题界面
var SceneTitle = SceneBase.extend({
	ctor : function() {
		this._super();
	},
	start : function() {      
		this._super();
		SceneManager.call(new SceneMap());
	}
});