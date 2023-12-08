import CryptoJS from "crypto-js";

class Crypto {
  CryptoGraphEncrypt(value: string) {
    let _salt = "aB7xS5fR7bV4oK1n";
    let key = CryptoJS.enc.Utf8.parse(_salt);
    let iv = CryptoJS.enc.Utf8.parse(_salt);
    let encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  CryptoGraphDecrypt(ciphertext: string) {
    let _salt = "aB7xS5fR7bV4oK1n";
    let key = CryptoJS.enc.Utf8.parse(_salt);
    let iv = CryptoJS.enc.Utf8.parse(_salt);
    let decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
export default new Crypto();
