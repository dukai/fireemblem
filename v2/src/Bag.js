/**
 *背包
 * @author DK
 */
var Bag = function(){
	//背包内容列表
	this.itemList = [];
	//背包列数
	this.column = 5;
	/**
	 * 初始解锁的背包栏数目
	 * @type {number}
	 */
	this.origUnlock = 29;
	/**
	 * 当前解锁的背包栏数目
	 * @type {number}
	 */
	this.currentUnlock = this.origUnlock;
};

Bag.prototype = {
	/**
	 *将index转换为xy坐标
	 * @param {Int} index
	 * @return {json}
	 */
	index2XY: function(index){
		var position = {};
		position.x = index % this.column;
		position.y = Math.floor(index / this.column);
		return position;
	},
	/**
	 * 将xy坐标转换为index
	 * @param {Int} x
	 * @param {Int} y
	 * @returns {number}
	 */
	xy2Index: function(x, y){
		var index = y * this.column + x;
		return index;
	},
	/**
	 *添加一个对象到背包
	 * @param {Object} item
	 * @param {int} x
	 * @param {int, optional} y
	 * @returns {boolean}
	 */
	addItem: function(item, x, y){
		var index = -1;
		if(arguments.length == 3){
			index = this.xy2Index(x, y);
		}else if(arguments.length == 2){
			index = x;
		}else{
			return false;
		}

		this.itemList[index] = item;
	},
	/**
	 * 从背包中移除对象
	 * @param {int} x
	 * @param {int, optional} y
	 * @returns {boolean}
	 */
	removeItem: function(x, y){
		var index = -1;
		switch (arguments.length){
			case 2:{
				index = this.xy2Index(x, y);
				break;
			};
			case 1:{
				index = x;
				break;
			}
			default :
				return false;
		}

		this.itemList[index] = null;
	},
	/**
	 * 交换位置
	 * @param positionF
	 * @param positionS
	 */
	swapItem: function(positionF, positionS){
		var indexF = this.xy2Index(positionF.x, positionF.y);
		var indexS = this.xy2Index(positionS.x, positionS.y);
		var middle = this.itemList[indexF];
		this.itemList[indexF] = this.itemList[indexS];
		this.itemList[indexS] = middle;
	}
};