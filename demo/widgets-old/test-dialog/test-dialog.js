import {Dialog} from 'framework';

class TestDialog extends Dialog {
	constructor(){
	}

	ok(){
		this.close('YES!');
	}

	activate(settings = {}){
	}
}

export default TestDialog;