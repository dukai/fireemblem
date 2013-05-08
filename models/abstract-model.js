var AbstractModel = function(options){
	this._initAbstractModel(options);
};

AbstractModel.prototype = {
	_initAbstractModel: function(options){
		this.attrs = {};
		
		for(var i in options){
			this.attrs[i] = options[i];
		}
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
	},
	
	getX: function(){
		return this.attrs.x;
	},
	
	getY: function(){
		return this.attrs.y;
	},
	
	setX: function(value){
		this.attrs.x = value;
	},
	
	setY: function(value){
		this.attrs.y = value;
	}
	
};
