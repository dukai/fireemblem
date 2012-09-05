var TiledTile = function(gid, pos, width, height, tileset){
	
	TiledTile.parentConstructor.call(this, pos, width, height);

	this._draw = function(context){
		context.drawImage(tileset.getImage(), tileset.getSourceX(gid), tileset.getSourceY(gid) , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
	};
};

extend(TiledTile, EntityObject);

var TiledLayer = function(pos, name, widthCount, heightCount, tileWidth, tileHeight, tilesData, tilesetMgr, visible){
	this.name = name;
	this.widthCount = widthCount;
	this.heightCount = heightCount;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.width = this.widthCount * this.tileWidth;
	this.height = this.heightCount * this.tileHeight;
	this.tilesData = tilesData;
	this.tilesetMgr = tilesetMgr;
	this.visible = visible;
	this.tiledObjects = [];

	this.canvas = window.document.createElement('canvas');

	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.context = this.canvas.getContext('2d');

	this.initTiles = function(){
		for(var i = 0, len = tilesData.length; i < len; i++){

			var x = i % this.widthCount;
			var y = ~~(i / this.widthCount);
			var gid = tilesData[i];
			if(gid > 0){
				var tileset = tilesetMgr.getTileset(gid);
				var tilePos = new Vector(x * tileset.tileWidth, y * tileset.tileHeight);

				var tiledObj = new TiledTile(gid, tilePos, tileset.tileWidth, tileset.tileHeight, tileset);
				tiledObj.draw(this.context);
				this.tiledObjects.push(tiledObj);
			}

		}
	}
	if(this.visible){
		this.initTiles();
	}

	this.setVisible = function(visible){
		if(visible && this.tiledObjects.legnth === 0){
			this.initTiles();
		}

		this.visible = visible;
	};

	TiledLayer.parentConstructor.call(this, pos, this.width, this.height);

	this._draw = function(context){
		if(!this.visible){
			return false;
		}

		context.drawImage(this.canvas, this.position.x, this.position.y);
	};
};

extend(TiledLayer, EntityObject);

var Tileset = function(name, firstgid, tileWidth, tileHeight, totalWidth, totalHeight){
	this.name = name;
	this.firstgid = firstgid;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.totalWidth = totalWidth;
	this.totalHeight = totalHeight;

	this.widthCount = ~~(totalWidth / tileWidth);
	this.heightCount = ~~(totalHeight / tileHeight);

	this.totalCount = this.widthCount * this.heightCount;

	this.lastgid = this.firstgid + this.totalCount - 1;


	this.isContain = function(gid){
		if(gid >= this.firstgid && gid <= this.lastgid){
			return true;
		}

		return false;
	};

	this.getImage = function(){
		return MainApp.resourceLoader.get(this.name);
	}

	this.getSourceX = function(gid){
		return (gid - this.firstgid) % this.widthCount * this.tileWidth;
	}

	this.getSourceY = function(gid){
		return parseInt(((gid - this.firstgid) / this.widthCount)) * this.tileHeight;
	}
};

var TilesetManager = function(){

	var tilesets = [];


	this.add = function(tileset){
		tilesets.push(tileset);

		tileset.firstgid
		tileset.lastgid
	};

	this.remove = function(tileset){
		tilesets.splice(tilesets.indexOf(tileset), 1);
	};

	this.getTileset = function(gid){
		for(var i = 0, len = tilesets.length; i < len; i++){
			if(tilesets[i].isContain(gid)){
				return tilesets[i];
			}
		}
	}
};

var TiledLayerManager = function(){
	var layers = [];

};
/**
 * An common TiledObject, for player and so on
 * @param {String} name
 * @param {Vector} pos
 * @param {Image} img
 * @param {int} width
 * @param {int} height
 * @param {enum} animType
 * @param {int} split
 * @constructor
 */
var TiledObject = function(name, pos, img, width, height, animType, split){
	//TODO: adjust the animType and process the offsetX and offsetY
	var offsetX = (img.width - width) / 2;
	var offsetY = (split - height);
	
	pos.x -= offsetX;
	pos.y -= offsetY;  
	
	TiledObject.parentConstructor.call(this, pos, img, animType, split, new Vector(0, 0));
};

extend(TiledObject, Sprite);


/**
 * A tiled object entities layer
 * @param {Vector} pos
 * @param {string} name
 * @param {int} width
 * @param {int} height
 * @constructor
 */
var TiledObjectLayer = function(pos, name, width, height){
	this.name = name;
	this.width = width;
	this.height = height;
	this.objects = [];

	this.canvas = window.document.createElement('canvas');

	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.context = this.canvas.getContext('2d');

	TiledObjectLayer.parentConstructor.call(this, pos, width, height);
	/**
	 * Add a TiledObject to this layer
	 * @param {TiledObject} obj
	 */
	this.add = function(obj){
		this.objects.push(obj);
	};

	this.remove = function(obj){
		this.objects.splice(this.objects.indexof(obj), 1);
	}

	this._draw = function(context){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i = 0, len = this.objects.length; i < len; i++){
			this.objects[i].draw(this.context);
		}

		context.drawImage(this.canvas, this.position.x, this.position.y);
	};
};

extend(TiledObjectLayer, EntityObject);

var TiledMap = function(tmxDoc, viewport){

	this.viewport = viewport;
	this.tiledLayers = [];
	this.tilesetMgr = new TilesetManager();
	this.mapInfo  = null;

	this.getMapInfo = function(){
		var mapDom = tmxDoc.getElementsByTagName('map')[0];

		var info = {};

		info.widthCount = parseInt(mapDom.getAttribute('width'));
		info.heightCount = parseInt(mapDom.getAttribute('height'));
		info.tileWidth = parseInt(mapDom.getAttribute('tilewidth'));
		info.tileHeight = parseInt(mapDom.getAttribute('tileheight'));
		info.width = info.widthCount * info.tileWidth;
		info.height = info.heightCount * info.tileHeight;
		this.mapInfo = info;
	}


	this.parseAllLayer = function(){
		var mapDom = tmxDoc.getElementsByTagName('map')[0];

		var children = mapDom.childNodes;
		for(var i = 0, len = children.length; i < len; i++){
			var node = children[i];

			if(node.nodeType === 3){
				continue;
			}

			switch(node.tagName.toLowerCase()){
				case TiledMap.OBJ_TYPE.TILESET: {
					var tileset = this.getTileset(node);
                    this.tilesetMgr.add(tileset);
					break;
				}

				case TiledMap.OBJ_TYPE.LAYER: {
                    var layer = this.getTiledLayer(node);
					this.tiledLayers.push(layer);
                    break;
				}

				case TiledMap.OBJ_TYPE.OBJECTGROUP: {
					var objectgroup = this.getObjectGroup(node);
					this.tiledLayers.push(objectgroup);
					break;
				}
			}
		}
	};

	this.getTileset = function(node){
		var parser = util.DOMParser(node);
		var img = parser.getElementsByTagName('image')[0];
        var imgParser = util.DOMParser(img);

        return new Tileset(parser.attr('name'),
			parser.intAttr('firstgid'),
			parser.intAttr('tilewidth'),
			parser.intAttr('tileheight'),
			imgParser.intAttr('width'),
			imgParser.intAttr('height'));
	};

    this.getTiledLayer = function(node){
        var parser = util.DOMParser(node);
        var data = parser.getFirstElement();
	    var tileArray = util.Base64.decodeAsArray(data.textContent.trim(), 4);
        var visible = parser.attr('visible');
		visible = visible === undefined ? true : (visible === '0' ? false : true);
	    if(parser.attr('name') === 'terrain'){
		    return new CursorPointerLayer(
			    this.position,
			    parser.attr('name'),
			    parser.intAttr('width'),
			    parser.intAttr('height'),
			    this.mapInfo.tileWidth,
			    this.mapInfo.tileHeight,
			    tileArray
		    );
	    }else{
            return new TiledLayer(
		        this.position,
	            parser.attr('name'),
	            parser.intAttr('width'),
	            parser.intAttr('height'),
	            this.mapInfo.tileWidth,
	            this.mapInfo.tileHeight,
	            tileArray,
	            this.tilesetMgr,
	            visible
            );
	    }
    };

	this.getObjectGroup = function(node){
		var parser = util.DOMParser(node);
		var objectGroup = new TiledObjectLayer(
			this.position,
			parser.attr('name'),
			this.mapInfo.width,
			this.mapInfo.height
		);
		var objects = parser.getElementsByTagName('object');

		for(var i = 0, len = objects.length; i < len; i++){
			var tiledObject = this.getTiledObject(objects[i]);
			objectGroup.add(tiledObject);
		}

		return objectGroup;
	};

	this.getTiledObject = function(node){
		var parser = util.DOMParser(node);
		var animType, image, split;


		var properties = parser.getElementsByTagName('property');
		for(var i = 0, len = properties.length; i < len; i++){
			var property = util.DOMParser(properties[i]);
			var name = property.attr('name');
			switch(name){
				case 'anim_type':{
					animType = Sprite.ANIM_TYPE[property.attr('value')];
					break;
				}

				case 'image': {
					image = MainApp.resourceLoader.get(property.attr('value'));
					break;
				}

				case 'split': {
					split = property.intAttr('value');
					break;
				}

			}
		}

		var tiledObject = new TiledObject(parser.attr('name'),
			new Vector(parser.intAttr('x'), parser.intAttr('y')),
			image,
			parser.intAttr('width'),
			parser.intAttr('height'),
			animType,
			split
		);

		return tiledObject;
	}


	this.getMapInfo();

	TiledMap.parentConstructor.call(this, this.viewport.position, this.mapInfo.width, this.mapInfo.height);

	this.parseAllLayer();

	this.viewport.setRealX(this.mapInfo.width);
	this.viewport.setRealY(this.mapInfo.height);



	this._draw = function(context){
		for(var i = 0, len = this.tiledLayers.length; i < len; i++){
			var layer = this.tiledLayers[i];
			layer.draw(context);
			//context.drawImage(layer.canvas, this.position.x, this.position.y);
		}
	}
}


extend(TiledMap, EntityObject);
/**
 * TiledMap object types enum
 * @type {Enum}
 */
TiledMap.OBJ_TYPE = {
	TILESET: 'tileset',
	LAYER: 'layer',
	OBJECTGROUP: 'objectgroup'
}
