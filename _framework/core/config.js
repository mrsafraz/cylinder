export class Config {
	doClone(obj){
		for(var key in obj){
			this[key] = obj[key];
		}
	}
	constructor(params = {}){
		this._params = params;
		this.doClone(params);
	}
}