var SoliderView = function(options){
	this._initSoliderView(options);
};

/**
 *options: [animations : json ,moveRange : int, atkRange: int] 
 */

SoliderView.prototype = {
	_initSoliderView: function(options){
		AbstractView.call(this, options);
		this.bodyImageName = 'soldier';
		this.offsetX = -8;
		this.offsetY = -16;
		this.defaultAnimation = 'idle';
		this.frameRate = 8;
		this.index = 0;
		
		this.status = SoliderView.STATUS.NORMAL;
		
		this.body = new Kinetic.Sprite({
			x: this.getRealPos(this.getModel().getX(), this.offsetX),
			y: this.getRealPos(this.getModel().getY(), this.offsetY),
			image: this.getImage(),
			animation: this.defaultAnimation,
			animations: this.getAnimation(),
			frameRate: this.frameRate,
			index: this.index,
			drawHitFunc: function(canvas){
				var context = canvas.getContext();
				context.beginPath();
				context.rect(8, 16, 32, 32);
				context.closePath();
				canvas.fillStroke(this);
			}
		});
		
		this.moveRangeGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			name: 'solider_move_range_group'
		});
		
		this.atkRangeGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			name: 'solider_atk_range_group'
		});
		
		this.popMenuGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			name: 'solider_pop_menu_group'
		});
		this.getTolayer().add(this.moveRangeGroup);
		this.getTolayer().add(this.atkRangeGroup);
		this.getTolayer().add(this.body);
		//this.getTolayer().add(this.popMenuGroup);
		this.body.start();
		this._initSoliderViewEvents();
	},
	
	_initSoliderViewEvents: function(){
		var self =  this;
		//this.body.on('click', function(){
			//self.soliderActive();
		//});
	},
	
	flip: function(value){
		if(value == 'right'){
			this.body.setScale(1, 1);
			this.body.setOffset(0, 0);
		}
		
		if(value == 'left'){
			this.body.setScale(-1, 1);
			this.body.setOffset(48, 0);
		}
	},
	
	/**
	 * 点击士兵动作 
	 */
	soliderActive: function(){
		switch(this.status){
			case SoliderView.STATUS.NORMAL:
				this.showMoveRange();
				break;
		}
		
	},
	/**
	 *显示可移动范围 
	 */
	showMoveRange: function(){
		this.status = SoliderView.STATUS.ACTIVE;
		this.moveCoordinateList = this.getModel().getMoveNodeList(this.getHitMap());
		var self = this;
		this.moveRange = new RangeView({
			x: 0,
			y: 0,
			rangeList: this.moveCoordinateList,
			fill: 'rgba(0, 100, 0, .5)'
		});
		var layer  = this.getTolayer();
		var offsetX = layer.getX();
		var offsetY = layer.getY();
		/*
		this.moveRange.on('click', function(e){
			var mpos = {x: e.layerX, y: e.layerY};
			var coordinate = self.getCoordinate(mpos.x, mpos.y, offsetX, offsetY);
			self.gotoClickPosition(coordinate);
		});
		*/
		this.moveRangeGroup.add(this.moveRange);
	},
	/**
	 *移动到选中的位置
	 * @param {JSON} coordinate 坐标，相对于图层 
	 */
	gotoClickPosition: function(coordinate){
		var self = this;
		
		this.bodyGoto(coordinate.x, coordinate.y, function(){
			self.moveRange.remove();
			self.showOperationMenu(coordinate);
		});
	},
	/**
	 * 重置位置 
	 */
	restorePosition: function(){
		this.status = SoliderView.STATUS.NORMAL;
		this.moveRange && this.moveRange.remove();
		this.atkRange && this.atkRange.remove();
		this.status = SoliderView.STATUS.NORMAL;
		this.bodyGoto(this.getModel().getX(), this.getModel().getY());
	},
	/**
	 *显示菜单 
	 */
	showOperationMenu: function(coordinate){
		var self = this;
		this.popMenu = new PopMenuView({
			x: this.getRealPos(coordinate.x , 42), 
			y: this.getRealPos(coordinate.y , 0),
			itemsList: [
				{text: '攻击', callback: function(){
					self.getModel().setX(coordinate.x);
					self.getModel().setY(coordinate.y);
					self.showAtkRange();
				}}, 
				{text: '待机', callback: function(){
					//TODO: do nothing
					self.getModel().setX(coordinate.x);
					self.getModel().setY(coordinate.y);
					self.awaiting();
					
				}}, 
				{text: '取消', callback: function(){
					//TODO: go back to the last position
					self.bodyGoto(self.getModel().getX(), self.getModel().getY());
					self.status = SoliderView.STATUS.NORMAL;
				}}
			]
		});
		
		this.popMenuGroup.add(this.popMenu);
	},
	/**
	 * 显示可以攻击的范围 
	 */
	showAtkRange: function(){
		this.status = SoliderView.STATUS.ATK;
		var atkList = this.atkCoordinateList = this.getModel().getAtkNodeList(this.getHitMap());
		this.atkRange = new RangeView({
			x: 0,
			y: 0,
			rangeList: atkList,
			fill: 'rgba(255, 000, 0, .4)'
		});
		/*
		this.atkRange.on('click', function(e){
			
		});
		*/
		this.atkRangeGroup.add(this.atkRange);
	},
	
	/**
	 * 
	 */
	awaiting: function(){
		this.status = SoliderView.STATUS.WAITING;
		this.body.stop();
	},
	
	/**
	 *移动到指定坐标 
	 * @param {int} x
	 * @param {int} y
	 * @param {function} callback
	 */
	bodyGoto: function(x, y, callback){
		this.body.transitionTo({
			x: this.getRealPos(x , this.offsetX),
			y: this.getRealPos(y , this.offsetY),
			duration: .2,
			callback: function(){
				callback && callback();
			}
		});
	},
	/**
	 *判断是否在坐标列表中 
 	 * @param {Object} coordinate
	 */
	isInCoordinateList: function(coordinate){
		var list;
		if(this.status == SoliderView.STATUS.ACTIVE){
			list = this.moveCoordinateList;
		}else if(this.status == SoliderView.STATUS.ATK){
			list = this.atkCoordinateList;
		}else{
			return false;
		}
		
		for(var i = 0, len = list.length; i < len; i++){
			if(list[i].x == coordinate.x && list[i].y == coordinate.y){
				return true;
			}
		}
		
		return false;
		
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
	},
	
	getTolayer: function(){
		return this.attrs.tolayer;
	},
	
	getHitMap: function(){
		return this.attrs.hitmap;
	},
	
	getModel: function(){
		return this.attrs.model;
	}
	
};

extend(SoliderView, AbstractView);

SoliderView.STATUS = {
	NORMAL: 0,
	ACTIVE: 1,
	WAITING: 2,
	ATK: 3
}
