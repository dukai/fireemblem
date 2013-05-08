var AbstractView = function(options){
	this._initAbstractView(options);
}

AbstractView.prototype = {
	_initAbstractView: function(options){
		this.attrs = {};
		for(var i in options){
			this.attrs[i] = options[i];
		}
	},
	/**
	 *获取实际的坐标对象包含X，Y
	 * @param {Number} offsetX
	 * @param {Number} offsetY
	 * @return {JSON} {X, Y} 
	 */
	getRealPos: function(offsetX, offsetY){
		return {x: this.getX() * 32 + offsetX, y: this.getY() * 32 + offsetY}
	},
	/**
	 *实际的坐标X
	 * @param {Number} offset 偏移量
	 * @return {Number} 坐标值 
	 */
	getRealX: function(offset){
		return this.getRealPos(this.getX() , offset);
	},
	/**
	 *实际的坐标Y
	 * @param {Number} offset 偏移量
	 * @return {Number} 坐标值  
	 */
	getRealY: function(offset){
		return this.getRealPos(this.getY() , offset);
	},
	
	getRealPos: function(c, offset){
		return c * 32 + offset;
	},
	
	getX : function(){
		return this.attrs.x;
	},
	
	getY: function(){
		return this.attrs.y;
	},
	
	getCoordinate: function(x, y, offsetX, offsetY){
		var posInLayer = {
			x: x - offsetX,
			y: y - offsetY
		}
		var coordinate = {
			x: ~~(posInLayer.x / 32),
			y: ~~(posInLayer.y / 32)
		};
		
		return coordinate;
	}
	
	
};
