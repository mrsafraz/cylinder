import {Module} from 'framework';

class Layout extends Module  {

  constructor(){
    super();
  	this.dockLeftNav = true;
  	this.dockRightNav = false;
  	this.moduleTitle = 'Layout';
  }

  get routes(){
  	return [
  		{
  			route: '',
  			moduleId: 'no-nav',
  			title: 'No Navigation',
  			nav: true,
  		},
  		{
  			route: 'left-nav-only',
  			title: 'Left Nav Only',
  			nav: true,
  		},
  		{
  			route: 'header-only',
  			title: 'Header Only',
  			nav: true,
  		}
  	]
  }

  activateNav(side = 'left'){
  	if(side == 'left'){
  		this.isNavLeftActive = true;
  	}
  	if(side == 'right'){
  		this.isNavRightActive = true;
  	}
  }

  resetNav(sides = 'left right'){
  	sides = sides.split(' ');
  	if(sides.indexOf('left') !== -1){
  		this.isNavLeftActive = false;
  	}
  	if(sides.indexOf('right') !== -1){
  		this.isNavRightActive = false;
  	}
  }

  activate(){
  	this.resetNav();
  }

}

export default Layout;