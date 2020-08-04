

import Serf from "../Base/Serf";

import Core from "./Core";

class Images extends Serf {

    constructor(core, path, files) {
        super(core, path);

        files = Core.fetchFiles(files);
        this.lock("files", files);

        this.set({ files });
    }



}

export default Images;