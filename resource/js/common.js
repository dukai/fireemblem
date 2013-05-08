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
	
	
	
	var activeObj = null;
	var stage = new Kinetic.Stage({
	    container: 'mainbox',
	    width: 960,
	    height: 640
	});
	
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
	var map = new TiledMap({
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
	//add map and lines 
	layer.add(map);
	layer.add(linesGroup);
	
	var soliderModel = new Solider({
		x: 8, 
		y: 6,
		moveRange: 4,
		atkRange: 1
	});
	
	var soliderView = new SoliderView({
		x: 8,
		y: 6,
		image: resourceLoader.get('soldier'),
		tolayer: layer,
		hitmap: hitmap,
		model: soliderModel
	});
	
	
	var moveCursorGroup = new Kinetic.Group({
		x: 0,
		y: 0
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
		x: soliderView.getRealX(8, -8),
		y: soliderView.getRealY(6, -16),
		image: resourceLoader.get('soldier'),
		animation: 'idle',
		animations: soliderAnimation,
		frameRate: 7,
		index: 0,
		
		drawHitFunc: function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(8, 16, 32, 32);
			context.closePath();
			canvas.fillStroke(this);
		}
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
		var rv = new RangeView({
			x: 0,
			y: 0,
			rangeList: list,
			fill: 'rgba(255, 0, 0, .5)'
		});
		rv.on('click', function(e){
			var mpos = stage.getMousePosition();
			var tc = getCoordinate(mpos.x, mpos.y, layer.getX(), layer.getY());
			console.log(tc);
			var pos = {
				x: tc.x * 32,
				y: tc.y * 32
			}
			solider.transitionTo({
				x: pos.x - 8,
				y: pos.y - 16,
				duration: .2,
				callback: function(){
					
					var pm = new PopMenuView({
						x: pos.x + 42, 
						y: pos.y - 16,
						itemsList: [
							{text: '攻击', callback: function(){
								var atkList = getRange(tc, 1, hitmap);
								var atkRV = new RangeView({
									x: 0,
									y: 0,
									rangeList: atkList,
									fill: 'rgba(255, 200, 0, .8)'
								});
								layer.add(atkRV);
								//layer.draw();
								//solider.setAnimation('atk');
							}}, 
							{text: '待机', callback: function(){
								//TODO: do nothing
							}}, 
							{text: '取消', callback: function(){
								//TODO: go back to the last position
							}}
						]
					});
					
					layer.add(pm);
					layer.draw();
				}
			});
		});
		moveCursorGroup.add(rv);
		layer.draw();
		
	});
	
	var rv = new RangeView({
		x: 0,
		y: 0,
		rangeList: [{x: 1, y: 1}, {x: 2, y:2}, {x: 3, y: 3}],
		fill: 'rgba(255, 0, 0, .5)'
	});
	
	
	layer.add(moveCursorGroup);
	
	//layer.add(solider);
	//layer.add(soliderView.sprite);
	layer.add(archer);
	//solider.start();
	archer.start();
	//layer.add(rv);
	stage.add(layer);
};

