/**
 * namespace map
 */
(function(){

	var TiledTile = function(gid, pos, width, height, tileset){};

	var TiledMap = function(config){
		this._initTiledMap(config);
	};

	TiledMap.properties = {
		__initTiledMap: function(config){
			this.createAttrs();
            
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'TiledMap';
            this._setDrawFuncs();
		},
		drawFunc: function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0, 0, 30, 30);
			context.closePath();
			canvas.stroke(this);
		},
	};

	Kinetic.Global.extend(TiledMap, Kinetic.Shape);
	
	window.TiledMap = TiledMap;

})();