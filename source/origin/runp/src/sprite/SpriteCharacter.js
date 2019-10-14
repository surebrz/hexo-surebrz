// 敌我精灵

var R = 8.0;	// 圆半径

var SpriteCharacter = SpriteBase.extend({
	ctor : function(isPlayer, x, y) {
		this._super("blank");
		this.isPlayer = isPlayer;
		this.timedOut = false; // 作为敌人时生命终止
		this.tails = [];
		this.tailSize = 0;
		this.dtCount = 0.0;
		this.lastX = 0;
		this.lastY = 0;
		this.setPosition(x, y);
		this.color = isPlayer ? cc.color(255,255,255, 255) : cc.color(196,0,0, 255);
		this.node = cc.DrawNode.create();//cc.LayerColor.create();
		this.addChild(this.node, 1000);
		this.drawNode(this.node);
	},
	addTail : function(x, y) {
		var tail = new SpriteBase("blank");
		var drawNode = cc.DrawNode.create()
		tail.addChild(drawNode);
		tail.node = drawNode;
		this.getParent().addChild(tail, 1);
		tail.setPosition(this.getPosition());
		this.drawTail(tail);
		var i = 0;
		for (i = 0; i < this.tailSize; i += 1) {
			if (this.tails[i] == null) {
				this.tails[i] = tail;
				tail.i = i;
				tail.character = this;
				break;
			}
		}
		if (i == this.tailSize) {
			this.tails[i] = tail;
			tail.i = i;
			tail.character = this;
			this.tailSize += 1;
		}
		var fade = cc.FadeOut.create(0.2);
		var scale = cc.ScaleTo.create(0.2, 0, 0);
		var spawn = cc.Spawn.create([fade, scale]);
		var callback = cc.CallFunc.create(function(){
			this.removeFromParent();
			this.character.tails[this.i] = null;
		}, tail);
		var sequence = cc.Sequence.create([spawn, callback]);
		tail.runAction(sequence);
	},
	drawNode : function(node) {
		node.ignoreAnchorPointForPosition(false);
		node.setAnchorPoint(0.5, 0.5);
		node.drawDot(cc.p(0, 0), R, this.color);
	},
	drawTail : function(tail) {
		tail.node.ignoreAnchorPointForPosition(false);
		tail.setCascadeOpacityEnabled(true);
		tail.node.setAnchorPoint(0.5, 0.5);
		tail.node.drawDot(cc.p(0, 0), R, this.color);
	},
	timeOut : function() {
		this.stopAllActions();
		var fadeOut = cc.FadeOut.create(1);
		var callback = cc.CallFunc.create(function() {
			this.timedOut = true;
		}, this);
		this.runAction(cc.Sequence.create([fadeOut, callback]));
	},
	die : function() {
		this.node.setVisible(false);
		for (var i = 0; i < 4; i += 1) {
			var temp = new SpriteBase("blank");
			var drawNode = cc.DrawNode.create()
			temp.addChild(drawNode);
			temp.setCascadeOpacityEnabled(true);
			temp.node = drawNode;
			this.getParent().addChild(temp, 100);
			temp.setPosition(this.getPosition());
			this.drawNode(temp.node);
			var fade = cc.FadeOut.create(1);
			var mx = [300, 300, -300, -300][i];
			var my = [300, -300, 300, -300][i];
			var moveBy = cc.MoveBy.create(1, cc.p(mx, my));
			var spawn = cc.Spawn.create([fade, moveBy]);
			temp.runAction(spawn);
		}

	},
	hitRect : function(rect) {
		x = this.getPositionX();
		y = this.getPositionY();
		if (x - R > rect.x + rect.width ||
			x + R < rect.x ||
			y - R > rect.y + rect.height ||
			y + R < rect.y) {
				return false;
		}
		return true;
	},
	hitCircle : function(pos, r) {
		x = this.getPositionX();
		y = this.getPositionY();
		return (x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y) < R * R + r * r;
	},
	update : function(dt) {
		this.dtCount += dt;
		var pos = this.getPosition();
		if (this.lastX != pos.x || this.lastY != pos.y) {
			this.lastX = pos.x;
			this.lastY = pos.y;
			if (this.dtCount > 0.02) {
				this.addTail(this.lastX, this.lastY);
				this.dtCount = 0.0;
			}
		}
	},
	dispose : function() {
		this._super();
		for (var i = 0; i < this.tailSize; i += 1) {
			if (this.tails[i] != null) {
				this.tails[i].removeFromParent();
				break;
			}
		}
	}
});