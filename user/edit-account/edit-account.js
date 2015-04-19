import {Dialog} from 'framework';
import {Config} from 'framework';
import {Authenticator, DataService} from 'framework';
import {LogoutHelper} from '../logout-helper';
import {AppCategoryManager} from '_lib/AppCategoryManager';
import router from 'plugins/router';

class EditAccountDialog extends Dialog {
  constructor(authenticator: Authenticator, appCategoryManager: AppCategoryManager, config: Config, dataService: DataService, logoutHelper: LogoutHelper){
    this.authenticator = authenticator;
    this.config = config;
    this.dataService = dataService;
    this.logoutHelper = logoutHelper;
    this.appCategoryManager = appCategoryManager;
    var currentUser = this.authenticator.currentUser || {};
    this.userId = currentUser.id;
    this.username = currentUser.username;
    this.user = null;
    this.contact = null;
    this.profile = null;
    this.newPassword = '';
    this.confirmPassword = '';
    this.existingPassword = '';
    this.errorMessage = '';
    this.isSaving = false;
    this.invalidExistingPassword = false;
    this.changePassword = false;
    this.activateAppCategories = [];
    this.appCategoryManager.on('activeAppCategories.changed', (activeAppCategories)=> {
      this.activateAppCategories = activeAppCategories;
    });
    this.currentAppCategory = null;
    this.appCategoryManager.on('currentAppCategory.changed', (category)=> {
      this.currentAppCategory = category;
    });
  }

  switchAppCategory(category){
    this.appCategoryManager.setCurrentAppCategory(category);
    window.setTimeout(()=> {
      var categoryCode = this.appCategoryManager.getCurrentAppCategory();
      router.navigate('/' + categoryCode + '-dashboard');
    }, 1);

    this.close();
  }

  enableChangePassword(enabled = true){
    this.changePassword = enabled;
  }

  ensureUserInfo(user){
//    if(!user.contact){
//      user.contact = this.dataService.create('Contact', {user});
//    }
//    if(!user.picture){
//      user.picture = this.dataService.create('File');
//    }
    this.user = user;
  }

  findUserInfo(){
    var currentUser = this.authenticator.authenticationProvider.currentUser;
    this.username = currentUser && currentUser.username;
    return;
    this.userId = this.authenticator.currentUser && this.authenticator.currentUser.id;
    return this.dataService.findOne('User', {id: this.userId}).then((user)=> {
      // alert('This is cool bunddy: ' + user.username);
      this.ensureUserInfo(user);
    }, (error)=> {
      alert(error);
      console.log('OOOPS');
      console.log(error.stack);
    }).catch((error)=> {
      alert(error);
      console.log(error.stack);
      // alert('oh no ' + e);
    });
  }

  logout(){
    this.logoutHelper.logout();
  }

  activate(){
    this.findUserInfo();
    this.enableChangePassword(false);
    this.clearFields();
  }

  clearFields(){
    this.newPassword = '';
    this.confirmPassword = '';
    this.existingPassword = '';
  }

  saveChanges(){
    if(this.newPassword && this.newPassword != this.confirmPassword){
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.invalidExistingPassword = false;
    this.authenticator.updatePassword
      (this.username, this.newPassword, this.existingPassword).then(()=> {
        this.close('done');
        this.clearFields();
        this.logout();
      }, (error)=> {
        this.clearFields();
        if(('' + error).indexOf('Invalid hash') !== -1) {
          this.invalidExistingPassword = true;
          this.errorMessage = 'Existing password is invalid';
        }
        else {
          this.errorMessage = error;
        }
      });
  }
}

export default EditAccountDialog;
