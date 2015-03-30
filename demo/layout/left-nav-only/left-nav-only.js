import {Module} from 'framework';

class LeftNavOnlyModule extends Module  {

  constructor(){
  	this.isNavActive = false;
  }

  activateNav(activate){
  	this.isNavActive = activate;
  }

  activate(){
  }

}

export default LeftNavOnlyModule;