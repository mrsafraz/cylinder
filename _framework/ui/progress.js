import NProgress from 'nprogress';

export class Progress {

	constructor(){
		this.configure({ minimum: 0.1 });
		this.configure({ trickleRate: 0.02, trickleSpeed: 200 });
		this.configure({ showSpinner: false });
		this.configure({ parent: '#progress-loading-container' });
	}

	start(...params){
		return NProgress.start(...params);
	}
	set(...params){
		return NProgress.set(...params);
	}
	inc(...params){
		return NProgress.inc(...params);
	}
	done(...params){
		return NProgress.done(...params);
	}
	configure(...params){
		return NProgress.configure(...params);
	}
}