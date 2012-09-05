MainApp.init();
MainApp.startRun();

var gameResources = [
	{'name': 'newworld', type: 'image', src: 'data/images/newworld.png'},
	{'name': 'metatiles32x32', type: 'image', src: 'data/images/metatiles32x32.png'},
	{'name': 'map1', type: 'tmx', 'src': 'data/map1.tmx'},
	{'name': 'soldier', type:'image', src: 'data/images/soldier.png'},
	{'name': 'archer', type:'image', src: 'data/images/archer.png'},
	{'name': 'knight', type:'image', src: 'data/images/knight.png'},
	{name: 'test', type: 'tmx', src: 'data/test.tmx'}
];

var loadScreen = new LoadScreen();
MainApp.ScreenObjPool.add(loadScreen);

MainApp.resourceLoader.onProgress = function(e){

	loadScreen.setProgress(e.loadedCount / e.totalCount);
};

MainApp.resourceLoader.onComplete = function(e){
MainApp.ScreenObjPool.remove(loadScreen);
var xml = util.parseXMLString(MainApp.resourceLoader.get('map1'));

//var soldier = new Sprite(new Vector(160, 160), MainApp.resourceLoader.get('soldier'), Sprite.ANIM_TYPE.VERTICAL, 48, new Vector(0, 0));

var leftHandler = new EntityObject(new Vector(0, 0), 20, 480, {fill: 'rgba(0, 0, 0, .5)'});
var rightHandler = new EntityObject(new Vector(620, 0), 20, 480, {fill: 'rgba(0, 0, 0, .5)'});
var topHandler = new EntityObject(new Vector(0, 0), 640, 20, {fill: 'rgba(0, 0, 0, .5)'});
var bottomHandler = new EntityObject(new Vector(0, 460), 640, 20, {fill: 'rgba(0, 0, 0, .5)'});

VIEWPORT_LOCK = {
	LEFT: false,
	RIGHT: false,
	TOP: false,
	BOTTOM: false
}
MainApp.addEventListener(leftHandler, 'mouseover', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .8)'});
	if(!VIEWPORT_LOCK.LEFT){
		MainApp.viewport._move.speed.add(new Vector(150, 0));
		MainApp.viewport._move.keep = true;
		VIEWPORT_LOCK.LEFT = true;
	}
	//MainApp.viewport.move(new Vector(150, 0), 10);
});

MainApp.addEventListener(leftHandler, 'mouseout', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .5)'});
	if(VIEWPORT_LOCK.LEFT){
		MainApp.viewport._move.speed.remove(new Vector(150, 0));
		MainApp.viewport._move.keep = false;
		VIEWPORT_LOCK.LEFT = false;
	}
	//MainApp.viewport.move(new Vector(0, 0), 0);
});

MainApp.addEventListener(rightHandler, 'mouseover', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .8)'});
	if(!VIEWPORT_LOCK.RIGHT){
		MainApp.viewport._move.speed.add(new Vector(-150, 0));
		MainApp.viewport._move.keep = true;
		VIEWPORT_LOCK.RIGHT = true;
	}
	//MainApp.viewport.move(new Vector(-150, 0), 10);
});

MainApp.addEventListener(rightHandler, 'mouseout', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .5)'});
	if(VIEWPORT_LOCK.RIGHT){
		MainApp.viewport._move.speed.remove(new Vector(-150, 0));
		MainApp.viewport._move.keep = false;
		VIEWPORT_LOCK.RIGHT = false;
	}
	//MainApp.viewport.move(new Vector(0, 0), 0);
});


MainApp.addEventListener(topHandler, 'mouseover', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .8)'});
	if(!VIEWPORT_LOCK.TOP){
		MainApp.viewport._move.speed.add(new Vector(0, 150));
		MainApp.viewport._move.keep = true;
		VIEWPORT_LOCK.TOP = true;
	}
	//MainApp.viewport.move(new Vector(0, 150), 10);
});

MainApp.addEventListener(topHandler, 'mouseout', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .5)'});
	if(VIEWPORT_LOCK.TOP){
		MainApp.viewport._move.speed.remove(new Vector(0, 150));
		MainApp.viewport._move.keep = false;
		VIEWPORT_LOCK.TOP = false;
	}
	//MainApp.viewport.move(new Vector(0, 0), 0);
});

MainApp.addEventListener(bottomHandler, 'mouseover', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .8)'});
	if(!VIEWPORT_LOCK.BOTTOM){
		MainApp.viewport._move.speed.add(new Vector(0, -150));
		MainApp.viewport._move.keep = true;
		VIEWPORT_LOCK.BOTTOM = true;
	}
	//MainApp.viewport.move(new Vector(0, -150), 10);
});

MainApp.addEventListener(bottomHandler, 'mouseout', function(e){
	this.setStyles({fill: 'rgba(0, 0, 0, .5)'});
	if(VIEWPORT_LOCK.BOTTOM){
		MainApp.viewport._move.speed.remove(new Vector(0, -150));
		MainApp.viewport._move.keep = false;
		VIEWPORT_LOCK.BOTTOM = false;
	}
	//MainApp.viewport.move(new Vector(0, 0), 0);
});
/*
var LOCK = {
	UP: false,
	DOWN: false,
	LEFT: false, 
	RIGHT: false
}
MainApp.addEventListener(soldier, 'keydown', function(e){
	var KEY = MainApp.INPUT.KEY;
	switch(e.which){
		case KEY.UP:
			if(!LOCK.UP){
				this.speed.add(new Vector(0, -80));
				LOCK.UP = true;
			}
			break;
		case KEY.DOWN:
			if(!LOCK.DOWN){
				this.speed.add(new Vector(0, 80));
				LOCK.DOWN = true;
			}
			break;
		case KEY.LEFT:
			if(!LOCK.LEFT){
				this.speed.add(new Vector(-80, 0));
				LOCK.LEFT = true;
			}
			break;
		case KEY.RIGHT:
			if(!LOCK.RIGHT){
				this.speed.add(new Vector(80, 0));
				LOCK.RIGHT = true;
			}
			break;
	}
});

MainApp.addEventListener(soldier, 'keyup', function(e){
	var KEY = MainApp.INPUT.KEY;
	switch(e.which){
		case KEY.UP:
			if(LOCK.UP){
				this.speed.remove(new Vector(0, -80));
				LOCK.UP = false;
			}
			break;
		case KEY.DOWN:
			if(LOCK.DOWN){
				this.speed.remove(new Vector(0, 80));
				LOCK.DOWN = false;
			}
			break;
		case KEY.LEFT:
			if(LOCK.LEFT){
				this.speed.remove(new Vector(-80, 0));
				LOCK.LEFT = false;
			}
			break;
		case KEY.RIGHT:
			if(LOCK.RIGHT){
				this.speed.remove(new Vector(80, 0));
				LOCK.RIGHT = false;
			}
			break;
	}
});
*/
var sence1Map = new TiledMap(xml, MainApp.viewport);

MainApp.addEventListener(MainApp.viewport, 'click', function(e){
	//this.shake();
});

MainApp.addEventListener(MainApp.viewport, 'mousemove', function(e){
/*	
	var pos = new Vector(e.relX, e.relY);
	
	var leftRect = new Rect(new Vector(0, 0), 40, 480);
	var rightRect = new Rect(new Vector(600, 0), 40, 480);
	var topRect = new Rect(new Vector(0, 0), 640, 40);
	var bottomRect = new Rect(new Vector(440, 0), 640, 40);
	
	if(leftRect.checkContain(pos)){
		this.moveRight();
	}
	
	

	if(e.relX < 40){
		this.move(new Vector(120, 0), 10);
	}else if(e.relX > 600){
		this.move(new Vector(-120, 0), 10);
	}else{
		this.move(new Vector(0, 0), 0);
	}

	if(e.relY < 20){
		this.move(new Vector(0, 20), 10);
	}else if(e.relY > 460){
		this.move(new Vector(0, -20), 10);
	}else{
		this.move(new Vector(0, 0), 0);
	}
*/
});



MainApp.ScreenObjPool.add(sence1Map);
//MainApp.ScreenObjPool.add(soldier);
MainApp.ScreenObjPool.add(leftHandler);
MainApp.ScreenObjPool.add(rightHandler);
MainApp.ScreenObjPool.add(topHandler);
MainApp.ScreenObjPool.add(bottomHandler);
MainApp.ScreenObjPool.add(MainApp.viewport);
};

MainApp.resourceLoader.load(gameResources);