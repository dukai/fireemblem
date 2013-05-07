var AbstractView = function(options){
	this._initAbstractView(options);
}

AbstractView.prototype = {
	_initAbstractView: function(options){
		this.attrs = {};
		for(var i in options){
			this.attrs[i] = options[i];
		}
	}
};
