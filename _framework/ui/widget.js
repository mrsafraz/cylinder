import {annotate, TransientScope} from 'di';

export class Widget {
	static support(widgetFn){
		annotate(widgetFn, new TransientScope);
	}
}

annotate(Widget, new TransientScope);