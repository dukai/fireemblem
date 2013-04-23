/**
 * namespace map
 */
(function(){
	/**
	 * 图块
	 */
	var TiledTile = function(gid, pos, width, height, tileset){};
	/**
	 * 图块集
	 *@param options [name, firstgid, tileWidth, tileHeight, totalWidth, totalHeight]
	 */
	var TileSet = function(options){
		this.options = options;
		this.columns = ~~(this.options.totalWidth / this.options.tileWidth);
		this.rows = ~~(this.options.totalHeight / this.options.tileHeight);
		
		this.total = this.rows * this.columns;
		this.lastgid = this.options.firstgid + this.total - 1;
	};
	
	TileSet.prototype = {
		/**
		 * 判断gid是否存在于当前的集合中
		 */
		isContain: function(gid){
			return gid >= this.options.firstgid && gid <= this.lastgid;
		}, 
		getImage: function(){
			
		},
		
		getSourceX: function(gid){
			return parseInt((gid - this.options.firstgid) % this.columns) * this.options.tileWidth;
		},
		getSourceY: function(gid){
			return parseInt(((gid - this.options.firstgid) / this.columns)) * this.options.tileHeight;
		}
	};
	
	var tilesetManager = {
		tilesets : [],
		add: function(tileset){
			this.tilesets.push(tileset);
		},
		remove: function(tileset){
			this.tilesets.splice(this.tilesets.indexOf(tileset), 1);
		},
		get: function(gid){
			var tilesets = this.tilesets;
			for(var i = 0, len = tilesets.length; i < len; i++){
				if(tilesets[i].isContain(gid)){
					return tilesets[i];
				}
			}
		}
	};
	
	/**
	 * 地图中的层
	 *@param options [name, rows, columns, tileWidth, tileHeight, tilesData, visible]
	 */
	var TiledLayer = function(options){
		this.options = options;
		this.width = options.columns * options.tileWidth;
		this.height = options.rows * options.tileHeight;
		
		this.canvas = util.createCanvas(this.width, this.height);
	};
	TiledLayer.prototype = {
		initTiles: function(){},
	};
	/**
	 * Tiled Map Class
	 */
	var TiledMap = function(config){
		this._initTiledMap(config);
	};

	TiledMap.prototype = {
		_initTiledMap: function(config){
			this.createAttrs();
            Kinetic.Shape.call(this, config);
            this.shapeType = 'TiledMap';
			this.tiledLayers = [];
			this.mapDom = this.getTmx().getElementsByTagName('map')[0];
            this._setDrawFuncs();
		},
		drawFunc: function(canvas){
			var context = canvas.getContext();
			context.drawImage(resourceLoader.get('new'), 0, 0, 32, 32, this.getX(), this.getY(), 32, 32);
		},
		/**
		 * 初始化地图信息
		 */
		initMapInfo: function(){
			var mapDom = this.mapDom;
			var info = {};
			info.widthCount = parseInt(mapDom.getAttribute('width'));
			info.heightCount = parseInt(mapDom.getAttribute('height'));
			info.tileWidth = parseInt(mapDom.getAttribute('tilewidth'));
			info.tileHeight = parseInt(mapDom.getAttribute('tileheight'));
			info.width = info.widthCount * info.tileWidth;
			info.height = info.heightCount * info.tileHeight;
			this.mapInfo = info;
		},
		/**
		 * 解析所有图块集，层，图片层，对象层
		 */
		parseAllLayers: function(){
			var mapDom = this.mapDom;
			var children = mapDom.childNodes;
			for(var i = 0, len = children.length; i < len; i++){
				var node = children[i];

				if(node.nodeType === 3){
					continue;
				}

				switch(node.tagName.toLowerCase()){
					case TiledMap.OBJ_TYPE.TILE_SET: {
						this.tilesetMgr.add(this.getTileset(node));
						break;
					}

					case TiledMap.OBJ_TYPE.LAYER: {
						this.tiledLayers.push(this.getLayer(node));
						break;
					}
					
					case TiledMap.OBJ_TYPE.IMAGE_LAYER: {
						this.tiledLayers.push(this.getImageLayer(node));
						break;
					}

					case TiledMap.OBJ_TYPE.OBJECT_GROUP: {
						this.tiledLayers.push(this.getObjectGroup(node));
						break;
					}
				}
			}
			
		},
		getTileSet: function(node){},
		getLayer: function(node){},
		getImageLayer: function(node){},
		getObjectGroup: function(node){}
		
	};

	Kinetic.Global.extend(TiledMap, Kinetic.Shape);
	Kinetic.Node.addGetterSetter(TiledMap, 'tmx');
	Kinetic.Node.addGetterSetter(TiledMap, 'resourceLoader');
	/**
	 * TiledMap object types enum
	 * @type {Enum}
	 */
	TiledMap.OBJ_TYPE = {
		TILE_SET: 'tileset',
		LAYER: 'layer',
		IMAGE_LAYER: 'imagelayer',
		OBJECT_GROUP: 'objectgroup'
	}
	window.TiledMap = TiledMap;
})();