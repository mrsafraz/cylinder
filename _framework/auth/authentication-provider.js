import $ from 'jquery';
import {Config} from '../core/config';
import {Encoder} from './encoder';
import {WsseRequest} from './wsse-request';

var _currentUser = {};

export class AuthenticationProvider {

  constructor(encoder: Encoder, request: WsseRequest, config: Config){
    this.encoder = encoder;
    this.request = request;
    this.config = config;
    this.authUrl = this.config.authUrl;
  }

  get currentUser(){
    return {
      id: _currentUser.id,
      username: _currentUser.username,
      salt: _currentUser.salt,
      roles: _currentUser.roles,
    }
  }

  doValidateLogin(){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.authUrl + '/validate',
        dataType: 'json'
      }).done((data)=> {
        if(data.roles && data.roles.length){
          resolve(data);
        }
        else {
          reject(data.error || new Error('Invalid user'));
        }
      }).fail((error)=> {
        reject(new Error('Login failed.'));
      });
    });
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.authUrl + '/logout',
        dataType: 'json'
      }).done((data)=> {
        alert("? " + data);
        if(data.success){
          resolve();
        }
        else {
          reject(data.error || new Error('Logout failed. Error Occurred.'));
        }
      }).fail((error)=> {
        reject(new Error('Logout failed. Unexpected Error.'));
      });
    });
  }

  doLogin(username, plainPassword){
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.authUrl + '/login',
        data: {
            username: username
        },
        beforeSend: function(jqXHR) {
            jqXHR.headers = {};
        },
        dataType: 'json',
        type: 'POST'
      }).done((data)=> {
        if(data.error){
          reject(new Error(data.error));
        }
        else if(data.salt) {
          var encodedPassword = this.encoder.encryptPassword
            (plainPassword, data.salt);
          $.ajaxSetup({
            beforeSend: (jqXHR, settings) => {
              var wsse = this.request.create(username, encodedPassword);
              // jqXHR.setRequestHeader('Authorization', 'WSSE profile="UsernameToken"');
              jqXHR.setRequestHeader('x-wsse', wsse.token);
            }
          });
          this.doValidateLogin().then((userData) => {
            _currentUser.roles = userData.roles;
            _currentUser.id = userData.id;
            _currentUser.username = username;
            _currentUser.salt = data.salt;
            resolve(userData);
          }, (error)=> {
            reject(error);
          });
        }
      }).fail((error)=> {
        reject(new Error('Unexpected Network Error'));
      });
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
      var newCredentials = this.encoder.createCredentials(newPassword);
      var existingSalt = this.currentUser.salt;
      var existingPasswordEncrypted = this.encoder.encryptPassword(existingPassword, existingSalt);
      var data = {
        credentials: newCredentials,
        hash: this.encoder.encryptPassword(newCredentials, existingPasswordEncrypted)
      }
      $.ajax({
        url: this.authUrl + '/account',
        data: data,
        method: 'POST',
        dataType: 'json',
      }).done((data)=> {
        if(data.error){
          reject(new Error(data.error));
        }
        else {
          this.doLogin(username, newPassword);
          resolve();
        }
      }).fail((error)=> {
        reject(error);
      });
    });
  }

}