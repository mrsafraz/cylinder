export class Config {
	constructor(params = {}){
		this._params = params;
		for(var key in params){
			this[key] = params[key];
		}
	}
}