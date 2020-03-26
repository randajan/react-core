import CryptoJS from 'crypto-js';
import jet from "@randajan/jetpack";

const KEYS = [];

class Crypt {

    constructor(key) {
        jet.obj.addProperty(this, "id", KEYS.push(key || "undefined")-1, false, true);
    }

    en(string) {
        return CryptoJS.AES.encrypt(string, KEYS[this.id]).toString();
    }

    de(hash) {
        return CryptoJS.AES.decrypt(hash, KEYS[this.id]).toString(CryptoJS.enc.Utf8);
    }

    enObj(obj) {
        return this.en(JSON.stringify(obj));
    }
    
    deObj(hash) {
        try {
            return JSON.parse(this.de(hash));
        } catch(e) {
            return {};
        }
    }
    
    static create(key) {return new Crypt(key);}
}

export default Crypt;