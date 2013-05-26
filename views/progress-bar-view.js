/**
 * progress bar view for exp bar ,hp bar and so on 
 */

var ProgressBarView = function(options){
	this._initProgressBarView(options);
}

ProgressBarView.prototype = {
	_initProgressBarView: function(options){
		Kinetic.Group.call(this, options);
		var bg = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: 104,
			height:6,
			fill: this.getFill(),
			opacity: .5
		});
		
		var bar = new Kinetic.Rect({
			x: 2,
			y: 2,
			width:100,
			height: 2,
			fill: this.getFill()
		});
		
		this.add(bg);
		this.add(bar);
	}
};

Kinetic.Global.extend(ProgressBarView, Kinetic.Group);
Kinetic.Node.addGetterSetter(ProgressBarView, 'fill');