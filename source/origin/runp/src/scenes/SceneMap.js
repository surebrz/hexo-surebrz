
// 移动速度
var SX = 2;
var SY = 2;

var MUL = 0.7071067811865476;

var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
	},
	clear : function() {
		this.gameoverFlag = false;
		this.started = false;
		this.frameCnt = 0;	// 帧计数
		this.lastScorePos = -1;
		this.currScore = 0; // 当前分数
		this.highestScore = this.highestScore || 0;	// 最高分
	},
	start : function() {
		this._super();
		this.clear();
		var size = cc.director.getWinSize();
		this.titleLabel = cc.LabelTTF.create("START", "Arial",  24);
		this.titleLabel.setAnchorPoint(0.5, 0.5);
		this.titleLabel.setPosition(size.width / 2, size.height / 2);
		this.addChild(this.titleLabel, 999);
		this.scoreLabel = cc.LabelTTF.create("", "Arial", 24);
		this.scoreLabel.setVisible(false);
		this.addChild(this.scoreLabel, 998);
		cc.eventManager.addListener({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : this.onTouchTitle.bind(this)
		}, this.titleLabel);
		this.background = cc.LayerColor.create();
		this.background.setColor(cc.color(0,0,0));
		this.background.setContentSize(size);
		this.addChild(this.background, 0);
		this.playerSprite = null;
		this.enemies = [];	// 敌人
		this.enemieSize = 0;
		this.bullets = [];	// 弹幕
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
	updateLogic : function(dt) {
		this.frameCnt += 1;
		if (this.started) {
			this.playerSprite.update(dt);
			this.updateMove(dt);
			this.updateEnemies(dt);
			// console.log(this.playerSprite.getPosition());
		} else {
			if (Input.isTrigger(Keys.C)) {
				this.clear();
				this.gameStart();
				this.titleLabel.setVisible(false);
			}
		}
	},
	/**
	* 刷新玩家
	*/
	updateMove : function(dt) {
		var size = cc.director.getWinSize();
		var pos = this.playerSprite.getPosition();
		var x = pos.x;
		var y = pos.y;
		switch (Input.dir8()) {
			case 1 :
				console.log("DOWNLEFT");
				x = MAX(0, pos.x - SX * MUL);
				y = MAX(0, pos.y - SY * MUL);
			break;
			case 2 :
				console.log("DOWN");
				y = MAX(0, pos.y - SY);
			break;
			case 3 :
				console.log("DOWNRIGHT");
				x = MIN(size.width, pos.x + SX * MUL);
				y = MAX(0, pos.y - SY * MUL);
			break;
			case 4 :
				console.log("LEFT");
				x = MAX(0, pos.x - SX);
			break;
			case 6 :
				console.log("RIGHT");
				x = MIN(size.width, pos.x + SX);
			break;
			case 7 :
				console.log("UPLEFT");
				x = MAX(0, pos.x - SX * MUL);
				y = MIN(size.height, pos.y + SY * MUL);
			break;
			case 8 :
				console.log("UP");
				y = MIN(size.height, pos.y + SY);
			break;
			case 9 :
				console.log("UPRIGHT");
				x = MIN(size.width, pos.x + SX * MUL);
				y = MIN(size.height, pos.y + SY * MUL);
			break;
			default :
				// console.log("default");
			break;
		}
		this.playerSprite.setPosition(cc.p(x, y));
		if (this.playerSprite.hitRect(this.wallX1.getBoundingBox()) ||
			this.playerSprite.hitRect(this.wallX2.getBoundingBox()) ||
			this.playerSprite.hitRect(this.wallY1.getBoundingBox()) ||
			this.playerSprite.hitRect(this.wallY2.getBoundingBox())) {
				this.playerSprite.die();
				this.gameOverPhase();
		}
		// 得分判定
		if (this.playerSprite.hitRect(this.scoreRect.getBoundingBox())) {
			this.currScore += 1;
			this.highestScore = MAX(this.currScore, this.highestScore);
			this.randomScoreRect();
			this.refreshScore();
		}
	},
	/**
	* 刷新敌人
	*/
	updateEnemies : function(dt) {
		if (this.frameCnt % 180 == 0) {
			var size = cc.director.getWinSize();
			// 生成敌人
			var offset = 12;
			var postions = [
				[-offset, -offset],
				[-offset, size.height+offset],
				[size.width+offset, -offset],
				[size.width+offset, size.height+offset]
			];
			var pos = postions[parseInt(Math.random() * 4)]
			var sprite = new SpriteCharacter(false, pos[0], pos[1]);
			this.addChild(sprite, 100);
			var i;
			for (i= 0; i < this.enemieSize; i += 1) {
				if (!this.enemies[i]) {
					this.enemies[i] = sprite;
					sprite.i = i;
					break;
				}
			}
			if (i == this.enemieSize) {
				this.enemies.push(sprite);
				sprite.i = i;
				this.enemieSize += 1;
			}
			// 延时死亡
			var delay = cc.DelayTime.create(1.5);
			var callback = cc.CallFunc.create(function() {
				this.timeOut();
			}, sprite);
			sprite.runAction(cc.Sequence.create([delay, callback]));
		}
		// 更新位置
		for (var i= 0; i < this.enemieSize; i += 1) {
			if (this.enemies[i] != null && !this.enemies[i].timedOut) {
				var sprite = this.enemies[i];
				var posE = sprite.getPosition();
				var posP = this.playerSprite.getPosition();
				var dx = posE.x - posP.x;
				var dy = posE.y - posP.y;
				var sx = 0;
				var sy = 0;
				if (dx != 0 && dy != 0) {
					var k = dy / dx;
					sx = Math.abs(SX * MUL * Math.cos(Math.atan(k)));
					sy = Math.abs(SY * MUL * Math.sin(Math.atan(k)));
				} else {
					sy = SY * MUL;
				}
				sx *= dx / Math.abs(dx);
				sy *= dy / Math.abs(dy);
				sprite.setPosition(posE.x - sx, posE.y - sy);
				sprite.update(dt);
				//console.log(sprite.getPosition(), sx, sy);
				// 碰撞判定
				if (sprite.hitCircle(this.playerSprite.getPosition(), 8.0)) {
					this.playerSprite.die();
					this.gameOverPhase();
				}
			}
			if(this.enemies[i] != null && this.enemies[i].timedOut) {
				var sprite = this.enemies[i];
				sprite.stopAllActions();
				sprite.dispose();
				sprite.removeFromParent();
				this.enemies[i] = null;
			}
		}
	},
	gameStart : function() {
		var size = cc.director.getWinSize();
		this.stopAllActions();
		this.started = true;
		if (this.playerSprite) {
			this.playerSprite.dispose();
			this.playerSprite.removeFromParent();
		}
		this.playerSprite = new SpriteCharacter(true, size.width / 2, size.height / 2);
		this.addChild(this.playerSprite, 100);
		for (var i = 0; i < this.enemieSize; i += 1) {
			if (this.enemies[i]) {
				this.enemies[i].dispose();
				this.enemies[i].removeFromParent();
			}
		}
		this.enemies = [];
		this.enemieSize = 0;
		if (this.wallX1) {
			this.wallX1.removeFromParent();
		}
		var wallX1 = cc.LayerColor.create(); // 横向障碍
		wallX1.ignoreAnchorPointForPosition(false);
		wallX1.setAnchorPoint(0.5, 0.5);
		wallX1.setColor(cc.color(255,0,0));
		wallX1.setContentSize(cc.size(16, size.height / 8 * 3));
		wallX1.setPosition(cc.p(0, size.height / 16 * 13));
		this.wallX1 = wallX1;
		if (this.wallX2) {
			this.wallX2.removeFromParent();
		}
		var wallX2 = cc.LayerColor.create(); // 横向障碍可通行部分
		wallX2.ignoreAnchorPointForPosition(false);
		wallX2.setAnchorPoint(0.5, 0.5);
		wallX2.setColor(cc.color(255,0,0));
		wallX2.setContentSize(cc.size(16, size.height / 8 * 3));
		wallX2.setPosition(cc.p(0, size.height / 16 * 3));
		this.wallX2 = wallX2;
		if (this.wallY1) {
			this.wallY1.removeFromParent();
		}
		var wallY1 = cc.LayerColor.create(); // 纵向障碍
		wallY1.ignoreAnchorPointForPosition(false);
		wallY1.setAnchorPoint(0.5, 0.5);
		wallY1.setColor(cc.color(255,0,0));
		wallY1.setContentSize(cc.size(size.width / 8 * 3, 16));
		wallY1.setPosition(cc.p(size.width / 16 * 13, 0));
		this.wallY1 = wallY1;
		if (this.wallY2) {
			this.wallY2.removeFromParent();
		}
		var wallY2 = cc.LayerColor.create(); // 纵向障碍可通行部分
		wallY2.ignoreAnchorPointForPosition(false);
		wallY2.setAnchorPoint(0.5, 0.5);
		wallY2.setColor(cc.color(255,0,0));
		wallY2.setContentSize(cc.size(size.width / 8 * 3, 16));
		wallY2.setPosition(cc.p(size.width / 16 * 3, 0));
		this.wallY2 = wallY2;
		this.addChild(wallX1, 1);
		this.addChild(wallX2, 1);
		this.addChild(wallY1, 1);
		this.addChild(wallY2, 1);
		wallX1.runAction(cc.RepeatForever.create(cc.Sequence.create([
			cc.MoveTo.create(3, cc.p(size.width, wallX1.getPositionY())),
			cc.MoveTo.create(3, cc.p(0, wallX1.getPositionY()))
		])));
		wallX2.runAction(cc.RepeatForever.create(cc.Sequence.create([
			cc.MoveTo.create(3, cc.p(size.width, wallX2.getPositionY())),
			cc.MoveTo.create(3, cc.p(0, wallX2.getPositionY()))
		])));
		wallY1.runAction(cc.RepeatForever.create(cc.Sequence.create([
			cc.MoveTo.create(4, cc.p(wallY1.getPositionX(), size.height)),
			cc.MoveTo.create(4, cc.p(wallY1.getPositionX(), 0))
		])));
		wallY2.runAction(cc.RepeatForever.create(cc.Sequence.create([
			cc.MoveTo.create(4, cc.p(wallY2.getPositionX(), size.height)),
			cc.MoveTo.create(4, cc.p(wallY2.getPositionX(), 0))
		])));
		// 计分点
		if (this.scoreRect) {
			this.scoreRect.removeFromParent();
		}
		this.scoreRect = cc.LayerColor.create();
		this.scoreRect.setAnchorPoint(0.5, 0.5);
		this.scoreRect.ignoreAnchorPointForPosition(false);
		this.scoreRect.setColor(cc.color(255,255,255));
		this.scoreRect.setContentSize(cc.size(8, 8));
		this.scoreRect.setVisible(false);
		this.addChild(this.scoreRect, 2);
		this.randomScoreRect();
		this.refreshScore();
	},
	refreshScore : function() {
		var size = cc.director.getWinSize();
		this.scoreLabel.setVisible(true);
		this.scoreLabel.ignoreAnchorPointForPosition(false);
		this.scoreLabel.setAnchorPoint(0.5, 0.5);
		this.scoreLabel.setPosition(size.width / 2, size.height / 4 * 3);
		this.scoreLabel.setString(""+this.currScore);
	},
	randomScoreRect : function() {
		var size = cc.director.getWinSize();
		var Pos = [
			[size.width / 2, size.height / 4 * 3 + 16],
			[size.width / 2, size.height / 4 - 16],
			[size.width / 4 * 3, size.height / 2],
			[size.width / 4, size.height / 2]
		];
		this.lastScorePos = RandomExcept([0, 1, 2, 3], this.lastScorePos);
		var pos = Pos[this.lastScorePos];
		this.scoreRect.setPosition(pos[0], pos[1]);
		console.log(pos);
		this.scoreRect.setVisible(true);
	},
	winGamePhase : function() {
		this.started = false;
		this.stopAllActions();
		var wingameCallback = cc.callFunc(this.winGame, this);
		var sequence = cc.sequence(cc.delayTime(0.2), wingameCallback);
		this.runAction(sequence);
		this.winGame();
	},
	winGame : function() {
		this.titleLabel.setString("WIN!");
		this.titleLabel.setVisible(true);
	},
	gameOverPhase : function() {
		this.started = false;
		this.gameoverFlag = true;
		this.stopAllActions();
		var gameoverCallback = cc.callFunc(this.gameOver, this);
		var sequence = cc.sequence(cc.delayTime(0.2), gameoverCallback);
		this.runAction(sequence);
	},
	gameOver : function() {
		this.titleLabel.setString("GameOver!");
		this.titleLabel.setVisible(true);
	}
});
