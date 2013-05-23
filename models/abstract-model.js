var AbstractModel = function(options){
	this._initAbstractModel(options);
};

AbstractModel.prototype = {
	_initAbstractModel: function(options){
		this.attrs = {};
		
		for(var i in options){
			this.attrs[i] = options[i];
		}
		
		if(!this.getName()){
			this.setName(util.getName(true));
		}
	},
	
	/**
	 * 获取移动范围
	 * @param {Object} target {x, y}
	 * @param {int} range 移动范围
	 * @param {HitMap} hitmap 碰撞地图 
	 * @param {JSON} enemyCoordinates 敌人位置
	 */
	getRange: function(target, range, hitmap, enemyCoordinates){
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
						if(hitmap.getPassable(x, y) && !enemyCoordinates[x.toString() + y.toString()]){
							list.push({x: x, y: y});
						}
					}
				}
			}
		}
		return list;
	},
	
	/**
	 * 获取攻击范围
	 * @param {Object} target {x, y}
	 * @param {int} range 范围
	 * @param {HitMap} hitmap 碰撞地图 
	 * @param {JSON} enemyCoordinates 敌人位置
	 */
	getAttackRange: function(target, range, hitmap, enemyCoordinates){
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
						if(hitmap.getPassable(x, y) && enemyCoordinates[x.toString() + y.toString()]){
							list.push({x: x, y: y});
						}
					}
				}
			}
		}
		return list;
	},
	
	attack: function(model){
		this.getPerson().attack(model.getPerson());
	}
};

util.addGetterSetter(AbstractModel, 'x');
util.addGetterSetter(AbstractModel, 'y');
util.addGetterSetter(AbstractModel, 'name');
util.addGetterSetter(AbstractModel, 'person');
