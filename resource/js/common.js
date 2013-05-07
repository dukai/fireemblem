/**
 * 获取移动范围
 * @param {Object} target {x, y}
 * @param {int} range 移动范围 
 */
function getRange(target, range, hitmap){

	var preColumn = target.x - range;
	var nextColumn = target.x + range;
	var preRow = target.y - range;
	var nextRow = target.y + range;

	var list = [];


	for(var x = preColumn; x <= nextColumn; x++){
		for(var y = preRow; y <= nextRow; y++){
			var dx = Math.abs(x - target.x);
			var dy = Math.abs(y - target.y);
			
			if(dx + dy <= range){
				
				if(x !== target.x || y !== target.y){
					if(hitmap.getPassable(x, y)){
						list.push({x: x, y: y});
					}
					//console.log(x + ', ' + y);
					//var as = new PathFinder.AStar(new PathFinder.HitMap(hitmap), new PathFinder.Node(target.x, target.y), new PathFinder.Node(x, y));
					//var path = as.getPath();
					
					//if(path !== false && path.getCount() <= range + 2){
						//console.log(path.nodelist[path.nodelist.length - 1].x + ', ' + path.nodelist[path.nodelist.length - 1].y);
						//console.log(path.nodelist.length);
						//list.push({x: x, y: y});
					//}
				}
			}
		}
	}
	return list;
}

function getCoordinate(x, y, offsetX, offsetY){
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

var gameResources = [
	{'name': 'newworld', type: 'image', src: 'data/images/newworld.png'},
	{'name': 'hit', type: 'image', src: 'data/images/metatiles32x32.png'},
	{'name': 'map1', type: 'tmx', 'src': 'data/map1.tmx'},
	{'name': 'soldier', type:'image', src: 'data/images/soldier.png'},
	{'name': 'archer', type:'image', src: 'data/images/archer.png'},
	{'name': 'knight', type:'image', src: 'data/images/knight.png'},
	{name: 'test', type: 'tmx', src: 'data/test.tmx'},
	{name: 'new', type:'image', src: 'data/new.png'},
	{name: 'newmap', type: 'tmx', src: 'data/new.tmx'},
	{name: 'demo_map', type: 'json', src: 'data/demo_map.json'},
	{name: 'v2_map', type: 'json', src: 'data/v2.json'},
	{name: 'v2', type: 'image', src: 'data/v2.png'}
];

resourceLoader.load(gameResources);

resourceLoader.onProgress = function(e){
};
resourceLoader.onComplete = function(){
	
	var soliderModel = new Solider();
	soliderModel.x = 8;
	soliderModel.y = 6;
	
	var soliderView = new SoliderView();
	
	var activeObj = null;
	var stage = new Kinetic.Stage({
	    container: 'mainbox',
	    width: 800,
	    height: 600
	});
	var map;
	
	
	var layer = new Kinetic.Layer({
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
	
	var moveCursorGroup = new Kinetic.Group({
		x: 0,
		y: 0,
		opacity: .5
	});
	
	/*
	var solider = new Kinetic.Image({
	    x: 416,
	    y: 448,
	    fillPatternImage: resourceLoader.get('soldier'),
	    width:48,
	    height:48,
		fillPatternOffset: {x: 0, y: 0},
		drawHitFunc: function(canvas){
			var width = this.getWidth(), 
                height = this.getHeight(), 
                context = canvas.getContext();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.fillStroke(this);
		}
	});
	*/
	var soliderAnimation = {
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
	
	var solider = new Kinetic.Sprite({
		x: soliderModel.getRealX(-8),
		y: soliderModel.getRealY(-16),
		image: resourceLoader.get('soldier'),
		animation: 'idle',
		animations: soliderAnimation,
		frameRate: 7,
		index: 0
	});
	
	layer.on('click', function(e){
		moveCursorGroup.removeChildren();
	});
	
	
	solider.on('click', function(e){
		e.cancelBubble = true;
		
		activeObj = solider;
		
		var mpos = stage.getMousePosition();
		
		var coordinate = getCoordinate(mpos.x, mpos.y, layer.getX(), layer.getY());
		
		moveCursorGroup.removeChildren();
		
		var list = getRange(coordinate, 4, hitmap);
		for(var i in list){
			var item = list[i];
			var rect = new Kinetic.Rect({
				x: item.x * 32,
				y: item.y * 32,
				width:32,
				height:32,
				fill: 'red',
			});
			
			rect.on('click', function(){
				var mpos = stage.getMousePosition();
				var tc = getCoordinate(mpos.x, mpos.y, layer.getX(), layer.getY());
				console.log(tc);
				var pos = {
					x: tc.x * 32,
					y: tc.y * 32
				}
				console.log(pos);
				console.log(solider.getX() + ', ' + solider.getY());
				solider.transitionTo({
					x: pos.x - 8,
					y: pos.y - 16,
					duration: 1,
					callback: function(){
						
					}
				});
			});
			moveCursorGroup.add(rect);
		}
		
		layer.draw();
		
	});
	
	var archerAnimation = {
		idle: [
			{x: 0, y: 0, width: 36, height: 48},
			{x: 0, y: 48, width: 36, height: 48},
			{x: 0, y: 96, width: 36, height: 48},
			{x: 0, y: 144, width: 36, height: 48},
			{x: 0, y: 192, width: 36, height: 48},
			{x: 0, y: 240, width: 36, height: 48},
			{x: 0, y: 288, width: 36, height: 48}
		],
		atk: [
			{x: 36, y: 0, width:56, height:44},
			{x: 36, y: 88, width:56, height:44},
			{x: 36, y: 132, width:56, height:44},
			{x: 36, y: 176, width:56, height:44},
			{x: 36, y: 220, width:56, height:44},
			{x: 36, y: 264, width:56, height:44},
			{x: 36, y: 308, width:56, height:44}
		],
		dead: [
			{x: 92, y: 0, width:56, height:44},
			{x: 92, y: 88, width:56, height:44},
			{x: 92, y: 132, width:56, height:44},
			{x: 92, y: 176, width:56, height:44},
			{x: 92, y: 220, width:56, height:44},
			{x: 92, y: 264, width:56, height:44}
		]
	};
	var archer = new Kinetic.Sprite({
		x: 516,
		y: 396,
		image: resourceLoader.get('archer'),
		animation: 'idle',
		animations: archerAnimation,
		frameRate: 7,
		index: 0
	});
	archer.on('click', function(e){
		e.cancelBubble = true;
		archer.setAnimation('atk');
		archer.afterFrame(4, function() {
			archer.setAnimation('idle');
		});
	});
	/*
	var keyFrame = 0;
	var anim = new Kinetic.Animation(function(frame){
		var time = frame.time,
			timeDiff = frame.timeDiff,
			frameRate = frame.frameRate;
		var pos =  parseInt(time * 10 / 1000);
		keyFrame += Math.floor(time * 1 / 1000);
		keyFrame %= 8;
		keyFrame = keyFrame;
		solider.setFillPatternOffset({x: 0, y: pos * 48});
	}, layer);
	*/
	//anim.start();
	map = new TiledMap({
		x: 0,
		y: 0,
		tmx: resourceLoader.get('v2_map'),
		resourceLoader: resourceLoader
	});
	
	var hitmap = new PathFinder.HitMap(map.getHitMap());
	
	/**
	 *add lines for map 
	 */
	var linesGroup = new Kinetic.Group({
		x:0,
		y:0
	});
	var mapWidth = map.getWidth();
	var mapHeight = map.getHeight();
	for(var i = 0; i <= map.getRows(); i++){

		var y = 32 * i
		var redLine = new Kinetic.Line({
			points: [0, y, mapWidth, y],
			stroke: 'white',
			strokeWidth: .5,
			lineCap: 'round',
			lineJoin: 'round'
		});
		
		linesGroup.add(redLine);
	}
	
	for(var i = 0; i <= map.getColumns(); i++){

		var x = 32 * i
		var redLine = new Kinetic.Line({
			points: [x, 0, x, mapHeight],
			stroke: 'white',
			strokeWidth: .5,
			lineCap: 'round',
			lineJoin: 'round'
		});
		
		linesGroup.add(redLine);
	}
	
	for(var tx = 0; tx <= map.getRows(); tx++){
		for(var ty = 0; ty <= map.getColumns(); ty++){
			var x = tx * 32, y = ty * 32;
			var txt = new Kinetic.Text({
				x: x,
				y: y,
				text : tx + ', ' + ty,
				fontSize: 10,
				fill: '#000'
			});
			
			//linesGroup.add(txt);
		}
	}
	
	layer.add(map);
	layer.add(moveCursorGroup);
	layer.add(linesGroup);
	layer.add(solider);
	layer.add(archer);
	solider.start();
	archer.start();
	stage.add(layer);
};

