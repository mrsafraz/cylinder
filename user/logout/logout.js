import {Module} from 'framework';
import $ from 'jquery';
import {LogoutHelper} from '../logout-helper';

class Logout extends Module {
  constructor(logoutHelper: LogoutHelper){
    super();
    this.logoutHelper = logoutHelper;
  }

  logout(){
    this.logoutHelper.logout();
  }

  attached(view){
  	this.mask = $(view).find('.logout-mask');
  	this.mask.appendTo(document.body);
  }

  activate(){
    this.logout();
  }
}

export default Logout;
