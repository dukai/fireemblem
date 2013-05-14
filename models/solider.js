var Solider = function(options){
	this._initSolider(options);
}

Solider.prototype = {
	
	_initSolider: function(options){
		AbstractModel.call(this, options);
		
		this.moveRangeList = [];
		this.atkRangeList = [];
		this.menuList = [
			'move', 'attack', 'wait'
		];
	},
	
	getMoveNodeList: function(hitmap, enemyCoordinates){
		return this.getRange({x: this.getX(), y: this.getY()}, this.getMoveRange(), hitmap, enemyCoordinates);
	},
	
	getAtkNodeList: function(hitmap, enemyCoordinates){
		return this.getAttackRange({x: this.getSecCoordinate().x, y: this.getSecCoordinate().y}, this.getAtkRange(), hitmap, enemyCoordinates);
	},
	
	getMoveRange: function(){
		return this.attrs.moveRange;
	},
	
	getAtkRange: function(){
		return this.attrs.atkRange;
	},
	
	setSecCoordinate: function(coordinate){
		this.secCoordinate = coordinate;
	},
	
	getSecCoordinate: function(){
		return this.secCoordinate;
	},
	
	updatePosition: function(){
		if(this.secCoordinate){
			this.setX(this.secCoordinate.x);
			this.setY(this.secCoordinate.y);
		}
	}
	
	
};

extend(Solider, AbstractModel);
