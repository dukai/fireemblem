var BtnView = function(options){
	this._initBtnView(options);
}

BtnView.prototype = {
	_initBtnView: function(options){
		Kinetic.Group.call(this, options);
		var menuBg = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: 100,
			height:24,
			fill: 'green'
		});
		
		var word = new Kinetic.Text({
			x: 0,
			y: 4,
			text : this.getText(),
			fontSize: 14,
			fontFamily: "Microsoft YaHei",
			fill: '#fff',
			height:24,
			width:100,
			align : 'center',
			listening : false
		});
		
		menuBg.on('mouseover', function(e){
			this.setFill( '#090');
			this.getLayer().draw();
		});
		menuBg.on('mouseout', function(e){
			this.setFill('green');
			this.getLayer().draw();
		});
		
		this.add(menuBg);
		this.add(word);
	}
}
Kinetic.Global.extend(BtnView, Kinetic.Group);
Kinetic.Node.addGetterSetter(BtnView, 'text');