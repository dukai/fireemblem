/**
 * member move or attack range view 
 * @author DK
 * @date 2013/5/7 23:32 
 */


var RangeView = function(options){
	this._initRangeView(options);
};

RangeView.prototype = {
	_initRangeView: function(options){
		this.createAttrs();
		Kinetic.Shape.call(this, options);
		this.shapeType = 'RangeView';
		this.tiledWidth = 32;
		this.tiledHeight = 32;
		this._setDrawFuncs();
	},
	
	drawFunc: function(canvas){
		var context = canvas.getContext();
		var rangeList = this.getRangeList();
		context.beginPath();
		for(var i = 0, len = rangeList.length; i < len; i++){
			//n = {x: x, y: y}
			var n = rangeList[i];
			
            context.rect(n.x * 32, n.y * 32, this.tiledWidth, this.tiledHeight);
		}
		context.closePath();
        canvas.fillStroke(this);
	}
};

Kinetic.Global.extend(RangeView, Kinetic.Shape);
/**
 * get or set range node list
 */
Kinetic.Node.addGetterSetter(RangeView, 'rangeList');