import {Widget} from 'framework';
import {Progress} from 'framework';

class LoadingIndicator extends Widget {
	constructor(progress: Progress){
		super();
		this.isLoading = false;
		this.progress = progress;
	}
	activate(settings){
		this.isLoading = settings.isLoading;
		if(this.isLoading){
			this.progress.start();
		}
		else {
			this.progress.done();
		}
	};
}

export default LoadingIndicator;