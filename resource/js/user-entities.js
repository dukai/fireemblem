var Animale = function(name){
	this.name = name;

	this.showName = function(){
		console.log(this.name);
	};

	this.eat = function(){
		console.log('Animale eat');
	};
};

Animale.prototype.breath = function(){
	console.log('Animale should breath!');
}


var Dog = function(name, food){

	Dog.parentConstructor.call(this, name);

	this.eat = function(){
		Dog.parent.eat();
		console.log('Dog eat' + food);
	};
};

extend(Dog, Animale);

var CursorPointerLayer = function(pos, name, widthCount, heightCount, tileWidth, tileHeight, tilesData){
	this.name = name;
	this.width = widthCount * tileWidth;
	this.height = heightCount * tileHeight;
	this.cursors = [];

	this.canvas = window.document.createElement('canvas');

	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.context = this.canvas.getContext('2d');

	for(var i = 0, len = tilesData.length; i < len; i++){

		var x = i % widthCount;
		var y = ~~(i / widthCount);
		var gid = tilesData[i];
		if(gid > 0){
			var tilePos = new Vector(x * tileWidth, y * tileHeight);

			var cursor = new CursorPointer(tilePos, tileWidth, tileHeight);
			this.cursors.push(cursor);
		}

	}

	CursorPointerLayer.parentConstructor.call(this, pos, this.width, this.height);

	this._draw = function(context){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i = 0, len = this.cursors.length; i < len; i++){
			this.cursors[i].draw(this.context);
		}

		context.drawImage(this.canvas, this.position.x, this.position.y);
	};

};

extend(CursorPointerLayer, EntityObject);

var CursorPointer = function(pos, width, height){

	CursorPointer.parentConstructor.call(this, pos, width, height);


	this.canShow = false;

	this._update = function(){
		if(this.checkContain(new Vector(MainApp.events.mouse.relX, MainApp.events.mouse.relY), MainApp.viewport.position)){
			this.canShow = true;
		}else{
			this.canShow = false;
		}
	};

	this._draw = function(context){
		if(this.canShow){
			
			context.strokeStyle = '#fff';
			context.lineWidth = 2;
			context.save();
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowColor = 'rgba(0,0,0,1)';
			context.shadowBlur =5;
			context.beginPath();
			context.moveTo(this.position.x, this.position.y);
			context.lineTo(this.position.x, this.position.y + 6);
			context.moveTo(this.position.x, this.position.y);
			context.lineTo(this.position.x + 6, this.position.y);

			context.moveTo(this.position.x + 32, this.position.y);
			context.lineTo(this.position.x + 26, this.position.y);
			context.moveTo(this.position.x + 32, this.position.y);
			context.lineTo(this.position.x + 32, this.position.y + 6);

			context.moveTo(this.position.x + 32, this.position.y + 32);
			context.lineTo(this.position.x + 26, this.position.y + 32);
			context.moveTo(this.position.x + 32, this.position.y + 32);
			context.lineTo(this.position.x + 32, this.position.y + 26);

			context.moveTo(this.position.x, this.position.y + 32);
			context.lineTo(this.position.x + 6, this.position.y + 32);
			context.moveTo(this.position.x, this.position.y + 32);
			context.lineTo(this.position.x, this.position.y + 26);
			context.stroke();
			context.restore();
			context.fillStyle = 'rgba(255, 255, 255, .2)';
			context.fillRect(this.position.x, this.position.y, 32, 32);
		}
		//context.restore();
	};

};

extend(CursorPointer, EntityObject);