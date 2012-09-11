/**
 * Display Ojbects 
 */

this.Display = Display || {};

(function(display){

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

var DisplayObject = function(pos, width, height){
	
	EntityObject.parentConstructor.call(this, pos, width, height);
	
	this.guid = EntityObject.guid++;
	this.clickable = false;
	this.hitable = false;
	this.collisionMap = null;
	this.visible = true;
	this.styles = {border: {width: 1, color: '#000'}};
	this._events = {};
	/**
	 * 对象的透明度，默认为1 
	 */
	this.alpha = 1;
	
	
	
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







})(Display);
