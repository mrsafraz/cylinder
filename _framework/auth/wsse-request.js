import {Encoder} from './encoder';

var _username, _password, _noncePlain, _createdTime;

export class WsseRequest {

  constructor(encoder: Encoder){
    this.encoder = encoder;
  }

  create(username, password){
    // create a fresh object
    var wsseRequest = new WsseRequest(this.encoder);
    _username = username;
    _password = password;
    _noncePlain = this.encoder.generateNonce();
    _createdTime = new Date();
    return wsseRequest;
  }

  get username(){
    return _username;
  }

  get passwordDigest(){
    return this.encoder.encodeBase64(
      this.encoder.encryptSha1(_noncePlain + this.created + _password, true));
  }

  get nonce(){
    return this.encoder.encodeBase64(_noncePlain);
  }

  get created(){
    return _createdTime.toISOString();
  }

  get token(){
    return 'UsernameToken Username="' + this.username
      + '", PasswordDigest="' + this.passwordDigest
      + '", Nonce="' + this.nonce
      + '", Created="' + this.created + '"';
  }
}