// import {Dialog} from 'kingdom';
// import {Authenticator, DataService} from 'kingdom';

class EditAccountDialog extends Dialog {
  constructor(authenticator: Authenticator, dataService: DataService){
    this.authenticator = authenticator;
    this.dataService = dataService;
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

  activate(){
    this.findUserInfo();
  }

  clearFields(){
//    this.init();
  }

  saveChanges(){
    if(this.newPassword && this.newPassword != this.confirmPassword){
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if(this.newPassword){
      this.user.plainPassword = this.newPassword;
    }
    else {
      this.user.plainPassword = null;
    }
//    console.log('PROFILE', this.profile);
    this.dataService.saveChanges([this.user
//      , this.user.contact, this.user.picture
    ]).then((data)=> {
        this.close('done');
        this.clearFields();      
    }, (error)=> {
      
    });
    return;
    if(this.plainPassword != this.confirmPassword){
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.authenticator.updatePassword
      (this.username, this.newPassword, this.existingPassword).then(()=> {
        this.close('done');
        this.clearFields();
      }, (error)=> {
        this.clearFields();
        if(('' + error).indexOf('Invalid hash') !== -1) {
          this.errorMessage = 'Existing password is invalid';
        }
        else {
          this.errorMessage = error;
        }
      });
  }
}

export default EditAccountDialog;
