import http from 'plugins/http';

export class Http {
	doClone(obj){
		for(var key in obj){
			this[key] = obj[key];
		}
	}
	constructor(){
		this.doClone(http);
	}
}
