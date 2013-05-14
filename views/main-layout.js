var MainLayout = function(options){
	this._initMainLayout(options);
};

MainLayout.prototype = {
	_initMainLayout: function(options){
		AbstractView.call(this, options);
		var stage = this.getStage();
		var map = this.getMap();
		this.layer = new  Kinetic.Layer({
			draggable: true,
			dragBoundFunc: function(pos){
				var y = pos.y < stage.getHeight() - map.getHeight() ? stage.getHeight() - map.getHeight() : pos.y;
				var x = pos.x < stage.getWidth() - map.getWidth() ? stage.getWidth() - map.getWidth() : pos.x;
				if(y > 0){
					y = 0;
				}
				if(x > 0){
					x = 0;
				}
				return {
					x: x,
					y: y
				}
			}
		});
		
		this.linesGroup = this.getLinesGroup(map.getWidth(), map.getHeight(), map.getRows(), map.getColumns());
		
		this.layer.add(map);
		this.layer.add(this.linesGroup);
		
		stage.add(this.layer);
		
		this.views = [];
		this.activeView = null;
		
		this.popMenuGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			name: 'solider_pop_menu_group'
		});
		this.layer.add(this.popMenuGroup);
		this._initMainLayoutEvents();
	},
	
	_initMainLayoutEvents: function(){
		var self = this;
		
		this.layer.on('click', function(e){
			var offsetX = this.getX();
			var offsetY = this.getY();
			var mpos = {x: e.layerX, y: e.layerY};
			var coordinate = self.getCoordinate(mpos.x, mpos.y, offsetX, offsetY);
			if(self.activeView){
				if(self.activeView.getModel().getX() == coordinate.x && self.activeView.getModel().getY() == coordinate.y){
					return;
				}
				if(self.activeView.status == SoliderView.STATUS.ACTIVE){
					if(self.activeView.isInCoordinateList(coordinate)){
						self.activeView.bodyGoto(coordinate.x, coordinate.y, function(){
							self.showOperationMenu(coordinate);
							self.activeView.moveRange.remove();
						});
						return;
					}
				}
				
				if(self.activeView.status == SoliderView.STATUS.ATK){
					if(self.activeView.isInCoordinateList(coordinate)){
						self.activeView.body.setAnimation("atk");
						self.activeView.getModel().updatePosition();
						self.activeView.atkRange.remove();
						return;
					}
				}
			}
			if(self.activeView && self.activeView.status != SoliderView.STATUS.WAITING){
				self.activeView.restorePosition();
			}
				
			self.popMenu && self.popMenu.remove();
			self.activeView = null;
			
			for(var i = 0, len = self.views.length; i < len; i++){
				var view = self.views[i];
				if(view.getModel().getX() == coordinate.x && view.getModel().getY() == coordinate.y){
					self.activeView = view;
					self.activeView.soliderActive();
				}
			}
		});
	},
	/**
	 *结束回合开始新回合 
	 */
	newRound: function(){
		var self = this;
		for(var i = 0, len = self.views.length; i < len; i++){
			var view = self.views[i];
			(view.status == SoliderView.STATUS.WAITING) && view.body.start();
			view.status = SoliderView.STATUS.NORMAL;
		}
	},
	
	/**
	 *显示菜单 
	 */
	showOperationMenu: function(coordinate, itemsList){
		var self = this;
		var view = this.activeView;
		this.popMenu = new PopMenuView({
			x: this.getRealPos(coordinate.x , 42), 
			y: this.getRealPos(coordinate.y , 0),
			itemsList: [
				{text: '攻击', callback: function(){
					view.getModel().setSecCoordinate(coordinate);
					view.showAtkRange();
				}}, 
				{text: '待机', callback: function(){
					//TODO: do nothing
					view.getModel().setX(coordinate.x);
					view.getModel().setY(coordinate.y);
					view.awaiting();
					
				}}, 
				{text: '取消', callback: function(){
					view.restorePosition();
				}}
			]
		});
		
		this.popMenuGroup.add(this.popMenu);
	},
	/**
	 *获取格线组 
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Object} rows
	 * @param {Object} columns
	 */
	getLinesGroup: function(width, height, rows, columns){
		var linesGroup = new Kinetic.Group({
			x:0,
			y:0
		});
		for(var i = 0; i <= rows; i++){
	
			var y = 32 * i
			var redLine = new Kinetic.Line({
				points: [0, y, width, y],
				stroke: 'white',
				strokeWidth: .2,
				lineCap: 'round',
				lineJoin: 'round'
			});
			
			linesGroup.add(redLine);
		}
		
		for(var i = 0; i <= columns; i++){
	
			var x = 32 * i
			var redLine = new Kinetic.Line({
				points: [x, 0, x, height],
				stroke: 'white',
				strokeWidth: .2,
				lineCap: 'round',
				lineJoin: 'round'
			});
			
			linesGroup.add(redLine);
		}
		
		return linesGroup;
	},
	
	addView: function(view){
		this.views.push(view);
	},
	
	getStage: function(){
		return this.attrs.stage;
	},
	
	getMap: function(){
		return this.attrs.map;
	}
	
};

extend(MainLayout, AbstractView);

