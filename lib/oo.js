(function(win, undefined){

/**
 * extend method for js class
 * @param subClass
 * @param baseClass
 */
var extend = function(subClass, baseClass){
	var parent = subClass.parent = {
		'__construct': function(obj, args){
			baseClass.apply(obj, args);
		}
	};
	
	for(var method in baseClass.prototype){
		subClass.prototype[method] = parent[method] = baseClass.prototype[method];
	}
};

window.extend = extend;
})(window);

