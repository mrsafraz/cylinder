import {Dialog} from 'framework';

class TestDialog extends Dialog {
	constructor(){
		this.autoclose = true;
	}

	activate(settings = {}){
		this.target = settings.target;
	}
}

export default TestDialog;