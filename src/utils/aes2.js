import CryptoJS from "crypto-js";
import { sha256 } from 'js-sha256'


function getSha256(text){
  return sha256(text)
};

function encrypt_str(key, iv, str) {
  var KEY = key;
  var IV = iv.substr(20, 16);
  var key = CryptoJS.enc.Utf8.parse(KEY); // 秘钥
  var iv = CryptoJS.enc.Utf8.parse(IV); //向量iv
  var encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};
function decrypt_str(key, iv, str){
  var KEY = key;
  var IV = iv.substr(20, 16);
  var key = CryptoJS.enc.Utf8.parse(KEY); // 秘钥
  var iv = CryptoJS.enc.Utf8.parse(IV); //向量iv
  var decrypted = CryptoJS.AES.decrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
function setDataAes(text, key){
  key = '2589633659865985'
  var key1 = getSha256(key).substr(10, 16)
  var iv1 = getSha256(key1)
  var ret1 = encrypt_str(key1, iv1, text)
  return ret1
};
function getDataAes(text, key){
  key = getSha256(key).substr(10, 16)
  var iv = getSha256(key)
  var ret = decrypt_str(key, iv, text)
  var ret_s = ret.replace(/^\s*|\s*$/g, '')

  return ret_s
};

export {setDataAes, getDataAes}
