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
	
	getMoveNodeList: function(hitmap){
		return this.getRange({x: this.getX(), y: this.getY()}, this.getMoveRange(), hitmap);
	},
	
	getAtkNodeList: function(hitmap){
		return this.getRange({x: this.getX(), y: this.getY()}, this.getAtkRange(), hitmap);
	},
	
	getMoveRange: function(){
		return this.attrs.moveRange;
	},
	
	getAtkRange: function(){
		return this.attrs.atkRange;
	}
};

extend(Solider, AbstractModel);
