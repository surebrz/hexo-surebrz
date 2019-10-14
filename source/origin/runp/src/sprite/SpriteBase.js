var SpriteBase = cc.Sprite.extend({
	ctor : function(name) {
		this._super("res/" + name + ".png");
		this.anchorX = 0.5;
		this.anchorY = 0.5;
	},
	dispose : function(manual) {
		this.removeAllChildren();
		if (!manual) {
			this.removeFromParent();
		}
	}
});