import {Module, Authenticator} from 'framework';

class Logout extends Module {
  constructor(authenticator: Authenticator){
    this.authenticator = authenticator;
    this.errorMessage = '';
    this.isLogginOut = false;
  }
  startLogout(){
    this.errorMessage = '';
    this.isLogginOut = true;
  }
  finishLogout(){
    this.isLogginOut = false;
  }
  logout(){
    this.startLogout();
    this.authenticator.deauthenticate().then(() => {
      this.finishLogout();
      // this.authenticator.navigateBack();
    }, (error) => {
      this.errorMessage = error;
      this.finishLogout();
    }).catch((error) => {
      alert('system error');
      this.finishLogout();
    });
  }
  activate(){
    this.logout();
  }
}

export default Logout;
