//import sjcld from 'sjcl';

//import forge from 'forge/forge';
import util from 'forge/util';
import md from 'forge/md';

var forge = {util: util(), md: md()};

//var forge = {util, md: {sha1, sha256}};

/*
var key = sjcl.codec.utf8String.toBits("key");
var out = (new sjcl.misc.hmac(key, sjcl.hash.sha256)).mac("The quick brown fox jumps over the lazy dog");
var hmac = sjcl.codec.hex.fromBits(out)
*/

export class Encoder {

  encryptSha1(value, bytes = false){
    var md = forge.md.sha1.create();
    md.update(value);
    return bytes ? md.digest().bytes() : md.digest().toHex();
    // var bits = sjcl.hash.sha256.hash(value);
    // var encryptedStr = sjcl.codec.utf8String.fromBits(bits);
    // return encryptedStr;
  }

  encryptSha256(value, bytes = false){
    var md = forge.md.sha256.create();
    md.update(value);
    return bytes ? md.digest().bytes() : md.digest().toHex();
  }
  // encodeUtf8(str){
  //   return forge.util.encodeUtf8(str);
  // }
  // decodeUtf8(str){
  //   return forge.util.decodeUtf8(str);
  // }
  encodeBase64(decodedStr){
    var encodedStr = forge.util.encode64(decodedStr);
    return encodedStr;
  }
  decodeBase64(encodedStr){
    var decodedStr = forge.util.decode64(encodedStr);
    return decodedStr;
  }
  encodeBase64Old(decodedStr){
    var bits = sjcl.codec.utf8String.toBits(decodedStr);
    var encodedStr = sjcl.codec.base64.fromBits(bits);
    return encodedStr;
  }
  decodeBase64Old(encodedStr){
    var bits = sjcl.codec.base64.toBits(encodedStr);
    var decodedStr = sjcl.codec.utf8String.fromBits(bits);
    return decodedStr;
  }
  // test(){
  //   var encoder = this;
  //   console.log('BASE64 ENC:', encoder.encodeBase64('safraz'));
  //   console.log('BASE64 DEC', encoder.decodeBase64('c2FmcmF6'));
  //   console.log('SHA1: ', encoder.encryptSha1('safraz'));
  //   console.log('SHA256: ', encoder.encryptSha256('safraz'));
  //   console.log('SHA1 BASE64: ', encoder.encodeBase64(encoder.encryptSha1('safraz')));
  // }
  generateNonce(length = 16, nonceChars = "0123456789abcdef") {
    var result = "";
    for (var i = 0; i < length; i++) {
        result += nonceChars.charAt(Math.floor(Math.random() * nonceChars.length));
    }
    return result;
  }

  generateSalt(){
    var salt = this.encryptSha256('s' + Math.random() + this.generateNonce());
    return salt;
  }

  encryptPassword(plainPassword, salt = null){
    if(!salt){
      salt = this.generateSalt();
    }
    var encryptedPassword = this.encryptSha256
      (plainPassword + '{' + salt + '}');
    return encryptedPassword;
  }

  createCredentials(plainPassword){
    var salt = this.generateSalt();
    var encodedPassword = this.encryptPassword(plainPassword, salt);
    var credentials = '' + salt + '}{' + encodedPassword;
    return credentials;
  }

}