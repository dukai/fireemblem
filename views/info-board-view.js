var InfoBoardView = function(options){
	this._initInfoBoardView(options);
}

InfoBoardView.prototype = {
	_initInfoBoardView: function(options){
		Kinetic.Group.call(this, options);
		var menuBg = new Kinetic.Image({
			x: 0,
			y: 0,
			width: 167,
			height:108,
			image: resourceLoader.get('info_bg')
		});
		
		var username = this.username = new Kinetic.Text({
			x: 0,
			y: 10,
			text : '小明',
			fontSize: 12,
			fontFamily: "Microsoft YaHei",
			fill: '#fff',
			width:167,
			align : 'center',
			listening : false
		});
		
		var hp = new Kinetic.Text({
			x: 10,
			y: 30,
			text : 'HP',
			fontSize: 10,
			fontFamily: "Arial",
			fill: '#fff',
			height:24,
			width:25,
			align : 'right',
			listening : false
		});
		
		var exp = new Kinetic.Text({
			x: 10,
			y: 50,
			text : 'EXP',
			fontSize: 10,
			fontFamily: "Arial",
			fill: '#fff',
			width:25,
			align : 'right',
			listening : false
		});
		
		var hpPBV = this.hpPBV = new ProgressBarView({
			x: 40,
			y: 30,
			fill: '#fff'
		});
		
		var expPBV = this.expPBV = new ProgressBarView({
			x: 40,
			y: 50,
			fill: '#fff'
		});
		
		var hpDetail = this.hpDetail = new Kinetic.Text({
			x: 0,
			y: 20,
			text : '480/1000',
			fontSize: 10,
			fontFamily: "Arial",
			fill: '#fff',
			height:24,
			width:145,
			align : 'right',
			listening : false
		});
		
		var expDetail = this.expDetail = new Kinetic.Text({
			x: 0,
			y: 40,
			text : '480/1000',
			fontSize: 10,
			fontFamily: "Arial",
			fill: '#fff',
			height:24,
			width:145,
			align : 'right',
			listening : false
		});
		
		var attack = this.attack = new Kinetic.Text({
			x: 15,
			y: 65,
			text : '攻击 100',
			fontSize: 10,
			fontFamily: "Microsoft YaHei",
			fill: '#fff',
			height:24,
			width:80,
			align : 'left',
			listening : false
		});
		
		var armor = this.armor = new Kinetic.Text({
			x: 80,
			y: 65,
			text : '护甲 100',
			fontSize: 10,
			fontFamily: "Microsoft YaHei",
			fill: '#fff',
			height:24,
			width:80,
			align : 'left',
			listening : false
		});
		
		this.add(menuBg);
		this.add(username);
		this.add(hp);
		this.add(exp);
		this.add(hpPBV);
		this.add(expPBV);
		this.add(hpDetail);
		this.add(expDetail);
		this.add(attack);
		this.add(armor);
	},
	/**
	 *设置角色名字  
 	 * @param {String} name
	 */
	setName : function(name){
		this.username.setText(name);
	},
	/**
	 *设置当前血量 
	 * @param {Number} current 当前血量
	 * @param {Number} total 总血量
	 */
	setHP: function(current, total){
		this.hpDetail.setText(current + '/' + total);
		this.hpPBV.setPercent(current / total);
	},
	/**
	 * 设置当前经验条
	 * @param {Number} current
	 * @param {Number} total
	 */
	setEXP: function(current, total){
		this.expDetail.setText(current + '/' + total);
		this.expPBV.setPercent(current / total);
	},
	/**
	 *设置攻击 
 	 * @param {Number} attack
	 */
	setAttact: function(attack){
		this.attack.setText('攻击 ' + attack);
	},
	/**
	 *设置当前护甲 
 	 * @param {Number} armor
	 */
	setArmor: function(armor){
		this.armor.setText('护甲 ' + armor);
	}
};


Kinetic.Global.extend(InfoBoardView, Kinetic.Group);