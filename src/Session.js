
import jet from "@randajan/jetpack";
import Api from "./Api";
import Storage from "./Storage";

class Session extends Storage {
    constructor(url, version, crypt, onChange) {
        super(null, version, crypt, async (_, content) => fetch(url, { method: "POST", body: Api.dataToForm({content}) }));

        jet.obj.addProperty(this, "start", async _=>{
            const content = jet.obj.get(await fetch(url).then(data => data.json()), "content");
            this.set(Storage.unpack(content, version, crypt));
            return this;
        });

        this.onChange.add(onChange);
    }

    static create(...args) {return new Session(...args);}
}

export default Session;