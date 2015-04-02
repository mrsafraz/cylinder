import {Events} from 'framework';

var _lastItemNo = 1;
export class MyService {
	constructor(){
		// Events.support(this); // important
		this.stopped = false;
		this.on('item:start').then(()=> {
			this.trigger('item:started');
			this.addItem();
		});
		this.on('item:stop').then(()=> {
			this.stopped = true;
			this.trigger('item:stopped');
		})
	}

	addItem(){
		if(this.stopped){
			return;
		}
		var item = 'Item ' + _lastItemNo;
		this.trigger('item:added', item);
		this.trigger('item:count', _lastItemNo);
		_lastItemNo++;
		window.setTimeout(()=> {
			this.addItem();
		}, 1000);
	}
}

Events.support(MyService);