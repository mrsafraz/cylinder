import {Module} from 'framework';
import {MyService} from './MyService';

class EventsModule extends Module  {

  constructor(myService: MyService){
    super();
  	this.myService = myService;
  	this.itemCount = 0;
  	this.stopped = false;
  	this.myService.on('item:count').then((itemCount)=> {
  		this.itemCount = itemCount;
  	});
  	this.myService.on('item:stopped').then(()=> {
  		this.stopped = true;
  	});
  }

  get routes(){
  	return [
  		{
  			route: ['', 'sub'],
  			moduleId: 'sub',
  			title: 'Sub',
  			nav: true,
  		},
  		{
  			route: 'sub2',
  			moduleId: 'sub2',
  			title: 'Sub 2',
  			nav: true,
  		},
  	];
  }

  activate(settings){
  }

}

export default EventsModule;