/**
 * Display Ojbects 
 */

this.Display = this.Display || {};

(function(display, uitl){

/**
 * A 2D Vector
 * @param {int} x
 * @param {int} y
 */
var Vector = function(x, y){
	this.x = x;
	this.y = y;
	
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	
	this.remove = function(v){
		this.x -= v.x;
		this.y -= v.y;
	};
	
	/**
	 * Vector multiply a number
	 * @param {int}  num
	 */
	this.multiplyNum = function(num){
		this.x *= num;
		this.y *= num;
	}
	
	this.clone = function(){
		return new Vector(this.x, this.y);
	};
	
	this.equal = function(v){
		if(this.x === v.x && this.y === v.y){
			return true;
		}
		return false;
	};
}

display.Vector = Vector;

/**
* A Rectangle Object
* @param {Vector} pos
* @param {int} width
* @param {int} height
*/
var Rect = function(pos, width, height){
	this.position = pos;
	this.width = width;
	this.height = height;

	this.setWidth = function(value){
		this.width = width;
	};

	this.setHeight = function(value){
		this.height = value;
	}

	this.clone = function(){
		return new Rect(this.position, this.width, this.height);
	}

	this.checkHit = function(rect){
		if(Math.abs((this.position.x + this.width / 2) - (rect.position.x + rect.width / 2)) < (this.width + rect.width) / 2 && Math.abs((this.position.y + this.height / 2) - (rect.position.y + rect.height / 2)) < (this.height + rect.height) / 2){
			return true;
		}
		return false;
	};
	
	this.checkContain = function(v, offsetV){
		if(offsetV === undefined){
			offsetV = new Vector(0, 0);
		}
		if((v.x > this.position.x + offsetV.x) && (v.y > this.position.y + offsetV.y) && v.x < this.position.x + offsetV.x + this.width && v.y < this.position.y + offsetV.y + this.height){
			return true;
		}
		return false;
	}
};

display.Rect = Rect;

/**
*基础实体对象，所有可绘制对象的基类
*@param {Vector} pos object position
*@param {int} width
*@param {int} height 
*@param {int} styles optional
*/

var DisplayObject = function(pos, width, height){
	
	DisplayObject.parentConstructor.call(this, pos, width, height);
	
	this.guid = DisplayObject.guid++;
	this.clickable = false;
	this.hitable = false;
	this.collisionMap = null;
	this.visible = true;
	this.styles = {border: {width: 1, color: '#000'}, fill: '#f00'};
	this._events = {};
	/**
	 * 对象的透明度，默认为1 
	 */
	this.alpha = 1;
	this.hitArea = new Rect(pos, width, height);
	this.regPosition = pos && pos.clone();
	this.scaleX = 1;
	this.scaleY = 1;
	/**
	 *is the object image cached, false by default 
	 */
	this.isCached = false;
	
	/**
	 *image cache, null by default  
	 */
	this.cache = null;
	this.onDraw = function(){};
	this.onClick = function(){};
	this.onUpdate = function(){};
	
	this.setStyles = function(styles){
		this.styles = styles;		
	}
	
	this.drawRect = function(context, styles){
		if(!styles){
			return false;
		}
		if(styles.border){
			context.strokeStyle = styles.border.color
			context.lineWidth = styles.border.width;
			context.strokeRect(this.position.x, this.position.y, this.width, this.height);
		}
		
		if(styles.fill){
			context.fillStyle = styles.fill;
			context.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
	};
	
	this._draw = function(context){
		this.drawRect(context, this.styles);
	};
	
	this.enableCache = function(){
		this.cache = util.createCanvas(MainApp.senceWidth, MainApp.senceHeight);
		this._draw(this.cache.context);
		this.isCached = true;
	}
	
	this.disableCache = function(){
		this.isCached = false;
	};
	
	this.updateCache = function(){
		this._draw(this.cache.context);
	};
	
	this.update = function(){
		this.onUpdate();
		this._update();
	}

	this._update = function(){};

	this.draw = function(context){
		context.save();
		context.globalAlpha = this.alpha;
		this.update();
		this.onDraw();
		
		if(this.isCached){
			context.drawImage(this.cache.canvas, 0, 0);
		}else{
			this._draw(context);
		}
		
		context.restore();
	};	
	
	this.setCollisionMap = function(map){
		this.collisionMap = map;
	};
};
/**
*extends Rect
*/
extend(DisplayObject, Rect);

DisplayObject.guid = 1;

display.DisplayObject = DisplayObject;

/**
 * a common Display layer 
 */
var DisplayLayer = function(){
	DisplayLayer.parentConstructor.call(this, MainApp.viewport, MainApp.viewport.width, MainApp.viewport.height);
	this.objects = [];
	this.add = function(o){
		this.objects.push(o);
	}
	
	this.remove = function(o){
		this.objects.splice(objects.indexOf(o), 1);
	}
	
	this.empty = function(){
		this.objects = [];
	}
	
	this.cache = uitl.createCanvas(this.width, this.height);
	
	this._draw = function(context){
		this.cache.context.clearRect(0, 0, this.width, this.height);
		
		for(var i = 0, len = this.objects.length; i < len; i++){
			this.objects[i].draw(this.cache.context);
		}
		
		context.drawImage(this.cache.canvas, MainApp.viewport.position.x, MainApp.viewport.position.y);
	};
};

extend(DisplayLayer, DisplayObject);

display.DisplayLayer = DisplayLayer;


var Viewport = function(minX, minY, maxX, maxY, realWidth, realHeight){
	Viewport.parentConstructor.call(this, new Vector(minX, minY), maxX - minX, maxY - minY);
	
	this._move = {
		duration: 0,
		speed: new Vector(0, 0),
		keep: false
	};

	this._shake = {
		duration: 0
	};
	
	this.move = function(speed, duration){
		this._move.duration = duration === undefined ? 1000 : duration * 1000;
		this._move.speed = speed;
	};
	

	this.shake = function(duration){
		(duration === undefined) && (duration =.2);
		this._shake.duration = duration * 1000;
	};


	
	this._update = function(){
		if(this._move.duration > 0 || this._move.keep){
			this._move.duration -= MainApp.diffTime;
			var distance = this._move.speed.clone();
			distance.multiplyNum(MainApp.diffTime / 1000);
			this.position.add(distance);
			if(this.width - this.position.x >= realX || this.position.x > minX){
				this.position.x -= distance.x;
			}
			
			if(this.height - this.position.y >= realY || this.position.y > minY){
				this.position.y -= distance.y;
			}

			this.position.x = ~~this.position.x;
			this.position.y = ~~this.position.y;
		};

		if(this._shake.duration > 0){
			if(!this._shake.originPosition)
				this._shake.originPosition = this.position.clone();

			this._shake.duration -= MainApp.diffTime;

			this.position.x =  ~~ (Math.random() * 10) + this._shake.originPosition.x;
			this.position.y =  ~~ (Math.random() * 10) + this._shake.originPosition.y;

		}else{
			if(this._shake.originPosition){
				this.position.x = this._shake.originPosition.x;
				this.position.y = this._shake.originPosition.y;
				this._shake.originPosition = null;
			}
		}

	};
	
	this.setRealX = function(width){
		realWidth = width;
	};
	
	this.getRealX = function(){
		return realWidth;
	}
	
	this.setRealY = function(height){
		realHeight = height;
	};
	
	this.getRealY = function(){
		return realHeight;
	}
	
};

extend(Viewport, Rect);


display.Viewport = Viewport;
})(Display, util);
