import {Authenticator} from 'framework';
import {Initializer} from 'framework';
import {Progress} from 'framework';
import {Config} from 'framework';
import {Authorizer} from 'framework';

class Login {

  constructor(authenticator: Authenticator, authorizer: Authorizer, initializer: Initializer, progress: Progress, config: Config){
    this.config = config;
    this.authenticator = authenticator;
    this.authorizer = authorizer;
    this.initializer = initializer;
    this.progress = progress;
    this.loadingPercentage = 0;
    this.username = '';
    this.plainPassword = '';
    this.errorMessage = '';
    this.isLoggingIn = false;
    this.isLoginFailed = false;
    this.isLoggedIn = false;
  }

  loginFailed(){
    this.isLoginFailed = true;
    window.setTimeout(() => {
      this.isLoginFailed = false;
    }, 200);
  }

  startLogin(){
    this.isLoginFailed = false;
    this.errorMessage = '';
    // replace plain password with a fake password, for security reasons
    this.plainPassword =
      Math.random().toString(36).substr(2, this.plainPassword.length);
    this.isLoggingIn = true;
  }

  stopLoggingIn(){
    this.plainPassword = '';
    this.isLoggingIn = false;
  }

  initialize(){
    return new Promise((resolve, reject) => {
      if(!this.config.enableApiServer){
        return resolve();
      }

      this.initializer.initialize((progressPercentage)=> {
        this.loadingPercentage = progressPercentage;
        this.progress.set(this.loadingPercentage/100);
      }).then(()=> {
        resolve();
    }, (error)=> {
      this.errorMessage = error.message || error;
      this.loginFailed();
      this.stopLoggingIn();
    }).catch((error) => {
      alert('system error');
      console.log(error.stack);
      this.stopLoggingIn();
    });

    })
  }

  authorize(){
    if(this.config.enableAuthorization){
      return this.authorizer.authorize();
    }
    return new Promise((resolve, reject)=> {
      resolve();
    });
  }

  login(){
    // copy the plain password before it's removed
    var plainPassword = this.plainPassword + '';
    this.progress.start();
    this.startLogin();
    this.authenticator.authenticate(this.username, plainPassword).then(()=> {
      this.authorize().then(()=> {
        this.stopLoggingIn();
        this.isLoggedIn = true;
        this.initialize().then(()=> {
          this.progress.done();
          this.authenticator.navigateBack();
        });
      }, (error)=> {
        this.errorMessage = error.message || error;
        this.loginFailed();
        this.stopLoggingIn();
      });
    }, (error)=> {
      this.errorMessage = error.message || error;
      this.loginFailed();
      this.stopLoggingIn();
    });
  }

  clearUsername(){
    this.username = '';
    $('#app_login_input_username').focus();
  }

  clearPlainPassword(){
    this.plainPassword = '';
    $('#app_login_input_plain_password').focus();
  }

  dummyLogin(autoLogin = false, username = 'demo', password = 'demo'){
    this.username = username;
    this.plainPassword = password;
    if(!autoLogin){
      return;
    }
    // window.setTimeout(()=>{
      this.login();
    // }, 1500);
  }

  activate(){
    var autoLogin = false;
    autoLogin = true;
    if(this.config.autoLogin){
      this.dummyLogin(autoLogin, this.config.autoLogin.username || 'demo', this.config.autoLogin.password || 'demo');
    }
  }

}

export default Login;