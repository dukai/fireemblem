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
				y: i * 40,
				width: 132,
				height:38,
				image: resourceLoader.get('btn_bg')
			});
			menuBg.menuindex = i;
			
			menuBg.on('click', function(e){
				e.cancelBubble = true;
				self.getItemsList()[this.menuindex].callback && self.getItemsList()[this.menuindex].callback();
				var layer = self.getLayer();
				self.remove();
				layer.draw();
			});
			
			var word = new Kinetic.Text({
				x: 0,
				y: i* 40 + 10,
				text : n.text,
				fontSize: 18,
				fontFamily: "Microsoft YaHei",
				fill: '#fff',
				height:38,
				width:132,
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



