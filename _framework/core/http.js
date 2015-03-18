import http from 'plugins/http';

export class Http {
	constructor(){
		for(var key in http){
			this[key] = http[key];
		}
	}
}
