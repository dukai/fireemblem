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
	
	baseClass.call(parent);


	for(var method in baseClass.prototype){
		subClass.prototype[method] = parent[method] = baseClass.prototype[method];
	}
};