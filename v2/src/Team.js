/**
 *战队系统 
 */
var Team = function(){
	this.maxColumnCount = 4;
	this.maxRowCount = 4;
	this.activeColumnCount = 2;
	this.activeRowCount = 2;
	this.formationTable = [
		[], [], [], []
	];
	
	this.availablePositions = [];
	
};

Team.prototype = {
	/**
	 *将角色添加到战队中 
	 * @param {Person} person
	 * @param {int} rowIndex
	 * @param {int} columnIndex
	 */
	addToTeam: function(person, rowIndex, columnIndex){
		if(this.positionAvailable(rowIndex, columnIndex)){
			this.formatinTable[rowIndex][columnIndex] = person;
			return person;
		}else{
			debug && console.log('当前栏位尚未解锁！');
			return false;
		}
	},
	/**
	 *当前栏位是否可用 
	 * @param {int} rowIndex
	 * @param {int} columnIndex
	 */
	positionAvailable: function(rowIndex, columnIndex){
		if(rowIndex < 2 && columnIndex < 2){
			return true;
		}
		
		if(util.inArray([rowIndex, columnIndex], this.availablePositions)){
			return true;
		}
		
		return false;
	},
	/**
	 *解锁栏位 
	 * @param {int} rowIndex
	 * @param {int} columnIndex
	 */
	unlockPosition: function(rowIndex, columnIndex){
		if(rowIndex < this.maxRowCount - 1 && columnIndex < this.maxColumnCount - 1){
			if(!util.inArray([rowIndex, columnIndex], this.availablePositions)){
				this.availablePositions.push([rowIndex, columnIndex]);
				return true;
			}
		}
		
		return false;
		
	}
};

