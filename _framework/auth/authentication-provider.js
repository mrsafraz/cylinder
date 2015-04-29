var _users = {};

export class AuthenticationProvider {

  get currentUser(){
    return {};
  }

  addUser(username, password){
    _users[username] = password;
  }

  static addUser(username, password){
    _users[username] = password;
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  doLogin(username, plainPassword){
    return new Promise((resolve, reject) => {
      var password = _users[username];
      if(password && password == plainPassword){
        resolve();
      }
      else {
        reject(new Error('Invalid username or password'));
      }
    });
  }

  authenticate(username, plainPassword){
    return new Promise((resolve, reject) => {
      this.doLogin(username, plainPassword)
      .then((data)=> {
        resolve();
      }, (error)=> {
        // reject(new Error('Invalid username or password'));
        reject(error);
      });
    });
  }

  deauthenticate(){
    return new Promise((resolve, reject) => {
      this.doLogout().then(()=> {
        resolve();
      }, (error)=> {
        reject(error);
      });
    });
  }

  updatePassword(username, newPassword, existingPassword){
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

}