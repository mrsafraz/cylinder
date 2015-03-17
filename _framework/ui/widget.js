import {annotate, TransientScope} from 'di';

export class Widget {
}

annotate(Widget, new TransientScope);