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
