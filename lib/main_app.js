/**
 *The Main App 
 */

(function(window, util){
	
var Vector = Display.Vector;
//主程序
var MainApp = {
	startTime: null,
	nowTime: null,
	diffTime: null,
	canvasId: 'sence',
	canvas: 'sence',
	context: null,
	dContext: null,
	runStatus: true,
	viewport: null,
	
	
	init: function(config){
		for(var attr in config){
			this[attr] = config[attr];
		}
		this.canvas = util.g(this.canvasId);
		this.context = this.canvas.getContext('2d');
		this.viewport = new Display.Viewport(0, 0, this.canvas.width, this.canvas.height, this.canvas.width, this.canvas.height);
		this.canvasPos = util.getPosInDoc(this.canvas);
		
		this.initEvent();


		var dCanvas = window.document.createElement('canvas');
		dCanvas.setAttribute('width', 640);
		dCanvas.setAttribute('height', 480);
		this.dContext = dCanvas.getContext('2d');
		
		MainApp.ScreenObjPool.init(MainApp.context);
	},
	/**
	 *可碰撞的对象
	 */
	collisionPool: (function(){
		var objectsIds = [];
		var objects = {};
		return {
			add: function(){},
			remove: function(obj){
				delete objects[obj.guid];
				for(var i = 0, len = objectsIds.length; i < len; i++){
					if(objectsIds[i] === obj.guid){
						this.objectsIds.splice(i, 1);
					}
				}
			},
			foreach: function(callback){
				for(var i = 0, len = objectsIds.length; i < len; i++){
					callback.call(objects[objectsIds[i]], index);
				}
			}
		};
	})(),
	
	
	INPUT: {
		KEY: {
			UP: 38,
			DOWN: 40,
			LEFT: 37,
			RIGHT: 39
		},
		
		KEY_LOCK: {
			UP: false,
			DOWN: false,
			LEFT: false,
			RIGHT: false
		}
	},
	
	eventsPool: {
		keydown: [],
		keyup: [],
		click: [],
		keypress: [],
		mousemove: [],
		mouseover: [],
		mouseout: [],
		collide: [],
		hit: []
	},
	
	emptyEventsPool: function(){
		this.eventsPool = {
			keydown: [],
			keyup: [],
			click: [],
			keypress: [],
			mousemove: [],
			mouseover: [],
			mouseout: [],
			collide: [],
			hit: []
		}
	},

	events: {
		mouse: {relX: -1, relY: -1}
	},
	
	addEventListener: function(target, eventType, callback){
		var event = {
			target: target, 
			callback: callback,
			init: false
		};	
		
		if(eventType == 'mouseover' || eventType == 'mouseout'){
			event.target.mouseover = false;
		}
		
		this.eventsPool[eventType].push(event);
	},
	
	initEvent: function(){
		var self = this;
		var KEY = this.INPUT.KEY;
		var LOCK = this.INPUT.KEY_LOCK;
		var document = window.document;
		document.onkeydown = function(e){
			switch(e.which){
				case KEY.UP:
					!LOCK.UP || (LOCK.UP = true);
					break;
				case KEY.DOWN:
					!LOCK.DOWN || (LOCK.DOWN = true);
					break;
				case KEY.LEFT:
					!LOCK.LEFT || (LOCK.LEFT = true);
					break;
				case KEY.RIGHT:
					!LOCK.RIGHT || (LOCK.RIGHT = true);
					break;
			}
		
			for(var i = 0, len = MainApp.eventsPool.keydown.length; i < len; i++){
				var event = MainApp.eventsPool.keydown[i];
				event.callback.call(event.target, e);
			}
		};
	
		document.onkeyup = function(e){
			switch(e.which){
				case KEY.UP:
					LOCK.UP || (LOCK.UP = false);
					break;
				case KEY.DOWN:
					LOCK.DOWN || (LOCK.DOWN = false);
					break;
				case KEY.LEFT:
					LOCK.LEFT || (LOCK.LEFT = false);
					break;
				case KEY.RIGHT:
					LOCK.RIGHT || (LOCK.RIGHT = false);
					break;
			}
			for(var i = 0, len = MainApp.eventsPool.keyup.length; i < len; i++){
				var event = MainApp.eventsPool.keyup[i];
				event.callback.call(event.target, e);
			}
		};
		
		
		document.onclick = function(e){
			var scroll = util.getScroll();
			e.relX = e.clientX - self.canvasPos.left + scroll.left;
			e.relY = e.clientY - self.canvasPos.top + scroll.top;
			var mPos = new Vector(e.relX, e.relY);
			mPos.remove(self.viewport.position);
			for(var i = 0, len = MainApp.eventsPool.click.length; i < len; i++){
				var event = MainApp.eventsPool.click[i];
				if(event.target.checkContain(mPos)){
					event.callback.call(event.target, e);
				}
			}
		};
		
		this.canvas.addEventListener('mousemove', function(e){
			var scroll = util.getScroll();
			e.relX = e.clientX - self.canvasPos.left + scroll.left;
			e.relY = e.clientY - self.canvasPos.top + scroll.top;
			MainApp.events.mouse.relX = e.relX;
			MainApp.events.mouse.relY = e.relY;
			var mPos = new Vector(e.relX, e.relY);

			for(var i = 0, len = MainApp.eventsPool.mousemove.length; i < len; i++){
				var event = MainApp.eventsPool.mousemove[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				if(status){
					event.callback.call(event.target, e);
				}
			}
			
			for(var i = 0, len = MainApp.eventsPool.mouseover.length; i < len; i++){
				var event = MainApp.eventsPool.mouseover[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				
				if(event.target.mouseStatus === undefined){
					event.target.mouseStatus = status;
					
					status && event.callback.call(event.target, e);
				}else{
					if(!event.target.mouseStatus){
						status && event.callback.call(event.target, e);
						event.target.mouseStatus = status;
					}
				}
			}
			
			for(var i = 0, len = MainApp.eventsPool.mouseout.length; i < len; i++){
				var event = MainApp.eventsPool.mouseout[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				
				if(event.target.mouseStatus === undefined){
					event.target.mouseStatus = status;
					if(!status){
						event.callback.call(event.target, e);
					}
					
				}else{
					if(event.target.mouseStatus){
						status || event.callback.call(event.target, e);
						event.target.mouseStatus = status;
					}
				}
			}
			
		}, false);
	},
	
	checkHit: function(target){
		for(var i = 0, len = MainApp.eventsPool.hit.length; i < len; i++){
			var event = MainApp.eventsPool.hit[i];
			if(event.target.guid === target.guid){
				continue;
			}
			
			if(event.target.checkHit(target)){
				event.callback.call(event.target, {relatedTarget: target});
			}
		}
	},
	
	startRun: function(){
		this.startTime = new Date().getTime();
		var self = this;
		window.requestAnimFrame(function(){
			self.renderFrame();
		});
	},
	
	stopRun: function(){
		this.runStatus = false;
	},
	
	renderFrame: function(){
		var self = this;
		this.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		this.diffTime = this.nowTime - this.startTime;
		ScreenObjPool.foreach(this.context);
		
		this.startTime = this.nowTime;
		
		if(self.runStatus)
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
	},
	
	renderRangeLayer: function(nodes, attacks){
		if(this.rangelayer){
			this.rangelayer.empty();
		}else{
			this.rangelayer = new CommonLayer(this.viewport);
			MainApp.ScreenObjPool.add(this.rangelayer);
		}
		
		for(var i = 0, len = nodes.length; i < len; i++){
			var n = nodes[i];
			var o = new EntityObject(new Vector(n.x * 32, n.y * 32), 32, 32, {fill: 'rgba(255, 0, 0, .5)'});
			this.rangelayer.add(o);
		}
		
		for(var i = 0, len = attacks.length; i < len; i++){
			var n = attacks[i];
			var o = new EntityObject(new Vector(n.x * 32, n.y * 32), 32, 32, {fill: 'rgba(0, 0, 0, .5)'});
			this.rangelayer.add(o);
		}
	}


};

window.MainApp = MainApp;

//资源载入器
var resourceLoader = {
	totalCount: 0,
	loadedCount: 0,
	resources: {},
	get: function(name){
		if(this.resources[name] !== undefined){
			return this.resources[name];
		}else{
			console.log('Error on get resource: ' + name);
			return false;
		}
	},
	load: function(resources){
		this.totalCount = resources.length;
		var self = this;
		for(var i = 0, len = resources.length; i < len; i++){
			switch(resources[i].type){
				case 'image':{
					this.loadImage(resources[i]);
					break;
				}

				case 'tmx':{
					this.loadXML(resources[i]);
					break;
				}

				case 'audio':{
					break;
				}
			}
		};
	},

	loadImage: function(resource){
		var self = this;
		var img = new Image();
		img.dataName =resource.name;
		img.onload = function(){
			++self.loadedCount;
			self.onProgress({loadedCount: self.loadedCount, totalCount: self.totalCount});
			self.resources[this.dataName] = this;
			if(self.totalCount === self.loadedCount){
				self.onComplete();
			}
		};
		
		img.onerror = function(){
			console.log('Error on: ' + this.dataName);
		};
		
		img.src = resource.src;
	},
	
	loadXML: function(resource){
		var self = this;
		
		var request = new util.Request({
			url: resource.src,
			dataType: 'xml',
			success: function(rep, statusText, xhr){
				++self.loadedCount;
				self.resources[this.dataName] = rep;
				self.onProgress({loadedCount: self.loadedCount, totalCount: self.totalCount});

				if(self.totalCount === self.loadedCount){
					self.onComplete();
				}
			},
			error: function(statusText){
				console.log('Error on: ' + statusText);
			}
		});
		request.dataName = resource.name;


		request.send();
	},

	loadAudio: function(){

	},

	onProgress: function(){},
	
	onComplete: function(){}
};
MainApp.resourceLoader = resourceLoader;

})(window, window.util);
