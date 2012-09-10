/**
 *The Screen Objects Pool 
 */
this.MainApp = MainApp || {};
(function(win, mainApp){
	
var ScreenObjPool = {
	startTime: null,
	objects: {},
	objectsIds: [],
	_ticks: 0,
	add: function(entityObj){
		var objects = this.objects, objectsIds = this.objectsIds;
		if(!this.objects[entityObj.guid]){
			entityObj.visual = true;
			this.objects[entityObj.guid] = entityObj;
			this.objectsIds.push(entityObj.guid);
		}
	},
	remove: function(entityObj){
		entityObj.visual =false;
		var objects = this.objects, objectsIds = this.objectsIds;
		delete this.objects[entityObj.guid];
		for(var i = 0, len = objectsIds.length; i < len; i++){
			if(this.objectsIds[i] === entityObj.guid){
				this.objectsIds.splice(i, 1);
			}
		}
	},
	
	empty: function(){
		this.objects = {};
		this.objectsIds = [];
	},
	
	foreach: function(context){
		var objects = this.objects, objectsIds = this.objectsIds;
		for(var i = 0, len = objectsIds.length; i < len; i++){
			var o = objects[objectsIds[i]];
			o.draw(context);
			
			if(o.hitable){
				MainApp.checkHit(o);
			}
		}
	},
	
	init: function(context){
		this.context = context;
		this.runStatus = true;
		MainApp.startTime = new Date().getTime();
		if(win.requestAnimFrame){
			this.renderFrame = this.rafRenderFrame;
			var self = this;
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
		}else{
			this.renderFrame = this.intervalRenderFrame;
			setInterval(function(){
				this.timer = self.renderFrame();
			}, 1000 / 60);
		}
	},
	
	renderFrame: function(){
	},
	
	rafRenderFrame: function(){
		this._ticks ++;
		var self = this;
		MainApp.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		MainApp.diffTime = MainApp.nowTime - MainApp.startTime;
		ScreenObjPool.foreach(this.context);
		MainApp.startTime = MainApp.nowTime;
		if(self.runStatus){
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
		}
	},
	
	intervalRenderFrame: function(){
		this._ticks ++;
		var self = this;
		MainApp.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		MainApp.diffTime = MainApp.nowTime - MainApp.startTime;
		ScreenObjPool.foreach(this.context);
		
		MainApp.startTime = MainApp.nowTime;
	},
	
	stop: function(){
		this.runStatus = false;
		this.timer && clearInterval(this.timer);
	}
};

MainApp.ScreenObjPool = ScreenObjPool;

})(window, MainApp);
