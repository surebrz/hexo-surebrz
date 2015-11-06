title: 意义不明
date: 2015-10-29 20:05:52
tags: js
categories: RMMV
---


	/*:
	 * @plugindesc 不是很优雅的导出实际地图png，请用chrome增加参数--disable-web-security --allow-file-access-from-files后打开index.html
	 * @author SureBrz
	 *
	 * @param mapId
	 * @desc 要转换的地图id
	 * @default 1
	*/

	(function() {

		var parameters = PluginManager.parameters('SaveMapImg');
		var mapId = parameters['mapId'] || 1;

		// = =||
		Graphics.isFontLoaded = function(name) {
			return true;
		};

		// 新增 绘制所有tile到bitmap
		Tilemap.prototype._paintAllMapTiles = function(bitmap, startX, startY) {
			var tileCols = this._mapWidth;
			var tileRows = this._mapHeight;
			for (var y = 0; y < tileRows; y++) {
				for (var x = 0; x < tileCols; x++) {
					this._paintActualTiles(bitmap, x, y);
				}
			}
		};
		// 新增 绘制一个tile到bitmap
		Tilemap.prototype._paintActualTiles = function(bitmap, x, y) {
			var tableEdgeVirtualId = 10000;
			var mx = x;
			var my = y;
			var dx = mx * this._tileWidth;
			var dy = my * this._tileHeight;
			var tileId0 = this._readMapData(mx, my, 0);
			var tileId1 = this._readMapData(mx, my, 1);
			var tileId2 = this._readMapData(mx, my, 2);
			var tileId3 = this._readMapData(mx, my, 3);
			var shadowBits = this._readMapData(mx, my, 4);
			var upperTileId1 = this._readMapData(mx, my - 1, 1);
			var lowerTiles = [];
			var upperTiles = [];

			if (this._isHigherTile(tileId0)) {
				upperTiles.push(tileId0);
			} else {
				lowerTiles.push(tileId0);
			}
			if (this._isHigherTile(tileId1)) {
				upperTiles.push(tileId1);
			} else {
				lowerTiles.push(tileId1);
			}

			lowerTiles.push(-shadowBits);

			if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
				if (!Tilemap.isShadowingTile(tileId0)) {
					lowerTiles.push(tableEdgeVirtualId + upperTileId1);
				}
			}

			if (this._isOverpassPosition(mx, my)) {
				upperTiles.push(tileId2);
				upperTiles.push(tileId3);
			} else {
				if (this._isHigherTile(tileId2)) {
					upperTiles.push(tileId2);
				} else {
					lowerTiles.push(tileId2);
				}
				if (this._isHigherTile(tileId3)) {
					upperTiles.push(tileId3);
				} else {
					lowerTiles.push(tileId3);
				}
			}


			for (var i = 0; i < lowerTiles.length; i++) {
				var lowerTileId = lowerTiles[i];
				if (lowerTileId < 0) {
					this._drawShadow(bitmap, shadowBits, dx, dy);
				} else if (lowerTileId >= tableEdgeVirtualId) {
					this._drawTableEdge(bitmap, upperTileId1, dx, dy);
				} else {
					this._drawTile(bitmap, lowerTileId, dx, dy);
				}
			}

			for (var j = 0; j < upperTiles.length; j++) {
				this._drawTile(bitmap, upperTiles[j], dx, dy);
			}
		};
		// 追加
		var _Scene_Boot_prototype_create = Scene_Boot.prototype.create;
		Scene_Boot.prototype.create = function() {
			DataManager.loadMapData(mapId);
			this.mapBitmapsLoaded = false;
			_Scene_Boot_prototype_create.call(this);
		};

		// 重写
		Scene_Boot.prototype.isReady = function() {
			if (Scene_Base.prototype.isReady.call(this)) {
				return DataManager.isDatabaseLoaded() && DataManager.isMapLoaded() && this.isGameFontLoaded();
			} else {
				return false;
			}
		};

		// 重写
		Scene_Boot.prototype.start = function() {
			DataManager.setupNewGame();
			$gameMap.setup(mapId);
			this.spriteset = new Spriteset_Map();
		};

		// 新增
		Scene_Boot.prototype.update = function() {
			console.log("Scene_Boot.update");
			if (!this.mapBitmapsLoaded && ImageManager.isReady()) {
				// 保存图片
				var tilemap = this.spriteset._tilemap;
				var width = tilemap._tileWidth * tilemap._mapWidth; //this._width;
				var height = tilemap._tileHeight * tilemap._mapHeight; //this._height;
				var bitmap = new Bitmap(width, height);
				tilemap._paintAllMapTiles(bitmap, 0, 0);
				window.location.href = bitmap.context.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
				this.mapBitmapsLoaded = true
			}
			Scene_Base.prototype.update.call(this);
		};

	}());

放进plugins里，用法参注释。