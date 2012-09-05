var HitMap = function(map){
	
	this.getWidth = function(){
		return map[0].length;
	};
	
	this.getHeight = function(){
		return map.length;
	};
	
	this.getPassable = function(x, y){
		if(this.getReachable(x, y)){
			return map[y][x] !== 1;
		}
		return true;
	};
	
	this.getReachable = function(x, y){
		if(x >= 0 && y >= 0 && x < this.getWidth() && y < this.getHeight()){
			return true;
		}
		
		return false;
	};

	this.get = function(x, y){
		return map[y][x];
	};
	
	this.set = function(x, y, value){
		map[y][x] = value;
	};
};

var Node = function(x, y){
	this.F = null;
	this.G = null;
	this.H = null;
	this.x = x;
	this.y = y;
	this.parentNode = null;
	this.passable = false;
	
	this.checkReachable = function(map){
		this.passable = map.getPassable(this.x, this.y);
		return map.getReachable(this.x, this.y);
	};
	
	this.equal = function(node){
		if(this.x == node.x && this.y == node.y){
			return true;
		}
		
		return false;
	};
	
	this.getDistance = function(node){
		var dx = Math.abs(this.x - node.x);
		var dy = Math.abs(this.y - node.y);
		
		return {dx: dx, dy: dy};
	};
	
	this.setH = function(node){
		var d = this.getDistance(node);
		//this.H = ~~(Math.sqrt(d.dx * d.dx + d.dy * d.dy) * 10);
		this.H = (d.dx + d.dy) * 10;
	};
	
	this.setG = function(node){
		var g = this.getRelativeG(node);
		this.G = node.G + g;
	};
	
	this.getRelativeG = function(node){
		var d = this.getDistance(node);
		var dsum = d.dx + d.dy;
		if(dsum == 2){
			return 14;
		}else if(dsum == 1){
			return 10;
		}else if(dsum == 0){
			return 0;
		}
		return 20;
		//return ~~(Math.sqrt(d.dx * d.dx + d.dy * d.dy));
	}
	
	this.getF = function(){
		if(this.F === null){
			this.F = this.G + this.H;
		}
		return this.F;
	};
	
	this.setParent = function(node){
		this.parentNode = node;
	}
	
	this.getSurroundNodes = function(map){
		var mapWidth = map.getWidth();
		var mapHeight = map.getHeight();
		var nextColumn = this.x + 1;
		var preColumn = this.x - 1;
		var nextRow = this.y + 1;
		var preRow = this.y - 1;
		var nodelist = [];
		
		for(var x = preColumn; x <= nextColumn; x++){
			for(var y = preRow; y <= nextRow; y++){
				var n = new Node(x, y);
				if(n.checkReachable(map) && n.passable && !this.equal(n)){
					nodelist.push(n);
				}
			}
		}
		return nodelist;
	};
	
	this.print = function(){
		//console.log(this.x + ' - ' + this.y);
	}
};

var NodeList = function(startNode, endNode){
	this.nodelist = [];
	this.add = function(node){
		//node.setG(startNode);
		node.setH(endNode);
		
		this.nodelist.push(node);
	};
	
	this.remove = function(node){
		this.nodelist.splice(this.nodelist.indexOf(node), 1);
	};
	
	this.getMinPoint = function(){
		var nodelist = this.nodelist;
		var minF = nodelist[0].getF();
		var currIndex = 0;
		for(var i = 0, len = nodelist.length; i < len; i++){
			if(minF > nodelist[i].getF()){
				minF = nodelist[i].getF();
				currIndex = i;
			}
		}
		
		return nodelist.splice(currIndex, 1)[0];
	};
	
	this.getCount = function(){
		return this.nodelist.length;
	};
	
	this.exists = function(node){
		for(var i = 0, len = this.nodelist.length; i < len; i++){
			if(this.nodelist[i].equal(node)){
				return true;
			}
		}
		
		return false;
	}
};


var AStar = function(map, startNode, endNode){
	this.openList = new NodeList(startNode, endNode);
	this.closeList = new NodeList(startNode, endNode);
	startNode.G = 0;
	this.openList.add(startNode);
	
	this.getPath = function(){
		var isFinded = false;
		var startTime = new Date().getTime();
		var openList = this.openList;
		var closeList = this.closeList;
		while(openList.getCount() !== 0){
			var minPoint = openList.getMinPoint();
			closeList.add(minPoint);
			var surroundPoints = minPoint.getSurroundNodes(map);
			
			for(var i = 0, len = surroundPoints.length; i < len; i++){
				var tempNode = surroundPoints[i];
				tempNode.print();
				
				if(closeList.exists(tempNode)){
					continue;
				}
				
				if(openList.exists(tempNode)){
					if(tempNode.getRelativeG(minPoint) < tempNode.G){
						tempNode.setG(minPoint);
						tempNode.setParent(minPoint);
					}
					continue;
				}
				
				tempNode.setG(minPoint);
				tempNode.setParent(minPoint);
				
				openList.add(tempNode);
			}
			
			if(openList.exists(endNode)){
				//closeList.add(endNode);
				isFinded = true;
				break;
			}
		}
		
		var endTime = new Date().getTime();
		this.diffTime = endTime - startTime;
		
		if(isFinded){
			return closeList;
		}else{
			return false;
		}
	};
};