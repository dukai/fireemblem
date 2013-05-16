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
		this.enemyViews = [];
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
			//如果存在激活对象
			if(self.activeView){
				//如果点击的目标为激活对象
				if(self.activeView.getModel().getX() == coordinate.x && self.activeView.getModel().getY() == coordinate.y){
					//如果是激活状态则显示菜单
					if(self.activeView.status == SoliderView.STATUS.ACTIVE){
						self.showOperationMenu(coordinate);
						self.activeView.moveRange.remove();
						return;
					}else if(self.activeView.status != SoliderView.STATUS.NORMAL){//如果不是普通状态直接返回
						return;
					}
				}
				//如果是激活状态并点击了移动范围内，移动角色并打开菜单
				if(self.activeView.status == SoliderView.STATUS.ACTIVE){
					if(self.activeView.isInCoordinateList(coordinate) && self.activeView.status == SoliderView.STATUS.ACTIVE){
						self.activeView.bodyGoto(coordinate.x, coordinate.y, function(){
							self.activeView.status = SoliderView.STATUS.MOVED;
							self.showOperationMenu(coordinate);
							self.activeView.moveRange.remove();
						});
						return;
					}
				}
				//如果是攻击状态，并点击了攻击范围则进行攻击
				if(self.activeView.status == SoliderView.STATUS.ATK){
					if(self.activeView.isInCoordinateList(coordinate)){
						self.activeView.body.setAnimation("atk");
						self.activeView.body.moveToTop();
						self.activeView.getModel().updatePosition();
						self.activeView.atkRange.remove();
						return;
					}
				}
			}
			//如果激活对象存在并且不是等待状态，返回原来的位置
			if(self.activeView && self.activeView.status != SoliderView.STATUS.WAITING){
				self.activeView.restorePosition();
			}
			//如果存在弹出菜单，移除，并将激活对象置空
			self.popMenu && self.popMenu.remove();
			self.activeView = null;
			//循环所有对象是否是点击了对象
			for(var i = 0, len = self.views.length; i < len; i++){
				var view = self.views[i];
				if(view.getModel().getX() == coordinate.x && view.getModel().getY() == coordinate.y && view.status != SoliderView.STATUS.WAITING){
					self.activeView = view;
					self.activeView.showMoveRange(self.getEnemyCoordinates());
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
		
		var items = {
			atk: {text: '攻击', callback: function(){
				view.showAtkRange(ec);
			}}, 
			await: {text: '待机', callback: function(){
				//TODO: do nothing
				view.getModel().setX(coordinate.x);
				view.getModel().setY(coordinate.y);
				view.awaiting();
				
			}}, 
			cancel: {text: '取消', callback: function(){
				view.restorePosition();
			}}
		};
		var itemTmp = [];
		var self = this;
		var view = this.activeView;
		view.getModel().setSecCoordinate(coordinate);
		var ec = self.getEnemyCoordinates();
		var canAtk = view.canAtk(ec);
		if(canAtk){
			itemTmp.push(items.atk);
		}
		itemTmp.push(items.await);
		itemTmp.push(items.cancel);
		this.popMenu = new PopMenuView({
			x: this.getRealPos(coordinate.x , 42), 
			y: this.getRealPos(coordinate.y , 0),
			itemsList: itemTmp
		});
		this.popMenuGroup.moveToTop();
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
	/**
	 *添加敌对角色 
 	 * @param {Object} view
	 */
	addEnemyView: function(view){
		this.enemyViews.push(view);
	},
	
	getEnemyCoordinates: function(){
		var c = {};
		for(var i = 0, len = this.enemyViews.length; i < len; i++){
			var view = this.enemyViews[i];
			c[view.getModel().getX().toString() + view.getModel().getY().toString()] = true;
		}
		
		return c;
	},
	
	getStage: function(){
		return this.attrs.stage;
	},
	
	getMap: function(){
		return this.attrs.map;
	}
	
};

extend(MainLayout, AbstractView);

