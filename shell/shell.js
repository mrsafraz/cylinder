import {Authenticator} from 'framework';
import {Module, RootModule} from 'framework';
import {Initializer} from 'framework';
import {Config} from 'framework';
import $ from 'jquery';
import EditAccountDialog from '../user/edit-account/edit-account';
import {Authorizer} from 'framework';
import {AppCategoryManager} from '_lib/AppCategoryManager';

class Shell extends RootModule {

  constructor(authenticator: Authenticator, initializer: Initializer, config: Config, appCategoryManager: AppCategoryManager, authorizer: Authorizer, editAccountDialog: EditAccountDialog){
    super();
    this.authenticator = authenticator;
    this.initializer = initializer;
    this.config = config;
    this.appCategoryManager = appCategoryManager;
    this.authorizer = authorizer;
    this.onAjaxRequest = false;
    this.isAuthenticated = !this.config.enableAuthentication;
    this.editAccountDialog = editAccountDialog;
    this.navigationFiltered = [];
    this.appCategoryManager.on('currentAppCategory.changed', (category)=> {
      this.filterNavigation();
    });
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

  reset(){
    this.initializer.deinitialize().then(()=> {
      window.location.reload();
    });
  }

  addResetButton(){
    var $resetButton = $('<a id="shell-reset-button" title="Reset" class="btn btn-light btn-primary" style="position: fixed; z-index: 999; bottom: 0; right: 0;"><i class="fa fa-refresh"></i></a>');
    $resetButton.on('click', ()=>{
      this.reset();
    });
    $('body').append($resetButton);
  }

  removeResetButton(){
    $('#shell-reset-button').remove();
  }

  filterNavigation(){
    var navigationAll = this.navigation;
    var navigationFiltered = [];
    var currentAppCategory = this.appCategoryManager.getCurrentAppCategory();
    var categories;
    for(var nav of navigationAll){
      categories = nav.categories || [];
      if(categories.indexOf(currentAppCategory) === -1){
        continue;
      }
      if(!this.config.enableAuthorization || this.authorizer.canAccess(nav)){
        navigationFiltered.push(nav);
      }
    }
    this.navigationFiltered = navigationFiltered;
  }

  activate(){
    this.filterNavigation();
    this.addResetButton();
    $(document).ajaxStart(()=> {
        this.onAjaxRequest = true;
    });
    $(document).ajaxStop(()=> {
        this.onAjaxRequest = false;
    });
    this.authenticator.onChange((authenticated)=> {
      this.filterNavigation();
      this.isAuthenticated = authenticated;
      if(this.isAuthenticated){
        this.removeResetButton();
      }
    });
    if(this.config.enableAuthentication || !this.config.enableApiServer){
      this.removeResetButton();
      return super.activate();
    }
    return this.initializer.initialize().then(()=> {
      this.removeResetButton();
      super.activate();
    });
  }

}

export default Shell;