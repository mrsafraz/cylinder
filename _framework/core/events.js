import DurandalEvents from 'durandal/events';

export class Events {
	static includeIn(obj){
		DurandalEvents.includeIn(obj);
	}
	static support(obj){
		if(typeof obj !== 'obj'){
			Events.includeIn(obj.prototype);
			return;
		}
		Events.includeIn(obj);
	}
}