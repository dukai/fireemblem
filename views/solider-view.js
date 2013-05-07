var SoliderView = function(options){
	this._initSoliderView(options);
};

/**
 *options: [animations : json ,moveRange : int, atkRange: int] 
 */

SoliderView.prototype = {
	_initSoliderView: function(options){
		AbstractView.call(this, options);
		this.spriteImageName = 'soldier';
		this.offsetX = -8;
		this.offsetY = -16;
		this.defaultAnimation = 'idle';
		this.frameRate = 8;
		this.index = 0;
		
		this.sprite = new Kinetic.Sprite({
			x: this.getRealX(this.offsetX),
			y: this.getRealY(this.offsetY),
			image: this.getImage(),
			animation: this.defaultAnimation,
			animations: this.getAnimation(),
			frameRate: this.frameRate,
			index: this.index
		});
	},
	
	getImage: function(){
		return this.attrs.image;
	},
	
	getAnimation: function(){
		return {
			idle: [
				{x: 0, y: 0, width: 48, height: 48},
				{x: 0, y: 48, width: 48, height: 48},
				{x: 0, y: 96, width: 48, height: 48},
				{x: 0, y: 144, width: 48, height: 48},
				{x: 0, y: 192, width: 48, height: 48},
				{x: 0, y: 240, width: 48, height: 48},
				{x: 0, y: 288, width: 48, height: 48},
				{x: 0, y: 336, width: 48, height: 48}
			],
			atk: [
				{x: 48, y: 0, width:80, height:52},
				{x: 48, y: 52, width:80, height:52},
				{x: 48, y: 104, width:80, height:52},
				{x: 48, y: 156, width:80, height:52},
				{x: 48, y: 208, width:80, height:52},
				{x: 48, y: 260, width:80, height:52},
				{x: 48, y: 312, width:80, height:52}
			],
			dead: [
				{x: 128, y: 0, width:80, height:64},
				{x: 128, y: 64, width:80, height:64},
				{x: 128, y: 128, width:80, height:64},
				{x: 128, y: 192, width:80, height:64},
				{x: 128, y: 256, width:80, height:64},
				{x: 128, y: 320, width:80, height:64}
			]
		};
	}
};

extend(SoliderView, AbstractView);
