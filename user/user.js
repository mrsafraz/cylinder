import {Module} from 'framework';

class User extends Module {
  get routes(){
    return [
      {
        pattern: ['', 'account', 'register'],
        moduleId: 'account',
      },
      {
        route: 'login',
        moduleId: 'login',
      },
      {
        route: 'logout',
      }
    ];
  }
}

export default User;
