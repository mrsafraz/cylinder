import {Authenticator, Initializer} from 'framework';
import router from 'plugins/router';

export class LogoutHelper {

  constructor(authenticator: Authenticator, initializer: Initializer) {
    this.authenticator = authenticator;
    this.initializer = initializer;
  }

  finishLogout(){
      this.initializer.deinitialize().then(()=> {
      	router.navigate('/', {replace: true, trigger: true});
        window.location.reload();
      });
  }

  forceLogout(){
  	window.location.hash = '#';
  	window.location.reload();
  }

	logout(){
    this.authenticator.deauthenticate().then(() => {
    	this.finishLogout();
    }, (error) => {
    	this.finishLogout();
    }).catch((error) => {
      alert('System Error. Logging out...');
      this.forceLogout();
      console.log(error.stack);
    });

	}
}