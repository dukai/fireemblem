/**
 *人物角色.
 */
var Person = function(){
	this.name;
	this.gender;
	//生命值
	this.hitPoint;
	this.hitPointActual;
	//体能值
	this.stamina;
	this.staminaActual;
	//攻击力
	this.attackPower;
	this.attackPowerActual;
	//物理防御
	this.physicalArmor;
	this.physicalArmorActual;
	//魔法防御
	this.magicArmor;
	this.magicArmorActual;
	//躲闪几率
	this.dodge;
	this.dodgeActual;
	//暴击
	this.criticalStrike;
	this.criticalStrikeActual;
	//幸运值
	this.lucky;
	this.luckyActual;
	//移动能力
	this.mobility;
	this.mobilityActual;
	//怒气值
	this.rage = 0;
	//必杀技
	this.mustKill;
	//消耗
	this.consume;
	
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
		adornment: null
		//戒指
		finger: null
	};
	//攻击
	this.attack = function(){};
};

var Hero = function(){
	this.parent.__construct(this);
	this.attack = 30;
	this.physicalArmor = 20;
	this.magicArmor = 10;
	this.dodge = .05;
	this.criticalStrike = .05;
	this.lucky = .3;
	this.mobility = 3;
};



extend(Hero, Person);


