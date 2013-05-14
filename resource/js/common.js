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
	var stage = this.stage = new Kinetic.Stage({
	    container: 'mainbox',
		width: 960,
		height: 640,
	});
	
	var map = new TiledMap({
		x: 0,
		y: 0,
		tmx: resourceLoader.get('v2_map'),
		resourceLoader: resourceLoader
	});
	
	var hitmap = new PathFinder.HitMap(map.getHitMap());
	
	var layout = new MainLayout({
		stage: stage,
		map: map
	});
	
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
		tolayer: layout.layer,
		hitmap: hitmap,
		model: soliderModel
	});
	
	layout.addView(soliderView);
	
	layer = new  Kinetic.Layer({});
	var roundBtn = new BtnView({
		x: 430,
		y: 0,
		text: '结束回合'
	});
	var round = 1;
	var word = new Kinetic.Text({
		x: 400,
		y: 200,
		text : '回合结束',
		fontSize: 32,
		fontFamily: "Microsoft YaHei",
		fill: '#fff',
		align : 'center',
		listening : false
	});
	
	roundBtn.on('click', function(){
		layout.newRound();
		word.setText("第" + round + '回合结束');
		round++;
		word.setX(430);
		word.setY(300);
		word.setFontSize(32);
		word.setOpacity(1);
		layer.add(word);
		word.transitionTo({
			x: 280,
			y: -30,
			opacity: 0,
			fontSize: 60,
			duration: 1
		});
	});
	
	layer.add(roundBtn);
	
	
	
	stage.add(layer);
	
};

