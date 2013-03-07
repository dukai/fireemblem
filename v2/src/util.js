var util = {
	/**
	 *产生制定范围内数组
	 * @param {int} min
	 * @param {int} max
	 */
	rand : function(m, n) {
		return Math.floor((n - m + 1) * Math.random() + m);
	},
	/**
	 *判读一个值是否在数组中
	 * @param {Object} 值
	 * @param {Array} 数组
	 */
	inArray : function(value, array) {
		for (var i = 0, len = array.length; i < len; i++) {
			if (array[i] == value) {
				return true;
			}
		}

		return false;
	}
};
