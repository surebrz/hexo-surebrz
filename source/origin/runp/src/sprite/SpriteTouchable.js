var SpriteTouchable = SpriteBase.extend({
	ctor : function(name, onTouch) {
		this._super(name);
		this.onTouch = onTouch;
		this.registerTouchListener();

		this._enabled = true;
		this._touched = false;
	},
	registerTouchListener : function() {
		var self = this;
		self.touchListener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : function(touch, event) {
				if (!self.isEnable()) {
					return true;
				}
				self._touched = false;
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
					if (!!self.onTouch && ("function" == typeof self.onTouch)) {
						console.log("began");
						self._touched = true;
					}
				}
				return true;
			},
			onTouchEnded : function(touch, event) {
				if (!self.isEnable()) {
					return true;
				}
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				if (self._touched && cc.rectContainsPoint(target.getBoundingBox(), pos)) {
					if (!!self.onTouch && ("function" == typeof self.onTouch)) {
						console.log("ended");
						return self.onTouch.call(self, touch, event);
					}
				}
				return true;
			}
		});
		self.touchListener.setSwallowTouches(false);
		cc.eventManager.addListener(self.touchListener, self);
	},
	setEnable : function(enable) {
		this._enabled = enable;
	},
	isEnable : function() {
		return this._enabled;
	}
});