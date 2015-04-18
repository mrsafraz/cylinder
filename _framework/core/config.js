import {ModuleLoader} from './module-loader';

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

	static getInstance(){
		return ModuleLoader.load(Config);
	}

	static get(key, defaultValue){
		var value = Config.getInstance()[key];
		if(value === undefined){
			value = defaultValue;
		}
		return value;
	}
	static set(key, value){
		Config.getInstance()[key] = value;
	}
}