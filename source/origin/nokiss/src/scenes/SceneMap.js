var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
	},
	clear : function() {
		this.gameoverFlag = false;
		this.power = 0;
		this.flashPos = parseInt(Math.random() * 5);
	},
	start : function() {
		this._super();
		this.clear();
		var size = cc.director.getWinSize();
		this.titleLabel = cc.LabelTTF.create("START", "Arial", "48");
		this.titleLabel.setAnchorPoint(0.5, 0.5);
		this.titleLabel.setPosition(size.width / 2, size.height / 2);
		this.addChild(this.titleLabel, 999);
		cc.eventManager.addListener({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : this.onTouchTitle.bind(this)
		}, this.titleLabel);
		this.background = cc.LayerColor.create();
		this.background.setColor(cc.color(0,0,0));
		this.background.setContentSize(size);
		this.addChild(this.background);
	},
	onFlashClick : function(touch, event) {
		this.power += 1;
		if (this.power == 10) {
			this.winGamePhase();
		}
		this.randomFlash();
		return true;
	},
	onTouchTitle : function(touch, event) {
		var pos = touch.getLocation();
		var target = event.getCurrentTarget();
		if (target.isVisible() && cc.rectContainsPoint(target.getBoundingBox(), pos)) {
			this.clear();
			this.gameStart();
			this.titleLabel.setVisible(false);
		}
		return true;
	},
	gameStart : function() {
		var size = cc.director.getWinSize();
		this.stopAllActions();
		// panel
		if (!!this.panelSprites) {
			for (var j = 0; j < 5; j += 1) {
				this.panelSprites[j].removeFromParent();
			}
		}
		this.panelSprites = [];
		for (var i = 0; i < 5; i += 1) {
			var sprite = new SpriteBase("panel");
			var width = sprite.getContentSize().width;
			if (width * 5 > size.width) {
				sprite.setScale(size.width / (width * 5));
			}
			sprite.setPositionX((i + 0.5) * size.width / 5);
			sprite.setPositionY(sprite.getContentSize().height / 2);
			this.panelSprites.push(sprite);
			this.addChild(sprite);
		}

		// faces
		if (!!this.faceLeft) {
			this.faceLeft.removeFromParent();
		}
		this.faceLeft = new SpriteBase("faceLeft");
		if (!!this.faceRight) {
			this.faceRight.removeFromParent();
		}
		this.faceRight = new SpriteBase("faceRight");
		this.faceLeft.setPositionY(
			this.panelSprites[0].getContentSize().height + this.faceLeft.getContentSize().height / 2);
		this.faceLeft.setPositionX(this.faceLeft.getContentSize().width / 2);
		this.faceRight.setPositionY(
			this.panelSprites[0].getContentSize().height + this.faceRight.getContentSize().height / 2);
		this.faceRight.setPositionX(size.width - this.faceRight.getContentSize().width / 2);

		this.addChild(this.faceLeft);
		this.addChild(this.faceRight);

		// heart
		if (!!this.heart) {
			this.heart.removeFromParent();
		}
		this.heart = new SpriteBase("heart");
		this.heart.setPositionX(size.width / 2);
		this.heart.setPositionY(this.panelSprites[0].getContentSize().height + this.heart.getContentSize().height / 2);
		this.heart.setScale(0);
		this.addChild(this.heart, 200);

		// light
		if (!!this.light) {
			this.light.removeFromParent();
		}
		this.light = new SpriteBase("light");
		if (!!this.lighting) {
			this.lighting.removeFromParent();
		}
		this.lighting = new SpriteBase("lighting");
		this.lighting.setScaleY(-1);
		this.light.setScaleY(-1);
		this.lighting.setVisible(false);
		this.light.setPositionY(size.height - this.light.height / 2);
		this.light.setPositionX(size.width / 2);
		this.lighting.setPositionY(size.height - this.light.height / 2);
		this.lighting.setPositionX(size.width / 2);
		this.addChild(this.light, 198);
		this.addChild(this.lighting, 199);

		// btn
		if (!!this.flashBtn) {
			this.flashBtn.removeFromParent();
		}
		this.flashBtn = new SpriteTouchable("flash", this.onFlashClick.bind(this));
		this.flashBtn.setScale(0);
		this.addChild(this.flashBtn, 2);
		this.randomFlash();
		this.startDeadline();
	},
	randomFlash : function() {
		this.flashPos = parseInt(Math.random() * 5);
		var scaleTo = cc.scaleTo(0.1, 0);
		var setToFlashPosCallback = cc.callFunc(this.setToFlashPos, this);
		var scaleToBack = cc.scaleTo(0.1, 1); //this.flashBtn.getScale());
		var sequence = cc.sequence(scaleTo, setToFlashPosCallback, scaleToBack);
		this.flashBtn.setEnable(false);
		this.flashBtn.stopAllActions();
		this.flashBtn.runAction(sequence);
	},
	setToFlashPos : function() {
		this.flashBtn.setPositionX(this.panelSprites[this.flashPos].getPositionX());
		this.flashBtn.setPositionY(this.panelSprites[this.flashPos].getPositionY());
		if ((!this.gameoverFlag) && (this.power != 10)) {
			this.flashBtn.setEnable(true);
		}
	},
	startDeadline : function() {
		var size = cc.director.getWinSize();
		var moveToMiddleL = cc.moveTo(7, 
			size.width / 2 - this.faceLeft.getContentSize().width / 2, 
			this.faceLeft.getPositionY());
		var moveToMiddleR = cc.moveTo(7, 
			size.width / 2 + this.faceRight.getContentSize().width / 2, 
			this.faceRight.getPositionY());
		var gameoverCallback = cc.callFunc(this.gameOverPhase, this);
		var gameoverSequence = cc.sequence(cc.delayTime(7), gameoverCallback);
		this.faceLeft.runAction(moveToMiddleL);
		this.faceRight.runAction(moveToMiddleR);
		this.runAction(gameoverSequence);
	},
	winGamePhase : function() {
		var size = cc.director.getWinSize();
		this.stopAllActions();
		this.faceLeft.stopAllActions();
		this.faceRight.stopAllActions();
		this.flashBtn.setEnable(false);
		this.lighting.setVisible(true);
		var moveToLeft = cc.moveTo(0.2, 
			-this.faceLeft.getContentSize().width / 2, 
			this.faceLeft.getPositionY());
		var moveToRight = cc.moveTo(0.2, 
			size.width + this.faceRight.getContentSize().width / 2, 
			this.faceRight.getPositionY());
		var wingameCallback = cc.callFunc(this.winGame, this);
		var sequence = cc.sequence(cc.delayTime(0.2), wingameCallback);
		this.faceLeft.runAction(moveToLeft);
		this.faceRight.runAction(moveToRight);
		this.runAction(sequence);
		this.winGame();
	},
	winGame : function() {
		this.titleLabel.setString("WIN!");
		this.titleLabel.setVisible(true);
	},
	gameOverPhase : function() {
		this.gameoverFlag = true;
		this.stopAllActions();
		this.faceLeft.stopAllActions();
		this.faceRight.stopAllActions();
		this.flashBtn.setEnable(false);
		var scaleTo = cc.scaleTo(1, 2);
		var gameoverCallback = cc.callFunc(this.gameOver, this);
		var sequence = cc.sequence(scaleTo, gameoverCallback);
		this.heart.runAction(sequence);
	},
	gameOver : function() {
		this.titleLabel.setString("GameOver!");
		this.titleLabel.setVisible(true);
	}
});
