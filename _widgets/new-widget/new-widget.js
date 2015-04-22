import {Widget} from 'framework';

class NewWidget extends Widget {
	constructor(){
		super();
		this.name = 'Safraz';
	}
	activate(settings){
		this.name = settings.currentName;
	}
}

export default NewWidget;