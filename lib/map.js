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

		}
	};

	Kinetic.Global.extend(TiledMap, Kinetic.Shape);

})();