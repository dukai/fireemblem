//装备
var Equipment = function(){
	this.hitPoint = 0;
	this.stamina = 0;
	this.attackPower = 0;
	this.healPower = 0;
	this.physicalArmor = 0;
	this.magicArmor = 0;
	this.dodge = 0;
	this.criticalStrike = 0;
	this.lucky = 0;
	this.mobility = 0;
	
	this.propertyList = ['hitPoint', 'stamina', 'attackPower', 'healPower', 'physicalArmor', 'magicArmor', 'dodge', 'criticalStrike', 'lucky', 'mobility'];
	
	this.level = 1;
	this.type;
};

Equipment.prototype = {
	
};
/**
 *枚举，装备类型 
 */
Equipment.type = {
	head: 'head',
	chest: 'chest',
	leg: 'leg',
	hand: 'hand',
	wrist: 'wrist',
	foot: "foot",
	waist: "waist",
	adornmentLeft: "adornment_l",
	adornmentRight: "adornment_r",
	fingerLeft: "finger_l",
	fingerRight: "finger_r",
	weaponMain: "weapon_main",
	weaponSub: "weapon_sub"
};

/**
 *头盔类 
 */
var Helmet = function(){
	this.parent.__construct(this);
	this.type = Equipment.type.head;
	this.hitPoint = 20;
	
}
extend(Helmet, Equipment);
/*
 * 胸甲类
 */
var Cuirass = function(){
	this.parent.__construct(this);
	this.type = Equipment.type.chest;
	this.physicalArmor = 10;
}
extend(Cuirass, Equipment);



/**
 *装备管理器
 * @param {Person} person
 */
var EquipmentsManager = function(person){
	this.person = person;
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
		adornment_l: null,
		adornment_r: null,
		//戒指
		finger_l: null,
		finger_r: null,
		//武器
		weapon_main: null,
		weapon_sub: null
	};
	this.equipmentsList = [];
	
};
EquipmentsManager.prototype = {
	/*
	 * 装备一件装备
	 * @param {Equipment.type} 装备类型
	 * @param {Equipment} 装备
	 */
	equip: function(type, equipment){
		
		if(type != equipment.type){
			debug && console.log('此处无法装备此类装备');
			return;
		}
		if(equipment.level > this.person.level){
			debug && console.log('装备等级太高无法装备');
			return;
		}
		this.equipments[type] = equipment;
		this.equipmentsList.push(equipment);
		debug && console.log('装备成功');
	},
	/*
	 * 根据类型获取装备
	 * @param {Equipment.type} 类型
	 */
	getEquipment: function(type){
		return this.equipments[type];
	},
	getAttributeCollection: function(){
		
	}
};