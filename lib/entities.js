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

/**
*基础实体对象，所有可绘制对象的基类
*@param {Vector} pos object position
*@param {int} width
*@param {int} height 
*@param {int} styles optional
*/

var EntityObject = function(pos, width, height, styles){

	EntityObject.parentConstructor.call(this, pos, width, height);

	this.guid = EntityObject.guid++;
	this.clickable = false;
	this.hitable = false;
	this.collisionMap = null;
	this.visual = false;
	this.styles = styles;
	
	this._events = {};
	
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

	this._update = function(){};

	this.draw = function(context){
		context.save();
		this._update();
		this._draw(context);
		context.restore();
	};
	
	
	this.setCollisionMap = function(map){
		this.collisionMap = map;
	};
};
/**
*extends Rect
*/
extend(EntityObject, Rect);

EntityObject.guid = 1;

/**
 *Text Entity Object
 * @param {string} content
 * @param {Vector} pos
 * @param {object} styles {fillStyle: '', font: '', 'textBaseline: ''}
 * @param {int} width optional
 * @param {int} height optional  
 */
var TextEntityObject = function(content, pos, styles, width, height){
	
	(width === undefined) && (width = util.getTextWidth(content, styles, MainApp.dContext));
	(height === undefined) && (height = parseInt(/(\d+?)px/.exec(styles.font)[1]));

	TextEntityObject.parentConstructor.call(this, pos, width, height);

	this.content = content;
	
	this.setContent = function(content){
		this.content = content;
	};
	
	this.setStyle = function(s){
		for(var attr in s){
			styles[attr] = s[attr];
		}
	};
	
	this._draw = function(context){
		
		//TextEntityObject.parent.drawRect.call(this, context, {border: {width: .5, color:'#000'}});

		for(var attr in styles){
			context[attr] = styles[attr];
		}
		
		context.fillText(this.content, this.position.x, this.position.y);
	};

}

extend(TextEntityObject, EntityObject);


var ImageEntityObject = function(img, pos, width, height){
	
	(width === undefined) && (width = img.width);
	(height === undefined) && (height = img.height);

	ImageEntityObject.parentConstructor.call(this, pos, width, height);

	this.img = img;

	this._draw = function(context){
		context.drawImage(this.img, this.position.x, this.position.y);
	};
};

extend(ImageEntityObject, EntityObject);


var LoadScreen = function(){
	LoadScreen.parentConstructor.call(this, new Vector(0, 0), 0, 0);

	var backgroundRect = new EntityObject(new Vector(267, 210), 106, 10, {border: {color: '#ccc', width: '2'}});
	var forgroundRect = new EntityObject(new Vector(270, 213), 0, 4, {fill: '#999'});
	var text = new TextEntityObject('正在为您载入', new Vector(281, 190), {fillStyle: '#000', font: 'bold 12px 微软雅黑', 'textBaseline': 'top'});

	this._draw = function(context){
		backgroundRect.draw(context);
		forgroundRect.draw(context);
		text.draw(context);
	}
	
	this.setProgress = function(percent){
		forgroundRect.width = 100 * percent;
	}
};

extend(LoadScreen, EntityObject);


var CollisionEntityObject = function(pos, width, height){
	CollisionEntityObject.parentConstructor.call(this, pos, width, height);
};

extend(CollisionEntityObject, EntityObject);

var CollistionMap = function(){
	var objectsIds = [];
	var objects = {};
	
	this.add = function(o){
		objectsIds.push(o.guid);
		objects[o.guid] = o;
	};
	
	this.remove = function(o){
		var index = objectsIds.indexOf(o.guid);
		delete objects[o.guid];
		objectsIds.splice(index, 1);
	};
	
	this.checkCollide = function(rect){
		for(var i = 0, len = objectsIds.length; i < len; i++){
			var co = objects[objectsIds[i]];
			
			if(co.checkHit(rect)){
				return true;
			}
		}
		
		return false;
	};
};
/**
* Sprint Animate Object
* @param {Vector} pos
* @param {img} img
* @param {animType} Sprite.ANIM_TYPE
* @param {split}
*/

var Sprite = function(pos, img, animType, split, speed){
	
	this.img = img;
	this.animType = animType;
	if(animType === Sprite.ANIM_TYPE.VERTICAL){
		this.width = img.width;
		this.height = split;
		this.frames = ~~(img.height / split);
	}else if(animType === Sprite.ANIM_TYPE.HORIZONTAL){
		this.width = split;
		this.height = img.height;
		this.frames = ~~(img.width / split);
	}
	
	Sprite.parentConstructor.call(this, pos, this.width, this.height);
	
	!!speed ? (this.speed = speed) : (this.speed = new Vector(0, 0));
	this.currFrame = 0;
	
	
	
	this._update = function(){
		this.currFrame += (MainApp.nowTime - MainApp.startTime) * 10 / 1000;
		this.currFrame %= this.frames;
		
		this.position.x += (MainApp.diffTime) * this.speed.x / 1000;
		this.position.y += MainApp.diffTime * this.speed.y / 1000;
		if(this.position.x > 640){
			//this.position.x = 0;
		}
	};
	
	this._draw = function(context){
		var f = ~~this.currFrame;
		if(this.animType === Sprite.ANIM_TYPE.VERTICAL){
			context.drawImage(this.img, 0,  f * this.height , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
		}else if(this.animType === Sprite.ANIM_TYPE.HORIZONTAL){
			context.drawImage(this.img, f * this.width, 0 , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
		}
	}
};

extend(Sprite, EntityObject);

Sprite.ANIM_TYPE = {
	VERTICAL: 1,
	HORIZONTAL: 2
}


var ViewPort = function(minX, minY, maxX, maxY, realX, realY){
	ViewPort.parentConstructor.call(this, new Vector(minX, minY), maxX - minX, maxY - minY);
	
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
	
	this.setRealX = function(x){
		realX = x;
	};
	
	this.setRealY = function(y){
		realY = y;
	};
	
	this._draw = function(){};
};

extend(ViewPort, EntityObject);
