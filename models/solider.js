var Solider = function(){
	this._initSolider();
}

Solider.prototype = {
	
	_initSolider: function(){
		this.x = 0;
		this.y = 0;
		this.moveRange = 4;
		this.atkRange = 1;
		this.moveRangeList = [];
		this.atkRangeList = [];
		this.menuList = [
			'move', 'attack', 'wait'
		];
	},
	/**
	 *获取实际的坐标对象包含X，Y
	 * @param {Number} offsetX
	 * @param {Number} offsetY
	 * @return {JSON} {X, Y} 
	 */
	getRealPos: function(offsetX, offsetY){
		return {x: this.x * 32 + offsetX, y: this.y * 32 + offsetY}
	},
	/**
	 *实际的坐标X
	 * @param {Number} offset 偏移量
	 * @return {Number} 坐标值 
	 */
	getRealX: function(offset){
		return this.x * 32 + offset;
	},
	/**
	 *实际的坐标Y
	 * @param {Number} offset 偏移量
	 * @return {Number} 坐标值  
	 */
	getRealY: function(offset){
		return this.y * 32 + offset;
	},
	
	/**
	 * 获取移动范围
	 * @param {Object} target {x, y}
	 * @param {int} range 移动范围
	 * @param {HitMap} hitmap 碰撞地图 
	 */
	getRange: function(target, range, hitmap){
		var preColumn = target.x - range;
		var nextColumn = target.x + range;
		var preRow = target.y - range;
		var nextRow = target.y + range;
		var list = [];
		for(var x = preColumn; x <= nextColumn; x++){
			for(var y = preRow; y <= nextRow; y++){
				var dx = Math.abs(x - target.x);
				var dy = Math.abs(y - target.y);
				
				if(dx + dy <= range){
					
					if(x !== target.x || y !== target.y){
						if(hitmap.getPassable(x, y)){
							list.push({x: x, y: y});
						}
					}
				}
			}
		}
		return list;
	}

};
