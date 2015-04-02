import {annotate, TransientScope} from 'di';

import {Events} from '../core/events';

export class Widget {
	static support(widgetFn){
		annotate(widgetFn, new TransientScope);
	}
}

Events.support(Widget);

annotate(Widget, new TransientScope);