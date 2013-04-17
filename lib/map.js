/**
 * namespace map
 */
(function(){

	var TiledTile = function(gid, pos, width, height, tileset){};

	var TiledMap = function(config){
		this._initTiledMap(config);
	};

	TiledMap.prototype = {
		_initTiledMap: function(config){
			this.createAttrs();
            
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'TiledMap';
            this._setDrawFuncs();
		},
		drawFunc: function(canvas){
			var context = canvas.getContext();
			context.drawImage(resourceLoader.get('new'), 0, 0, 32, 32, this.getX(), this.getY(), 32, 32);
		}
	};

	Kinetic.Global.extend(TiledMap, Kinetic.Shape);
	
	window.TiledMap = TiledMap;

})();