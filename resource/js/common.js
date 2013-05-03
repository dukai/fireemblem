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
					var as = new PathFinder.AStar(new PathFinder.HitMap(hitmap), new PathFinder.Node(target.x, target.y), new PathFinder.Node(x, y));
					if(as.getPath() !== false){
						list.push({x: x, y: y});
					}
				}
			}
		}
	}
	return list;
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
	{name: 'demo_map', type: 'json', src: 'data/demo_map.json'}
];

resourceLoader.load(gameResources);

resourceLoader.onProgress = function(e){
};
resourceLoader.onComplete = function(){
	console.log("Complete");
	
	
	
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
	
	
	var solider = new Kinetic.Image({
	    x: 416,
	    y: 448,
	    fillPatternImage: resourceLoader.get('soldier'),
	    width:48,
	    height:48,
		fillPatternOffset: {x: 0, y: 0}
	});
	
	layer.on('click', function(e){
		var mpos = stage.getMousePosition();
		
		var posInLayer = {
			x: mpos.x - layer.getX(),
			y: mpos.y -layer.getY()
		}
		var coordinate = {
			x: ~~(posInLayer.x / 32),
			y: ~~(posInLayer.y / 32)
		};
		
		console.log(coordinate);
		
		moveCursorGroup.removeChildren();
		
		var list = getRange(coordinate, 4, map.getHitMap());
		for(var i in list){
			var item = list[i];
			var rect = new Kinetic.Rect({
				x: item.x * 32,
				y: item.y * 32,
				width:32,
				height:32,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 1
			});
			moveCursorGroup.add(rect);
		}
		
	});
	
	var keyFrame = 0;
	var anim = new Kinetic.Animation(function(frame){
		var time = frame.time,
			timeDiff = frame.timeDiff,
			frameRate = frame.frameRate;
		//console.log(time);
		//console.log(timeDiff);
		//console.log(frameRate);
		var pos =  parseInt(time * 10 / 1000);
		keyFrame += Math.floor(time * 1 / 1000);
		//console.log(keyFrame);
		keyFrame %= 8;
		keyFrame = keyFrame;
		solider.setFillPatternOffset({x: 0, y: pos * 48});
	}, layer);
	anim.start();
	map = new TiledMap({
		x: 0,
		y: 0,
		tmx: resourceLoader.get('demo_map'),
		resourceLoader: resourceLoader
	});
	
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
	
	
	layer.add(map);
	layer.add(linesGroup);
	layer.add(moveCursorGroup);
	layer.add(solider);
	stage.add(layer);
};

