var gameResources = [
	{'name': 'newworld', type: 'image', src: 'data/images/newworld.png'},
	{'name': 'metatiles32x32', type: 'image', src: 'data/images/metatiles32x32.png'},
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
	//console.log(~~(e.loadedCount * 100 / e.totalCount) + '%');
};
resourceLoader.onComplete = function(){
	console.log("Complete");
	map = new TiledMap({
		x: 0,
		y: 0,
		tmx: resourceLoader.get('demo_map'),
		resourceLoader: resourceLoader
	});
	layer.add(map);
	layer.add(solider);
	stage.add(layer);
};

var stage = new Kinetic.Stage({
    container: 'mainbox',
    width: 640,
    height: 480
});
var map;
var layer = new Kinetic.Layer({
	draggable: true,
	dragBoundFunc: function(pos){
		var y = pos.y < 480 - map.getHeight() ? 480 - map.getHeight() : pos.y;
		var x = pos.x < 640 - map.getWidth() ? 640 - map.getWidth() : pos.x;
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

var imgObj = new Image();
imgObj.src = "data/images/soldier.png";

var solider = new Kinetic.Image({
    x: 140,
    y: 10,
    fillPatternImage: imgObj,
    width:48,
    height:48,
	fillPatternOffset: {x: 0, y: 0}
});

var rect = new Kinetic.Rect({
	x: 140,
	y: 75,
	width: 100,
	height: 50,
	fill: 'green',
	stroke: 'black',
	strokeWidth: 4
});



//layer.add(rect);
layer.add(solider);

//stage.add(map);

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