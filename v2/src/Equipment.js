//装备
var Equipment = function(){
	this.hitPoint;
	this.stamina;
	this.attack;
	this.physicalArmor;
	this.magicArmor;
	this.dodge;
	this.criticalStrike;
	this.lucky;
	this.mobility;
};

Equipment.type = {
	
}

/**
 *装备管理器
 */
var EquipmentsManager = function(){
	this.equipments = {
		//头部
		head: null,
		//胸部
		chest: null,
		//腿部
		leg: null,
		//手部
		hand: null,
		//手腕
		wrist: null,
		//鞋子
		foot: null,
		//腰部
		waist: null,
		//饰品
		adornment: {
			left: null,
			right: null
		},
		//戒指
		finger: {
			left: null,
			right: null
		}
	};
	
};
EquipmentsManager.prototype = {
	equip: function(type, equipment){
		
	}
};