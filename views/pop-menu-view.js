/**
 * pop menu for character  operation
 * @author dk
 * @date 2013/5/8 0:24
 */

var PopMenuView = function(config){
	this._initPopMenuView(config);
};

PopMenuView.prototype = {
	_initPopMenuView: function(config){
		Kinetic.Group.call(this, config);
		this.setName('popmenugroup');
		this.initItems();
	},
	
	initItems: function(){
		var self = this;
		var list = this.getItemsList();
		for(var i = 0, len = list.length; i < len; i++){
			var n = list[i];
			var menuBg = new Kinetic.Image({
				x: 0,
				y: i * 32,
				width: 106,
				height:32,
				fillPatternImage: resourceLoader.get('btn_bg'),
				fillPatternOffset: {x: 0, y: 0}
			});
			menuBg.menuindex = i;
			
			menuBg.on('click', function(e){
				e.cancelBubble = true;
				self.getItemsList()[this.menuindex].callback && self.getItemsList()[this.menuindex].callback();
				var layer = self.getLayer();
				self.remove();
				layer.draw();
			});
			
			menuBg.on('mousedown', function(e){
				this.setFillPatternOffset(0, 32);
				this.getLayer().draw();
			});
			
			var word = new Kinetic.Text({
				x: 0,
				y: i* 32 + 7,
				text : n.text,
				fontSize: 18,
				fontFamily: "Microsoft YaHei",
				fill: '#fff',
				height:32,
				width:106,
				align : 'center',
				listening : false
			});
			this.add(menuBg);
			this.add(word);
		}
	}
};
Kinetic.Global.extend(PopMenuView, Kinetic.Group);

Kinetic.Node.addGetterSetter(PopMenuView, 'itemsList');



