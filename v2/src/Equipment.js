/**
 *装备 
 */
var Equipment = function(){
	
	this.name;
	
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
	/**
	 *所有属性列表 
	 */
	this.propertyList = ['hitPoint', 'stamina', 'attackPower', 'healPower', 'physicalArmor', 'magicArmor', 'dodge', 'criticalStrike', 'lucky', 'mobility'];
	/**
	 *激活的属性列表 
	 */
	this.activePropertyList = [];
	/**
	 *装备等级 
	 */
	this.level = 1;
	/**
	 *装备部位类型 
	 */
	this.type = null;
	/**
	 *装备护甲类型 
	 */
	this.armorType = null;
	/**
	 *装备武器类型 
	 */
	this.weaponType = null;
	
};

Equipment.prototype = {
	/**
	 *初始化装备属性
	 * @param {JSON} 装备属性集合 
	 */
	initEquipmentProperty: function(data){
		for(var name in data){
			if(util.inArray(name, this.propertyList)){
				this[name] = data[name];
				this.activePropertyList.push(name);
			}
		}
	},
	/**
	 *设置装备名字
	 * @param {String} name 
	 */
	setName : function(name){
		this.name = name;
	}
};
/**
 *装备部位类型，装备类型对应身体的装备部位
 */
Equipment.type = {
	/**
	 * 头
	 */
	head: 'head',
	/**
	 *胸 
	 */
	chest: 'chest',
	/**
	 *腿 
	 */
	leg: 'leg',
	/**
	 *手 
	 */
	hand: 'hand',
	/**
	 *手腕 
	 */
	wrist: 'wrist',
	/**
	 *脚 
	 */
	foot: "foot",
	/**
	 *腰 
	 */
	waist: "waist",
	/**
	 *饰品 
	 */
	adornment: "adornment",
	/**
	 *手指
	 */
	finger: "finger",
	/**
	 *主武器 
	 */
	weaponMain: "weapon_main",
	/**
	 *副武器 
	 */
	weaponSub: "weapon_sub"
};
/**
 *护甲装备类型
 */
Equipment.armorType = {
	/**
	 *布甲 
	 */
	cloth : 0,
	/**
	 *皮甲 
	 */
	leather : 1,
	/**
	 *锁甲 
	 */ 
	chain : 2,
	/**
	 *板甲 
	 */
	plate : 3 
};
/**
 *武器装备类型 
 */
Equipment.weaponType = {
	/**
	 *剑 
	 */
	sword: 0,
	/**
	 *枪 
	 */
	spear: 1,
	/**
	 *弓 
	 */
	bow: 2,
	/**
	 *法杖 
	 */
	staff: 3,
	/**
	 *刀斧 
	 */
	chopper: 4,
	/**
	 *书 
	 */
	book: 5
};

/**
 *头盔类 
 */
var Helmet = function(){
	Helmet.parent.__construct(this);
	this.name = "头盔";
	this.type = Equipment.type.head;
	this.activePropertyList.push('hitPoint');
	
};
extend(Helmet, Equipment);

var ClothHelmet = function(){
	ClothHelmet.parent.__construct(this);
	
	this.name = "布甲头盔";
	this.armorType = Equipment.armorType.cloth;
	this.hitPoint = 10;
};
extend(ClothHelmet, Helmet);

var LeatherHelmet = function(){
	LeatherHelmet.parent.__construct(this);
	
	this.name = "皮甲头盔";
	this.armorType = Equipment.armorType.leather;
	this.hitPoint = 15;
};
extend(LeatherHelmet, Helmet);

var ChainHelmet = function(){
	ChainHelmet.parent.__construct(this);
	
	this.name = "锁甲头盔";
	this.armorType = Equipment.armorType.chain;
	this.hitPoint = 20;
};
extend(ChainHelmet, Helmet);

var PlateHelmet = function(){
	PlateHelmet.parent.__construct(this);
	
	this.name = "板甲头盔";
	this.armorType = Equipment.armorType.plate;
	this.hitPoint = 25;
};
extend(PlateHelmet, Helmet);



/**
 * 胸甲类
 */
var Cuirass = function(){
	Cuirass.parent.__construct(this);
	
	this.name = "胸甲"
	this.type = Equipment.type.chest;
	this.physicalArmor = 10;
	this.activePropertyList.push('physicalArmor');
	this.activePropertyList.push('hitPoint');
};
extend(Cuirass, Equipment);
/**
 *布甲胸甲
 */
var ClothCuirass = function(){
	ClothCuirass.parent.__construct(this);
	
	this.name = "布甲胸甲";
	this.armorType = Equipment.armorType.cloth;
	this.hitPoint = 10;
};
extend(ClothCuirass, Cuirass);

/**
 *皮甲胸甲
 */
var LeatherCuirass = function(){
	LeatherCuirass.parent.__construct(this);
	
	this.name = "皮甲胸甲";
	this.armorType = Equipment.armorType.leather;
	this.hitPoint = 15;
};
extend(LeatherCuirass, Cuirass);

/**
 *锁甲胸甲
 */
var ChainCuirass = function(){
	ChainCuirass.parent.__construct(this);
	
	this.name = "锁甲胸甲";
	this.armorType = Equipment.armorType.chain;
	this.hitPoint = 20;
};
extend(ChainCuirass, Cuirass);

var PlateCuirass = function(){
	PlateCuirass.parent.__construct(this);
	
	this.name = "板甲胸甲";
	this.armorType = Equipment.armorType.plate;
	this.hitPoint = 25;
};
extend(PlateCuirass, Cuirass);


/**
 *腿甲 
 */
var LegGuard = function(){
	LegGuard.parent.__construct(this);
	
	this.name = "腿甲";
	this.type = Equipment.type.leg;
	this.activePropertyList.push('physicalArmor');
};
extend(LegGuard, Equipment);
var ClothLegGuard = function(){
	ClothLegGuard.parent.__construct(this);
	
	this.name = "布甲腿甲";
	this.armorType = Equipment.armorType.cloth;
	this.hitPoint = 10;
};
extend(ClothLegGuard, LegGuard);
var LeatherLegGuard = function(){
	LeatherLegGuard.parent.__construct(this);
	this.name = "皮甲腿甲";
	this.armorType = Equipment.armorType.leather;
	this.hitPoint = 15;
};
extend(LeatherLegGuard, LegGuard);
var ChainLegGuard = function(){
	ChianLegGuard.parent.__construct(this);
	this.name = "锁甲腿甲";
	this.armorType = Equipment.armorType.chain;
	this.hitPoint = 20;
};
extend(ChainLegGuard, LegGuard);
var PlateLegGuard = function(){
	PlateLegGuard.parent.__construct(this);
	this.name = "板甲腿甲";
	this.armorType = Equipment.armorType.plate;
	this.hitPoint = 25;
};
extend(PlateLegGuard, LegGuard);
/**
 *手套 
 */
var Glove = function(){
	Glove.parent.__construct(this);
	
	this.name = "手套";
	this.type = Equipment.type.hand;
	this.physicalArmor = 5;
	this.activePropertyList.push('physicalArmor');
	this.activePropertyList.push('hitPoint');
};
extend(Glove, Equipment);
var ClothGlove = function(){
	ClothGlove.parent.__construct(this);
	this.name = "布甲手套";
	this.armorType = Equipment.armorType.cloth;
	this.hitPoint = 10;
};
extend(ClothGlove, Glove);
var LeatherGlove = function(){
	LeatherGlove.parent.__construct(this);
	this.name = "皮甲手套";
	this.armorType = Equipment.armorType.leather;
	this.hitPoint = 15;
};
extend(LeatherGlove, Glove);
var ChainGlove = function(){
	ChainGlove.parent.__construct(this);
	this.name = "锁甲手套";
	this.armorType = Equipment.armorType.chain;
	this.hitPoint = 20;
};
extend(ChainGlove, Glove);
var PlateGlove = function(){
	PlateGlove.parent.__construct(this);
	this.name = "板甲手套";
	this.armorType = Equipment.armorType.plate;
	this.hitPoint = 25;
};
extend(PlateGlove, Glove);
/**
 *护腕 
 */
var Armlet = function(){
	Armlet.parent.__construct(this);
	
	this.name = "护腕";
	this.type = Equipment.type.wrist;
	this.activePropertyList.push('physicalArmor');
};
extend(Armlet, Equipment);
var ClothArmlet = function(){
	ClothArmlet.parent.__construct(this);
	this.name = "布甲护腕";
	this.armorType = Equipment.armorType.cloth;
	this.hipPoint = 10;
};
extend(ClothArmlet, Armlet);
var LeatherArmlet = function(){
	LeatherArmlet.parent.__construct(this);
	this.name = "皮甲护腕";
	this.armorType = Equipment.armorType.leather;
	this.hipPoint = 15;
};
extend(LeatherArmlet, Armlet);
var ChainArmlet = function(){
	ChainArmlet.parent.__construct(this);
	this.name = "锁甲护腕";
	this.armorType = Equipment.armorType.chain;
	this.hipPoint = 20;
};
extend(ChainArmlet, Armlet);
var PlateArmlet = function(){
	PlateArmlet.parent.__construct(this);
	this.name = "板甲护腕";
	this.armorType = Equipment.armorType.plate;
	this.hipPoint = 25;
};
extend(PlateArmlet, Armlet);


/**
 *鞋子 
 */
var Boot = function(){
	Boot.parent.__construct(this);
	
	this.name = "鞋子";
	this.type = Equipment.type.foot;
	this.activePropertyList.push('physicalArmor');
};
extend(Boot, Equipment);
var ClothBoot = function(){
	ClothBoot.parent.__construct(this);
	
	this.name = "布甲鞋子";
	this.armorType = Equipment.armorType.cloth;
	this.hitPoint = 10;
};
extend(ClothBoot, Boot);

var LeatherhBoot = function(){
	LeatherhBoot.parent.__construct(this);
	
	this.name = "皮甲鞋子";
	this.armorType = Equipment.armorType.leather;
	this.hitPoint = 15;
};
extend(LeatherhBoot, Boot);

var ChainhBoot = function(){
	ChainhBoot.parent.__construct(this);
	
	this.name = "锁甲鞋子";
	this.armorType = Equipment.armorType.chain;
	this.hitPoint = 20;
};
extend(ChainhBoot, Boot);
var PlateBoot = function(){
	PlateBoot.parent.__construct(this);
	
	this.name = "板甲鞋子";
	this.armorType = Equipment.armorType.plate;
	this.hitPoint = 25;
};
extend(PlateBoot, Boot);
/**
 *腰带 
 */
var Belt = function(){
	Belt.parent.__construct(this);
	
	this.name = "腰带";
	this.type = Equipment.type.waist;
	this.activePropertyList.push('physicalArmor');
};
extend(Belt, Equipment);
var ClothBelt = function(){
	ClothBelt.parent.__construct(this);
	this.name = "布甲腰带";
	this.armorType = Equipment.armorType.cloth;
	this.hipPoint = 10;
};
extend(ClothBelt, Belt);
var LeatherBelt = function(){
	LeatherBelt.parent.__construct(this);
	this.name = "皮甲腰带";
	this.armorType = Equipment.armorType.leather;
	this.hipPoint = 15;
};
extend(LeatherBelt, Belt);

var ChainBelt = function(){
	ChainBelt.parent.__construct(this);
	this.name = "锁甲腰带";
	this.armorType = Equipment.armorType.chain;
	this.hipPoint = 20;
};
extend(ChainBelt, Belt);
var PlateBelt = function(){
	PlateBelt.parent.__construct(this);
	this.name = "板甲腰带";
	this.armorType = Equipment.armorType.plate;
	this.hipPoint = 25;
};
extend(PlateBelt, Belt);
/**
 *饰品 
 */
var Adornment = function(){
	Adornment.parent.__construct(this);
	
	this.name = "饰品";
	this.type = Equipment.type.adornment;
}
extend(Adornment, Equipment);
/**
 *指环 
 */
var Ring = function(){
	Ring.parent.__construct(this);
	
	this.name = "指环";
	this.type = Equipment.type.finger;
}
extend(Ring, Equipment);
/**
 *武器 
 */
var Weapon = function(){
	Weapon.parent.__construct(this);
	this.type = Equipment.type.weaponMain;
	this.activePropertyList.push('attackPower');
}
extend(Weapon, Equipment);
/**
 *剑 
 */
var Sword = function(){
	Sword.parent.__construct(this);
	
	this.name = "剑";
	this.weaponType = Equipment.weaponType.sword;
	this.attackPower = 10;
}
extend(Sword, Weapon);
/**
 *长枪 
 */
var Spear = function(){
	Spear.parent.__construct(this);
	
	this.name = "长枪";
	this.weaponType = Equipment.weaponType.spear;
	this.attackPower = 10;
}
extend(Spear, Weapon);

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
		adornment: [],
		//戒指
		finger: [],
		//武器
		weapon_main: null,
		weapon_sub: null
	};
	this.equipmentsList = [];
	this.properties = {};
	
};

EquipmentsManager.prototype = {
	/**
	 * 装备一件装备
	 * @param {Equipment.type} 装备类型
	 * @param {Equipment} 装备
	 * @param {int, optional} 位置，指环和饰品
	 */
	equip: function(type, equipment, position){
		//排除装备为戒指和饰品的情况
		if(equipment.armorType === null && equipment.weaponType === null && (equipment.type !== Equipment.type.finger && equipment.type !== Equipment.type.adornment)){
			debug && console.log(equipment.name + "装备失败：未知类型的装备");
			return;
		}
		if(equipment.armorType !== null && this.person.armorType < equipment.armorType){
			debug && console.log(equipment.name + '装备失败：无法装备此种类型的护甲');
			return;
		}
		
		if(equipment.weaponType !== null && this.person.weaponType != equipment.weaponType){
			debug && console.log(equipment.name + '装备失败：无法装备此种类型的武器');
			return;
		}
		
		
		if(type != equipment.type){
			debug && console.log(equipment.name + '装备失败：此处无法装备此类装备');
			return;
		}
		if(equipment.level > this.person.level){
			debug && console.log(equipment.name + '装备失败：装备等级太高无法装备');
			return;
		}
		if(this.equipments[type] instanceof Array){
			if(this.equipments[type].length > 0){
				position = 1;
			}else{
				position = 0;
			}
		}
		if(position === undefined){
			var e = this.equipments[type];
			this.equipments[type] = equipment;
		}else{
			position = parseInt(position);
			if(position > 1){
				position = 0;
			}
			var e = this.equipments[type][position];
			this.equipments[type][position] = equipment;
		}
		if(e !== null && this.equipmentsList.length > 0){
			util.removeByValue(e, this.equipmentsList);
		}
		
		this.equipmentsList.push(equipment);
		debug && console.log(equipment.name + '装备成功');
	},
	/**
	 * 根据类型获取装备
	 * @param {Equipment.type} 类型
	 */
	getEquipment: function(type){
		return this.equipments[type];
	},
	/**
	 *获取所有装备属性集合 
	 */
	getPropertyCollection: function(){
		this.properties = {};
		for(var i = 0, len = this.equipmentsList.length; i < len; i++){
			var e = this.equipmentsList[i];
			for(var pi in e.activePropertyList){
				var pName = e.activePropertyList[pi];
				if(this.properties[pName] !== undefined){
					this.properties[pName] += e[pName];
				}else{
					this.properties[pName] = e[pName];
				}
			} 
		}
		return this.properties;
	}
};