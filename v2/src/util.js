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
	},
	/**
	 *获取值在数组中的位置 
	 * @param {Object} value
	 * @param {Array} 数组
	 */
	arrayIndex: function(value, array){
		for (var i = 0, len = array.length; i < len; i++) {
			if (array[i] == value) {
				return i;
			}
		}

		return false;
	},
	/**
	 *按内容从数组中删除 
	 * @param {Object} value
	 * @param {Array} 数组
	 */
	removeByValue: function(value, array){
		var index = this.arrayIndex(value, array);
		array.splice(index, 1);
	},
	
	getRandFamilyName : function(){
		var str = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁锺徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓';
		var i = this.rand(0, str.length - 1);
		return str[i];
	},
	
	getRandFirstName : function(gender){
		var fmStr = '霞|婷|雪|薇|佳|可|芳|芬|月|慧|俊|盈|莹莹|雪|琳|晗|涵|琴|晴|丽|美|瑶|梦|茜|倩|希|夕|梅|月|悦|乐|彤|珍|依|沫|玉|灵|诚美|恩熙|恩惠|银淑|海淑|文姬|研书|信爱|美研|恩英|仁英|仁美|素研|善熙|善姬|美爱|恩京|银姬|慧娜|锡贤|彩媛|秀贤|贞媛|珍熙|恩圣|美娜|智研|敏姬|美珠|秀珠|珍珠|善珠|恩淑|诗妍|惠贞';
		var mStr = '嘉赐|嘉德|嘉福|嘉良|嘉茂|嘉木|嘉慕|嘉纳|嘉年|嘉平|嘉庆|嘉荣|嘉容|嘉瑞|嘉胜|嘉石|嘉实|嘉树|嘉澍|嘉熙|嘉禧|嘉祥|嘉歆|嘉许|嘉勋|嘉言|嘉谊|嘉懿|嘉颖|嘉佑|嘉玉|嘉誉|嘉悦|嘉运|嘉泽|嘉珍|嘉祯|嘉志|嘉致|坚白|坚壁|坚秉|坚成|坚诚|建安|建白|建柏|建本|建弼|建德|建华|建明|建茗|建木|建树|建同|建修|建业|建义|建元|建章|建中|健柏|金鑫|锦程|瑾瑜|晋鹏|经赋|经亘|经国|经略|经纶|经纬|经武|经业|经义|经艺|景澄|景福|景焕|景辉|景辉|景龙|景明|景山|景胜|景铄|景天|景同|景曜|靖琪|君昊|君浩|俊艾|俊拔|俊弼|俊才|俊材|俊驰|俊楚|俊达|俊德|俊发|俊风|俊豪|俊健|俊杰|俊捷|俊郎|俊力|俊良|俊迈|俊茂|俊美|俊民|俊名|俊明|俊楠|俊能|俊人|俊爽|俊悟|俊晤|俊侠|俊贤|俊雄|俊雅|俊彦|俊逸|俊英|俊友|俊语|俊誉|俊远|俊哲|俊喆|俊智|峻熙|季萌|季同|K|开畅|开诚|开宇|开济|开霁|开朗|凯安|凯唱|凯定|凯风|凯复|凯歌|凯捷|凯凯|凯康|凯乐|凯旋|凯泽|恺歌|恺乐|康安|康伯|康成|康德|康复|康健|康乐|康宁|康平|康胜|康盛|康时|康适|康顺|康泰|康裕|L|乐安|乐邦|乐成|乐池|乐和|乐家|乐康|乐人|乐容|乐山|乐生|乐圣|乐水|乐天|乐童|乐贤|乐心|乐欣|乐逸|乐意|乐音|乐咏|乐游|乐语|乐悦|乐湛|乐章|乐正|乐志|黎昕|黎明|力夫|力强|力勤|力行|力学|力言|立诚|立果|立人|立辉|立轩|立群|良奥|良弼|良才|良材|良策|良畴|良工|良翰|良吉|良骥|良俊|良骏|良朋|良平|良哲|理群|理全|茂才|茂材|茂德|茂典|茂实|茂学|茂勋|茂彦|敏博|敏才|敏达|敏叡|敏学|敏智|明诚|明达|明德|明辉|明杰|明俊|明朗|明亮|明旭|明煦|明轩|明远|明哲|明喆|明知|明志|明智|明珠|正|永|辉|波|涛|超|强|文|军|明|周|贵|友|鹏|在宇|在凡|在中|在勇|勇俊|仁俊|仁赫|在孝|银赫|哲秀|政焕|英生|政民|俊秀|政赫|俊奎|万奎|奎泰|昌修|昌民|贤俊|秉国|俊浩|承佑|哲永|胜贤|正泰|勇健|宇哲|基书|庆民|灿宇|东旭|东奎|成泽';
		var uStr;
		if(gender){
			uStr = mStr;
		}else{
			uStr = fmStr;
		}
		
		var array = uStr.split('|');
		return array[this.rand(0, array.length - 1)];
	},
	
	getName : function(gender){
		var familyName = this.getRandFamilyName();
		var firstName = this.getRandFirstName(gender);
		return familyName + firstName;
	}
	
	
};
