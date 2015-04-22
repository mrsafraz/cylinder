import {Module} from 'framework';
import {MyService} from '../MyService';

class SubModule extends Module  {

  constructor(myService: MyService){
    super();
  	this.myService = myService;
  	this.items = [];
  	this.started = false;
  	this.stopped = false;
  	this.myService.on('item:added').then((item)=> {
  		this.items.push(item);
  	});
  	this.myService.on('item:started').then(()=> {
  		this.started = true;
  	});
  }

  start(){
  	this.myService.trigger('item:start');
  }

  stop(){
  	this.myService.trigger('item:stop');
  	this.stopped = true;
  }

  activate(settings){
  }

}

export default SubModule;