var BtnView = function(options){
	this._initBtnView(options);
}

BtnView.prototype = {
	_initBtnView: function(options){
		Kinetic.Group.call(this, options);
		if(this.getImage()){
			var menuBg = new Kinetic.Image({
				x: 0,
				y: 0,
				width: this.getWidth(),
				height: this.getHeight(),
				fillPatternImage: this.getImage(),
				fillPatternOffset: {x: 0, y: 0},
			});
			menuBg.on('mousedown', function(e){
				this.setFillPatternOffset(0, 48);
				this.getLayer().draw();
				console.log('mousedown');
			});
			menuBg.on('mouseup', function(e){
				this.setFillPatternOffset(0, 0);
				console.log('mouseup');
			});
			this.add(menuBg);
		}else{
			var menuBg = new Kinetic.Rect({
				x: 0,
				y: 0,
				width: 140,
				height:50,
				fill: 'green'
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
		}
		
		if(this.getText()){
			var word = new Kinetic.Text({
				x: 0,
				y: 14,
				text : this.getText(),
				fontSize: 24,
				fontFamily: "Microsoft YaHei",
				fill: '#fff',
				height:40,
				width:140,
				align : 'center',
				listening : false
			});
			this.add(word);
		}
		
		
		
		
		
	}
}
Kinetic.Global.extend(BtnView, Kinetic.Group);
Kinetic.Node.addGetterSetter(BtnView, 'text');
Kinetic.Node.addGetterSetter(BtnView, 'image');