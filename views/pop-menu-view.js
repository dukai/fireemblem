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
		
		this.initItems();
	},
	
	initItems: function(){
		var self = this;
		var list = this.getItemsList();
		for(var i = 0, len = list.length; i < len; i++){
			var n = list[i];
			var menuBg = new Kinetic.Rect({
				x: 0,
				y: i * 25,
				width: 100,
				height:24,
				fill: 'green'
			});
			menuBg.menuindex = i;
			
			menuBg.on('click', function(e){
				self.getItemsList()[this.menuindex].callback && self.getItemsList()[this.menuindex].callback();
			});
			var word = new Kinetic.Text({
				x: 0,
				y: i* 25 + 4,
				text : n.text,
				fontSize: 14,
				fontFamily: "Microsoft YaHei",
				fill: '#fff',
				height:24,
				width:100,
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



