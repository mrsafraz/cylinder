import {AuthenticationProvider} from './authentication-provider';
import router from 'plugins/router';

var _isAuthenticated = false;
var _routesGuarded = false;
var _previousRoute = null;

var _loginFragment = 'user/login';
var _logoutFragment = 'user/logout';

export class Authenticator {

  constructor(authenticationProvider: AuthenticationProvider){
    this.authenticationProvider = authenticationProvider;
    this.changeListeners = [];
  }

  onChange(callbackFn){
    this.changeListeners.push(callbackFn);
  }

  triggerChange(){
    for(var fn of this.changeListeners){
      if(typeof fn === 'function'){
        fn(_isAuthenticated);
      }
    }
  }

  get isAuthenticated(){
    return _isAuthenticated;
  }

  get previousRoute(){
    return _previousRoute;
  }

  get loginUrl(){
    return _loginFragment;
  }

  get logoutUrl(){
    return _logoutFragment;
  }

  set loginUrl(loginUrl){
    _loginFragment = loginUrl;
  }

  set logoutUrl(logoutUrl){
    _logoutFragment = logoutUrl;
  }

  authenticate(username, plainPassword){
    return new Promise((resolve, reject) => {
      this.authenticationProvider.authenticate(username, plainPassword).then(() => {
        _isAuthenticated = true;
        this.triggerChange();
        resolve(true);
      }, (error) => {
        reject(error);
      }).catch((error) => {
        console.error(error);
        console.log(error.stack);
      });
    });
  }

  deauthenticate(){
    return new Promise((resolve, reject) => {
      this.authenticationProvider.deauthenticate().then(()=> {
        _isAuthenticated = false;
        this.triggerChange();
        resolve(true);
      }, (error)=> {
        reject(error);
      }).catch((error)=> {
        console.error(error);
        console.log(error.stack);
      });
    });
  }


  updatePassword(username, newPassword, existingPassword){
    var promise = this.authenticationProvider.updatePassword(username, newPassword, existingPassword);
    return promise;
  }

  navigateBack(){
      var route = _previousRoute;
      if(!route || route.indexOf(_logoutFragment) !== -1){
        route = '/';
      }
      window.setTimeout(function(){
        router.navigate(route, {replace: true, trigger: true});
      }, 1);
  }

  guardRoutes(){
    if(_routesGuarded){
      return;
    }
    var loginFragment = _loginFragment; 
    router.guardRoute = function(instance, instruction){
        if(
            instruction.fragment == loginFragment
            || instruction.fragment == 'user/register'
            || instruction.fragment == 'user/recover'
  //            || instruction.fragment == 'user/logout'
          ){
            if(_isAuthenticated){
                return false;
            }
            return true;
        }
        if(_isAuthenticated){
            return true;
        }
  //        return false;
  //        return true;
      if(location.hash.indexOf(loginFragment) === -1){
        _previousRoute = location.hash;
      }

      window.setTimeout(() => {
        router.navigate(loginFragment, {replace: true, trigger: true});
      }, 1);
      return false;
    };
    _routesGuarded = true;
  }

  enable(){
    this.guardRoutes();
  }
}