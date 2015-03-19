import {Authenticator} from 'framework';
import {Module, RootModule} from 'framework';
import {Initializer} from 'framework';
import {Config} from 'framework';
import $ from 'jquery';
import EditAccountDialog from '../user/edit-account/edit-account';

class Shell extends RootModule {

  constructor(authenticator: Authenticator, initializer: Initializer, config: Config, editAccountDialog: EditAccountDialog){
    this.authenticator = authenticator;
    this.initializer = initializer;
    this.config = config;
    this.onAjaxRequest = false;
    this.isAuthenticated = !this.config.enableAuthentication;
    this.editAccountDialog = editAccountDialog;
  }

  get routes(){
    return this.config.routes;
  }

  search() {
    //It's really easy to show a message box.
    //You can add custom options too. Also, it returns a promise for the user's response.
    this.dialog.showMessage('Search not yet implemented...');
  }

  get isLoading(){
    return this.router.isNavigating() || this.onAjaxRequest;
  }

  showUserControl($event){
    var target = $event.target;
    if(target.targName !== 'A'){
      target = target.parentElement;
    }
    this.editAccountDialog.show(null, {
      popover: target,
      position: 'right bottom',
      autoclose: true,
    });
  }

  activate(){
    $(document).ajaxStart(()=> {
        this.onAjaxRequest = true;
    });
    $(document).ajaxStop(()=> {
        this.onAjaxRequest = false;
    });
    this.authenticator.onChange((authenticated)=> {
      this.isAuthenticated = authenticated;
    });
    if(this.config.enableAuthentication || !this.config.enableApiServer){
      return super.activate();
    }
    return this.initializer.initialize().then(()=> {
      super.activate();
    });
  }

}

export default Shell;