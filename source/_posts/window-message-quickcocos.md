title: 【未完成】Window_Message(雾。。。
date: 2017-02-06 11:39:35
tags: [lua,quick-cocos,javascript,cocos-html]
categories: JavaScript
---

仿制RM的Window_Message。富文本模块。

<!--more-->

js版

```javascript

/*
var labelEx = new UIRichText(300) -- width
parent.addChild(labelEx, 100)
labelEx.setPosition(100, self.visibleSize.height)
labelEx.setString("文字$C<3>颜色$C<1>普通颜色$S<36>大小$S<0>普通大小$I<res/HelloWorld.png>←图片$A<TuanZi,walk>动画$n换$n行")
 
*/
var UIRichText = UIBase.extend({
	//控制字符
	C_CHR : "$",
	// 单字显示时间间隔
	WAIT_FOR_MESSAGE : 5 / 60,
	//默认字号
	DEFAULT_FONT_SIZE : 24,
	// 行间距
	DEFAULT_LINE_HEIGHT : 12,

	ctor : function(width, show_fast) {
		this._super();

		this._defaultFontSize = this.DEFAULT_FONT_SIZE;
		this._lineHeight = this.DEFAULT_LINE_HEIGHT;
		this._width = width;
		this._show_fast = !!show_fast;
		this._height = this._defaultFontSize;
		this.clear();
	},
	clear : function() {
		this._contentStr = "";
	 
		this._texts = this._texts || []; // 文字
		this._images = this._images || [];   // 图片
		this._armatures = this._armatures || []; // 动画
		this._contents = this._contents || [];   // 包含文字图片等实际顺序的数组
		this._currentLine = this._currentLine || []; // 渲染中的本行元素
		this._strIndex = 0; // 遍历的当前字符
		this._currentColor = 0;  // 当前文字颜色
		this._currentFontSize = this._defaultFontSize;   // 当前文字大小
		
		for (var i = 0; i < this._texts.length; i += 1) {
			this._texts[i].removeFromParent();
		}
		for (var i = 0; i < this._images.length; i += 1) {
			this._images[i].removeFromParent();
		}
		for (var i = 0; i < this._armatures.length; i += 1) {
			this._armatures[i].removeFromParent();
		}

		this._texts = [];
		this._images = [];
		this._armatures = [];
		this._contents = [];
		this._renderPos = {
						x : 0, 
						y : 0,
						maxHeight : this._defaultFontSize   // 记录本行最大高度
					};
		this._currentLine = [];
	 
		this.unscheduleUpdate();
		this._updateDt = 0;

		this._showSeq = 0;
	},
	onEnter : function() {
		this._super();
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(0, 1);
	},
	onExit : function() {
		this._super();
		this.clear();
	},
	/**
	* 根据代码取文字颜色
	* @code 颜色代码
	*/
	getColor : function(code) {
		code = code || 0;
		colors = [
                    cc.color(255, 255, 255),  // 白色
                    cc.color(0, 0, 0),            // 黑色
                    cc.color(255, 0, 0),          // 红色
                    cc.color(0, 255, 0),          // 绿色
                    cc.color(0, 0, 255),          // 蓝色
                    cc.color(0, 255, 255)         // 黄色
                    ];
		return colors[code] || colors[0];
	},
	setDefaultFontSize : function(size) {
		size = size || this._defaultFontSize;
		if (size < 0) {
			size = this._defaultFontSize;
		}
		this._defaultFontSize = size;
	},
	setString : function(str) {
		console.log("setString %s", str);
		this.clear();
		this._contentStr = str;
		this.refresh();
		this.scheduleUpdate();
	},
	refresh : function() {
		while (this._strIndex < this._contentStr.length) {
			this.progressContentString();
		}
		if (this._show_fast) {
			this._seq = this._contentStr.length;
		}
		this.nextLine();
		this._height = this._renderPos.y;
		this.ignoreAnchorPointForPosition(false);
		this.setAnchorPoint(cc.p(0, 1));
		this.setContentSize(this._width, this._height);
		this.adjustContentsY();
		//this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
		//this.setBackGroundColor(cc.color(0, 255, 0, 100));
		console.log(this._width, this._height);
	},
	/*
	* 处理特殊字符
	*/
	progressContentString : function() {
		// get one word
		var str = this._contentStr.substr(this._strIndex, 1);
		this._strIndex += 1;
		console.log("progressContentString %s", str);
		if (str == "\r") {
			// 回车
			return;
		} else if (str == "\n") {
			// 换行
			this.progressNewLine();
		} else if (str == this.C_CHR) {
			// 控制符开始
			// 处理控制字符，处理中会影响_strIndex
			this.progressControlChar();
		} else {
			// 普通文字
			this.progressNormalText(str);
		}
	},
	/*
	* 处理换行
	*/
	progressNewLine : function() {
		this.nextLine();
	},
	/*
	* 处理特殊字符
	*/
	progressControlChar : function() {
		var chr = this._contentStr.substr(this._strIndex, 1);
		this._strIndex += 1;
		chr = chr.toUpperCase();
		console.log("chr %s", chr);
		var progressFlag = false;	// 是否正常解析
		var progressLen = 0; // 参数字符数
		// get params( first <.*> regexp)
		var contentToCheck = this._contentStr.substr(this._strIndex);
		console.log("contentToCheck %s", contentToCheck);
		if (chr == "C") {
			// 修改颜色
			var params = contentToCheck.match(/<(\d+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.changeFontColor(parseInt(params[1]));
				progressLen = params[1].length;
			} else {
				console.log("fail changeFontColor");
			}
		} else if (chr == "S") {
			// 修改字号
			var params = contentToCheck.match(/<(\d+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.changeFontSize(parseInt(params[1]));
				progressLen = params[1].length;
			} else {
				console.log("fail changeFontSize");
			}
		} else if (chr == "I") {
			// 插入图片
			var params = contentToCheck.match(/<(.+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.progressImage(params[1]);
				progressLen = params[1].length;
			} else {
				console.log("fail progressImage");
			}
		} else if (chr == "A") {
			// 插入动画
			var params = contentToCheck.match(/<(\w+?),(\w+?)>/);
			console.log(params);
			if (params) {
				progressFlag = this.progressArmature(params[1], params[2]);
				progressLen = params[1].length + params[2].length + 1;
			} else {
				console.log("fail progressArmature");
			}
		}
		if (progressFlag) {
			// 正常解析
			this._strIndex += 2; // "<>"
			this._strIndex += progressLen;
		} else {
			// 处理失败，包含$在内均当做普通字符处理
			console.log("fail progress!, last code : %s", chr);
			this._strIndex -= 2; // $X
			var str = this._contentStr.substr(this._strIndex, 1);
			this._strIndex += 1;
			this.progressNormalText(str);
		}
	},
	/*
	* 处理普通文字
	*/
	progressNormalText : function(chr) {
		console.log("create ccui.Text %s, size %s", chr, this._currentFontSize);
		var uiText = ccui.Text.create(chr, "微软雅黑", this._currentFontSize);
		uiText.setString(chr);
		uiText.setVisible(this._show_fast);
		uiText.setFontSize(this._currentFontSize);
		uiText.setColor(this.getColor(this._currentColor));
		this.addChild(uiText);

		if (uiText.getContentSize().width > this._width) {
			uiText:setScale(this._width / uiText.getContentSize().width);
		}
		if (this._renderPos.x + uiText.getContentSize().width > this._width) {
			this.nextLine();
		}
		this.setElemPosition(uiText, this._renderPos.x, this._renderPos.y);
		this._renderPos.x += uiText.getContentSize().width;
		this._renderPos.maxHeight = (this._renderPos.maxHeight > uiText.getContentSize().height) ? this._renderPos.maxHeight : uiText.getContentSize().height

		this._texts.push(uiText);
		this._contents.push(uiText);
		this._currentLine.push(uiText);
		return true;
	},
	/*
	* 修改颜色
	*/
	changeFontColor : function(code) {
		if (!!code || code == 0) {
			this._currentColor = code;
			return true;
		}
		return false;
	},
	/*
	* 修改字号
	*/
	changeFontSize : function(code) {
		if (!!code || code == 0) {
			if (code <= 0) {
				code = this._defaultFontSize;
			}
			this._currentFontSize = code;
			return true;
		}
		return false;
	},
	/*
	* 插入图片
	*/
	progressImage : function(path) {
		if (!!path) {
			// 暂时只处理单图
			console.log("progress image %s", path);
			var uiImage = ccui.ImageView.create(path, ccui.Widget.LOCAL_TEXTURE);
			uiImage.setVisible(this._show_fast);
			this.addChild(uiImage);

			if (uiImage.getContentSize().width > this._width) {
				uiImage:setScale(this._width / uiImage.getContentSize().width);
			}
			if (this._renderPos.x + uiImage.getContentSize().width > this._width) {
				this.nextLine();
			}
			this.setElemPosition(uiImage, this._renderPos.x, this._renderPos.y);
			this._renderPos.x += uiImage.getContentSize().width;
			this._renderPos.maxHeight = (this._renderPos.maxHeight > uiImage.getContentSize().height) ? this._renderPos.maxHeight : uiImage.getContentSize().height

			this._images.push(uiImage);
			this._contents.push(uiImage);
			this._currentLine.push(uiImage);
			return true;
		}
		return false;
	},
	/*
	* 插入动画
	*/
	progressArmature : function(name, action) {
		if ((!!name) && (!!action)) {
			console.log("progress armature %s %s", name, action);
			var armature = new ArmatureBase(name, this);
			armature.play(action);
			armature.armature.setVisible(this._show_fast);
			if (armature.armature.getContentSize().width > this._width) {
				armature.armature.setScale(this._width / armature.armature.getContentSize().width);
			}
			if (this._renderPos.x + armature.armature.getContentSize().width > this._width) {
				this.nextLine();
			}
			this.setElemPosition(armature.armature, this._renderPos.x, this._renderPos.y);
			this._renderPos.x += armature.armature.getContentSize().width;
			this._renderPos.maxHeight = (this._renderPos.maxHeight > armature.armature.getContentSize().height) ? this._renderPos.maxHeight : armature.armature.getContentSize().height

			this._armatures.push(armature);
			this._contents.push(armature);
			this._currentLine.push(armature);
			return true;
		}
		return false;
	},
	/*
	* 调整位置
	*/
	setElemPosition : function(elem, _x, _y) {
		console.log("setElemPosition %s, %s", _x, _y);
		if (elem instanceof ArmatureBase) {
			elem = elem.armature;
		}
		elem.ignoreAnchorPointForPosition(false);
		elem.setAnchorPoint(cc.p(0,0));
		elem.setVisible(true);
		if (_x != null) {
			var x = _x + elem.getContentSize().width * elem.getAnchorPoint().x;
			elem.setPositionX(x);
		}
		if (_y != null) {
			var y = _y + elem.getContentSize().height * elem.getAnchorPoint().y;
			elem.setPositionY(- y);
		}
	},
	/*
	* 换行
	*/
	nextLine : function() {
		// 调整当前行元素高度，适应maxHeight
		for (var i = 0; i < this._currentLine.length; i += 1) {
			this.setElemPosition(this._currentLine[i], null, this._renderPos.y + this._renderPos.maxHeight);
		}
		this._renderPos.x = 0;
		this._renderPos.y += this._renderPos.maxHeight + this._lineHeight / 2;
		this._renderPos.maxHeight = this._defaultFontSize; // 恢复lineheight
		this._currentLine = [];
	},

	adjustContentsY : function () {
		for (var i = 0; i < this._contents.length; i += 1) {
			var elem = this._contents[i];
			if (elem instanceof ArmatureBase) {
				elem = elem.armature;
			}
			elem.setPositionY(elem.getPositionY() + this._height + this._lineHeight);
		}
	},

	update : function(dt) {
		this._updateDt += dt;
		if (this._updateDt > this.WAIT_FOR_MESSAGE) {
			this._updateDt = 0;
			if (this._showSeq < this._contents.length) {
				if (this._contents[this._showSeq] instanceof ArmatureBase) {
					this._contents[this._showSeq].armature.setVisible(true);
				} else {
					this._contents[this._showSeq].setVisible(true);
				}
				this._showSeq += 1;
			}
		}
	}

});
```

----

lua版

```lua
--[[
local labelEx = require("ui.ui_label_ex"):create(300) -- width
l:addChild(labelEx, 100)
labelEx:setPosition(100, self.visibleSize.height)
labelEx:setString("普通文字$C<3>颜色$C<1>普通颜色$S<36>大小$S<0>普通大小$I<101>←图片$B<button>按钮$E<99>表情\n换\n行")
 
]]--
local UILabelEx = class("UILabelEx", require("ui.ui_common"))
 
-- 控制字符
UILabelEx.C_CHR = "$"
-- 单字显示时间间隔
UILabelEx.WAIT_FOR_MESSAGE = 5 / 60
-- 默认字号
UILabelEx.DEFAULT_FONT_SIZE = 24   
-- 行间距
UILabelEx.DEFAULT_LINE_HEIGHT = 12 
 
 
function UILabelEx:ctor(width, show_fast)
    UILabelEx.super.ctor(self, "")
 
    self._defaultFontSize = UILabelEx.DEFAULT_FONT_SIZE
    self._lineHeight = UILabelEx.DEFAULT_LINE_HEIGHT
    self._width = width
    self._show_fast = not not show_fast
    self._height = self._defaultFontSize
    self._rootWgt = ccui.Layout:create()
    self:addChild(self._rootWgt, 100)
    self:clear()
end
 
function UILabelEx:clear()
    self._contentStr = ""
 
    self._texts = self._texts or {} -- 文字
    self._images = self._images or {}   -- 图片
    self._widgets = self._widgets or {} -- 按钮等
    self._armatures = self._armatures or {} -- 动画
    self._contents = self._contents or {}   -- 包含文字图片等实际顺序的数组
    self._currentLine = self._currentLine or {} -- 渲染中的本行元素
    self._strIndex = 1 -- 遍历的当前字符
    self._currentColor = 1  -- 当前文字颜色
    self._currentFontSize = self._defaultFontSize   -- 当前文字大小
 
    for k, v in pairs(self._texts) do
        v:removeFromParent()
        self._texts[k] = nil
    end
    for k, v in pairs(self._images) do
        v:removeFromParent()
        self._images[k] = nil
    end
    for k, v in pairs(self._widgets) do
        v:removeFromParent()
        self._widgets[k] = nil
    end
    for k, v in pairs(self._armatures) do
        v:removeFromParent()
        self._armatures[k] = nil
    end
    self._texts = {}
    self._images = {}
    self._widgets = {}
    self._armatures = {}
    self._contents = {}
    self._renderPos = {
                        x = 0, 
                        y = 0,
                        maxHeight = self._defaultFontSize   -- 记录本行最大高度
                    }
    self._currentLine = {}
 
    if self._scheduleShow ~= nil then
        cc.Director:getInstance():getScheduler():unscheduleScriptEntry(self._scheduleShow)
    end
    self._scheduleShow = nil
    self._showSeq = 0
end
 
 
-- 判断utf8字符byte长度
-- 0xxxxxxx - 1 byte
-- 110yxxxx - 192, 2 byte
-- 1110yyyy - 225, 3 byte
-- 11110zzz - 240, 4 byte
local function chsize(char)
    if not char then
        print("not char")
        return 0
    elseif char > 240 then
        return 4
    elseif char > 225 then
        return 3
    elseif char > 192 then
        return 2
    else
        return 1
    end
end
 
-- 计算utf8字符串字符数, 各种字符都按一个字符计算
-- 例如utf8len("1你好") => 3
local function utf8len(str)
    local len = 0
    local currentIndex = 1
    while currentIndex <= #str do
        local char = string.byte(str, currentIndex)
        currentIndex = currentIndex + chsize(char)
        len = len +1
    end
    return len
end
 
-- 截取utf8 字符串
-- str:         要截取的字符串
-- startChar:   开始字符下标,从1开始
-- numChars:    要截取的字符长度
local function utf8sub(str, startChar, numChars)
    local startIndex = 1
    while startChar > 1 do
        local char = string.byte(str, startIndex)
        startIndex = startIndex + chsize(char)
        startChar = startChar - 1
    end
 
    local currentIndex = startIndex
 
    while numChars > 0 and currentIndex <= #str do
        local char = string.byte(str, currentIndex)
        currentIndex = currentIndex + chsize(char)
        numChars = numChars -1
    end
    return str:sub(startIndex, currentIndex - 1)
end
 
 
function UILabelEx:onEnter()
    self:ignoreAnchorPointForPosition(false)
    self:setAnchorPoint(0, 1)
end
 
function UILabelEx:onExit()
    self:clear()
end
 
-- 根据代码取文字颜色
function UILabelEx:getColor(code)
    code = code or 1
    local colors = {
                    cc.c3b(255, 255, 255),  -- 白色
                    cc.c3b(0, 0, 0),            -- 黑色
                    cc.c3b(255, 0, 0),          -- 红色
                    cc.c3b(0, 255, 0),          -- 绿色
                    cc.c3b(0, 0, 255),          -- 蓝色
                    cc.c3b(0, 255, 255)         -- 黄色
                    }
 
    return colors[code] or colors[1]
end
 
function UILabelEx:setDefaultFontSize(size)
    size = size or self._defaultFontSize
    if size <= 0 then size = self._defaultFontSize end
    self._defaultFontSize = size
end
 
function UILabelEx:setString(str)
    self:clear()
    self._contentStr = str
    self:refresh()
    self._scheduleShow = cc.Director:getInstance()
                                :getScheduler()
                                :scheduleScriptFunc(handler(self, self.scheduleShow), 
                                                        UILabelEx.WAIT_FOR_MESSAGE, 
                                                        false)
end
 
--[[
"普通文字\eC[color]颜色\eC[1]普通\n颜色\eS[size]大小\eS[24]普通大小\eI[img]←图片\eB[button]按钮\eE[emj]表情"
]]--
function UILabelEx:refresh()
    print(utf8len(self._contentStr))    
    while self._strIndex <= utf8len(self._contentStr) do
        self:progressContentString()
    end
    if self._show_fast then self._seq = #self._contents end
    self:nextLine()
    self._height = self._renderPos.y
    self._rootWgt:ignoreAnchorPointForPosition(false)
    self._rootWgt:setAnchorPoint(cc.p(0, 1))
    self._rootWgt:setBackGroundColorType(ccui.LayoutBackGroundColorType.solid)
    self._rootWgt:setBackGroundColor(cc.c3b(128, 128, 128))
    self._rootWgt:setContentSize(self._width, self._height)
end
 
-- 处理特殊字符
function UILabelEx:progressContentString()
    local str = utf8sub(self._contentStr, self._strIndex, 1)
    self._strIndex = self._strIndex + 1
    -- print("str:"..str)
     
    if str == "\r" then             -- 回车
        return
    elseif str == "\n" then         -- 换行
        self:progressNewLine()
    elseif str == UILabelEx.C_CHR then      -- 控制符
        -- 处理中会影响self._strIndex
        self:progressControlChar()
    else                            -- 普通文字
        self:progressNormalText(str)
    end
     
end
 
-- 换行
function UILabelEx:progressNewLine()
    self:nextLine()
end
 
-- 控制符
function UILabelEx:progressControlChar()
    local chr = utf8sub(self._contentStr, self._strIndex, 1)
    self._strIndex = self._strIndex + 1
    chr = string.upper(chr)
    -- print("char:"..chr)
    local progressFlag = false  -- 是否正常解析
    local s, e, val = string.find(self._contentStr, "<(.-)>", string.len(utf8sub(self._contentStr, 1, self._strIndex)))
    if val and s == string.len(utf8sub(self._contentStr, 1, self._strIndex)) then
        progressFlag = true
        print("val:"..(val ~= nil and val or "nil"))
        if chr == "C" then
            progressFlag = self:changeFontColor(tonumber(val))  -- 修改颜色
        elseif chr == "S" then
            progressFlag = self:changeFontSize(tonumber(val))   -- 修改字号
        elseif chr == "I" then
            progressFlag = self:progressImage(tonumber(val))    -- 插入图片
        elseif chr == "B" then
            progressFlag = self:progressBtn(val)        -- 插入按钮
        elseif chr == "E" then
            progressFlag = self:progressEmoji(tonumber(val))    -- 插入表情
        end
    end
    if progressFlag then
        self._strIndex = self._strIndex + utf8len(val) + 2
    else -- 处理失败，当做通常字符处理       
        self._strIndex = self._strIndex - 2
        local str = utf8sub(self._contentStr, self._strIndex, 1)
        self._strIndex = self._strIndex + 1    
        self:progressNormalText(str)
    end
end
 
-- 普通文字
function UILabelEx:progressNormalText(chr)
    print("progress normal:"..chr)
    local uiText = ccui.Text:create()   
    uiText:setString(chr)
    uiText:setVisible(self._show_fast)
    uiText:setFontSize(self._currentFontSize)
    uiText:setColor(self:getColor(self._currentColor))
    self:addChild(uiText, 100)
 
    if uiText:getContentSize().width > self._width then
        print("too big width, scaled")
        uiText:setScale(self._width / uiText:getContentSize().width)
    end
    if self._renderPos.x + uiText:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(uiText, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + uiText:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > uiText:getContentSize().height) and self._renderPos.maxHeight or uiText:getContentSize().height
 
    self._texts[#self._texts + 1] = uiText
 
    self._contents[#self._contents + 1] = uiText
    self._currentLine[#self._currentLine + 1] = uiText
    return true
end
 
function UILabelEx:changeFontColor(code)
    if not code then return false end
    self._currentColor = code
    return true
end
 
function UILabelEx:changeFontSize(code)
    if not code then return false end
    if code <= 0 then code = self._defaultFontSize end
    self._currentFontSize = code
    return true
end
 
function UILabelEx:progressImage(code)
    if not code then return end
    print("progress image:"..code)
    local image = t_image[code]
    if not image then return false end
    cc.SpriteFrameCache:getInstance():addSpriteFrames(image.plist)
    local uiImage = ccui.ImageView:create() 
    uiImage:loadTexture(image.name, ccui.TextureResType.plistType)
    uiImage:setVisible(self._show_fast)
    self:addChild(uiImage, 100)
 
    if uiImage:getContentSize().width > self._width then
        print("too big width, scaled")
        uiImage:setScale(self._width / uiImage:getContentSize().width)
    end
    if self._renderPos.x + uiImage:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(uiImage, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + uiImage:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > uiImage:getContentSize().height) and self._renderPos.maxHeight or uiImage:getContentSize().height
 
    self._images[#self._images + 1] = uiImage
 
    self._contents[#self._contents + 1] = uiImage
    self._currentLine[#self._currentLine + 1] = uiImage
    return true
end
 
function UILabelEx:progressBtn(str)
    return false
end
 
function UILabelEx:progressEmoji(code)  
    if not code then return false end
    print("progress emoji:"..code)
    local animation = t_animation[code]
    if not animation then return false end
    ccs.ArmatureDataManager:getInstance():addArmatureFileInfo(animation.json)
    local armature = ccs.Armature:create(animation.name)
    armature:getAnimation():play("effect")
    armature:setVisible(self._show_fast)
    self:addChild(armature, 100)
 
    if armature:getContentSize().width > self._width then
        print("too big width, scaled")
        armature:setScale(self._width / armature:getContentSize().width)
    end
    if self._renderPos.x + armature:getContentSize().width > self._width then
        self:nextLine()
    end
 
    self:setElemPosition(armature, self._renderPos.x, self._renderPos.y)
    self._renderPos.x = self._renderPos.x + armature:getContentSize().width
    self._renderPos.maxHeight = (self._renderPos.maxHeight > armature:getContentSize().height) and self._renderPos.maxHeight or armature:getContentSize().height
 
    self._armatures[#self._armatures + 1] = armature
 
    self._contents[#self._contents + 1] = armature
    self._currentLine[#self._currentLine + 1] = armature
    return true
end
 
function UILabelEx:setElemPosition(elem, _x, _y)
    elem:ignoreAnchorPointForPosition(false)
    elem:setAnchorPoint(cc.p(0,0))
    if _x then
        local x = _x + elem:getContentSize().width * elem:getAnchorPoint().x
        elem:setPositionX(x)
    end
    if _y then
        local y = _y + elem:getContentSize().height * elem:getAnchorPoint().y
        elem:setPositionY(-y)
    end
end
 
function UILabelEx:nextLine()
    -- 调整当前行元素高度，适应maxHeight
    for k, v in pairs(self._currentLine) do
        self:setElemPosition(v, nil, self._renderPos.y + self._renderPos.maxHeight)
    end
    self._renderPos.x = 0
    self._renderPos.y = self._renderPos.y + self._renderPos.maxHeight + self._lineHeight / 2
    self._renderPos.maxHeight = self._defaultFontSize
    self._currentLine = {}
end
 
function UILabelEx:scheduleShow(dt)
    if self._showSeq < #self._contents then     
        self._showSeq = self._showSeq + 1
        self._contents[self._showSeq]:setVisible(true)
    end
end
 
return UILabelEx
```

