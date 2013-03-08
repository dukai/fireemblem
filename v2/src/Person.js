/**
 *经验管理器 
 */
var Experience = function(){
	this.levelExpList = [];
	this.levelExp = -1;
	this.currentLevelExp = 0;
	this.level = -1;
};

Experience.prototype = {
	/**
	 *经验计算偏移量 
	 */
	expOffset: 40,
	/**
	 *根据等级获取当前等级升级需要的总经验 
	 * @param {Int} 等级
	 * @param {bool} 是否设为当前等级
	 * @param {bool} 是否加入到经验列表
	 */
	getLevelExp: function(level, isCurrentLevel, addToList){
		var totalExp = Math.ceil((Math.pow(level - 1,3) + this.expOffset ) / 10 * ((level  - 1) * 2 + this.expOffset));
		if(isCurrentLevel){
			this.level = level;
			this.levelExp = totalExp;
		}
		if(addToList){
			this.levelExpList[level] = totalExp;
		}
		
		return totalExp;
	},
	/**
	 *获取战斗经验 
	 * @param {Int} 攻击者等级
	 * @param {Int} 被攻击者等级
	 */
	getFightExp: function(positiveLevel, negativeLevel){
		var t = Math.pow((positiveLevel - 1) , 2);
		return Math.ceil(t + (this.expOffset / 2) + (t * (negativeLevel - positiveLevel) / 40));
	},
	/**
	 *是否为当前等级 
 	 * @param {Int} level
	 */
	isCurrentLevel: function(level){
		return level === this.level;
	},
	updateExp: function(exp, level){
		if(!this.isCurrentLevel(level)){
			this.getLevelExp(level, true);
			this.currentLevelExp = 0;
		}
		
		this.currentLevelExp += exp;
		if(this.currentLevelExp > this.levelExp){
			this.level++;
			this.currentLevelExp -= this.levelExp;
			return true;
		}
		
		return false;
	}
};

/**
 *人物角色.
 * @param {string} 人物名字
 * @param {bool} 性别，男性为true， 女性为false
 */
var Person = function(name , gender){
	if(gender == undefined){
		gender = true;
	}
	if(name){
		this.name = name;
	}else{
		this.name = util.getName(gender);
	}
	
	this.gender = gender;
	//等级
	this.level = 1;
	//经验
	this.exp = new Experience();
	this.exp.getLevelExp(this.level, true);
	
	//生命值
	this.hitPoint = 0;
	this.hitPointActual;
	//体能值
	this.stamina = 0;
	this.staminaActual;
	//攻击力
	this.attackPower = 0;
	this.attackPowerActual;
	//加血能力
	this.healPower = 0;
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
	//暴击伤害比例
	this.criticalStrikeDamage = 2;
	//幸运值
	this.lucky;
	this.luckyActual;
	//移动能力
	this.mobility;
	this.mobilityActual;
	//攻击范围
	this.attackRange = {min: 0, max: 0};
	//怒气值
	this.rage = 0;
	//必杀技
	this.mustKill;
	//消耗
	this.consume;
	//兵种
	this.units;
	/**
	 *防御装备类型 
	 */
	this.armorType;
	/**
	 *武器装备类型 
	 */
	this.weaponType;
	
	this.equipmentsManager = new EquipmentsManager(this);
};

Person.prototype = {
	/**
	 *攻击方法
	 * @param {Person} otherPerson 攻击目标 
	 */
	attack : function(otherPerson){
		if(otherPerson.hitPointActual === 0){
			debug && console.log("鞭尸不是好习惯，道德点减10");
			return;
		}
		debug && console.log(this.units + this.name + '对' + otherPerson.units + otherPerson.name + '发动了攻击：');
		var damagePercent = 1;
		var dodgeTurn = Math.ceil(Math.random() * 100);
		var criticalStrikeTurn = Math.ceil(Math.random() * 100);
		//是否暴击
		if(criticalStrikeTurn <= this.criticalStrike * (1 + this.lucky) * 100){
			damagePercent = this.criticalStrikeDamage;
			debug && console.log(this.units + this.name + '暴击了');
		}
		
		var actualDamage = Math.ceil(((this.attackPower * damagePercent) - otherPerson.physicalArmor) * (((this.hitPoint - this.hitPointActual) / this.hitPoint) + 1));
		//是否躲避
		if(dodgeTurn <= otherPerson.dodge * 100){
			actualDamage = 0;
		}
		if(actualDamage < 0){
			actualDamage = 1;
		}
		debug && console.log('造成了' + actualDamage + '点伤害'); 
		
		//计算伤害结果
		otherPerson.hitPointActual -= actualDamage;
		
		if(otherPerson.hitPointActual <= 0){
			debug && console.log(otherPerson.units + otherPerson.name + '已经死亡');
			otherPerson.hitPointActual = 0;
			
			var gains = this.exp.getFightExp(this.level, otherPerson.level);
			
			debug && console.log(this.name + '获取了' + gains + '点经验');
			if(this.exp.updateExp(gains, this.level)){
				this.levelUpgrade();
				debug && console.log(this.name + '升级了！当前等级：' + this.level);
			}
		}else{
			debug && console.log(otherPerson.name + '剩余生命值' + otherPerson.hitPointActual);
		}
		
	},
	/**
	 *治疗
	 * @param {Person} 治疗目标 
	 */
	heal: function(otherPerson){
		debug && console.log(this.name + '对' + otherPerson.name + '开始了治疗：');
		var healPercent = 1;
		var criticalStrikeTurn = Math.ceil(Math.random() * 100);
		//是否暴击
		if(criticalStrikeTurn <= this.criticalStrike * 100){
			healPercent = this.criticalStrikeDamage;
		}
		
		var actualHeal = (this.healPower * healPercent);
		otherPerson.hitPointActual += actualHeal;
		if(otherPerson.hitPointActual >= otherPerson.hitPoint){
			debug && console.log('血量满');
			otherPerson.hitPointActual = otherPerson.hitPoint;
		}else{
			debug && console.log(this.name + '为' + otherPerson.name + '治疗了' + actualHeal + '点生命');			
		}
		debug && console.log(otherPerson.units + otherPerson.name + '当前生命为' + otherPerson.hitPointActual);
	},
	/**
	 *装备武器 
	 */
	equip: function(type, equipment, position){
		this.equipmentsManager.equip(type, equipment, position);
	},
	/**
	 *升级 
	 */
	levelUpgrade : function(){
		this.level++;
	}
	
	
};
/**
 * 领袖 - 英雄.
 * @param {String} name 人物名称
 * @param {bool} gender 英雄性别，true为男，false为女
 */
var Hero = function(name, gender){
	Hero.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.chain;
	this.weaponType = Equipment.weaponType.sword;
	this.units = '领袖';
	this.hitPointActual = this.hitPoint = 480;
	this.attackPower = 50;
	this.physicalArmor = 25;
	this.magicArmor = 10;
	this.dodge = .08;
	this.criticalStrike = .2;
	this.lucky = .3;
	this.mobility = 4;
	this.attackRange = {min: 1, max: 1};
};

extend(Hero, Person);

/**
 * 骑士 - .
 * @param {String} name 人物名称
 * @param {bool} gender 英雄性别，true为男，false为女
 */
var Knight = function(name, gender){
	Knight.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.plate;
	this.weaponType = Equipment.weaponType.spear;
	this.units = '骑士';
	this.hitPointActual = this.hitPoint = 520;
	this.attackPower = 55;
	this.physicalArmor = 28;
	this.magicArmor = 10;
	this.dodge = .01;
	this.criticalStrike = .03;
	this.lucky = .1;
	this.mobility = 6;
	this.attackRange = {min: 1, max: 1};
};

extend(Knight, Person);

/**
 *弓箭手 
 * @param {Object} name
 * @param {Object} gender
 */
var Archer = function(name, gender){
	Archer.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.leather;
	this.weaponType = Equipment.weaponType.bow;
	this.units = '弓箭手';
	this.hitPointActual = this.hitPoint = 450;
	this.attackPower = 60;
	this.physicalArmor = 20;
	this.magicArmor = 10;
	this.dodge = .08;
	this.criticalStrike = .1;
	this.lucky = .1;
	this.mobility = 3;
	this.attackRange = {min: 2, max: 3};
}
extend(Archer, Person);

/**
 *法师 
 * @param {Object} name
 * @param {Object} gender
 */
var Wizard = function(name, gender){
	Wizard.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.cloth;
	this.weaponType = Equipment.weaponType.staff;
	this.units = '法师';
	this.hitPointActual = this.hitPoint = 320;
	this.attackPower = 90;
	this.physicalArmor = 10;
	this.magicArmor = 40;
	this.dodge = .06;
	this.criticalStrike = .12;
	this.lucky = .1;
	this.mobility = 1;
	this.attackRange = {min: 2, max: 4};
}
extend(Wizard, Person);

/**
 *步兵 
 * @param {Object} name
 * @param {Object} gender
 */
var Infantry = function(name, gender){
	Infantry.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.plate;
	this.weaponType = Equipment.weaponType.chopper;
	this.units = '步兵';
	this.hitPointActual = this.hitPoint = 620;
	this.attackPower = 40;
	this.physicalArmor = 42;
	this.magicArmor = 10;
	this.dodge = .01;
	this.criticalStrike = .01;
	this.lucky = .1;
	this.mobility = 3;
	this.attackRange = {min: 1, max: 1};
}
extend(Infantry, Person);


/**
 *牧师
 * @param {Object} name
 * @param {Object} gender
 */
var Pastor = function(name, gender){
	Pastor.parent.__construct(this, [name, gender]);
	//设置装备类型
	this.armorType = Equipment.armorType.cloth;
	this.weaponType = Equipment.weaponType.book;
	this.units = '牧师';
	this.hitPointActual = this.hitPoint = 430;
	this.attackPower = 10;
	this.healPower = 50;
	this.physicalArmor = 20;
	this.magicArmor = 40;
	this.dodge = .06;
	this.criticalStrike = .08;
	this.lucky = .1;
	this.mobility = 2;
	this.attackRange = {min: 1, max: 2};
}
extend(Pastor, Person);

