// encrypt and decrypt functions using crypto-js
import CryptoJS from 'crypto-js';

export const encrypt = (value: string, password: string) => {
  return CryptoJS.AES.encrypt(value, password).toString();
}

export const decrypt = (value: string, password: string) => {
  return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
}
