import CryptoJS from 'crypto-js';
import jet from "@randajan/jetpack";

const PRIVATE = [];

class Crypt {

    static en(key, str) {
        return key ? CryptoJS.AES.encrypt(String(str), jet.str.to(key)).toString() : str;
    }

    static de(key, hash) {
        try { return key ? CryptoJS.AES.decrypt(String(hash), jet.str.to(key)).toString(CryptoJS.enc.Utf8) : hash; } catch(e) {};
    }

    static enObj(key, obj) { return Crypt.en(key, jet.obj.json.to(obj)); }

    static deObj(key, hash) { return jet.obj.json.from(Crypt.de(key, hash), false); }

    constructor(key) {
        jet.obj.prop.add(this, "id", PRIVATE.push(key || "undefined")-1, false, true);
    }

    en(str) { return Crypt.en(PRIVATE[this.id], str); }
    de(hash) { return Crypt.de(PRIVATE[this.id], hash); }
    enObj(obj) { return Crypt.enObj(PRIVATE[this.id], obj); }
    deObj(hash) { return Crypt.deObj(PRIVATE[this.id], hash); }
    
}

export default Crypt;