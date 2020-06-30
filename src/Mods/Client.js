import { deviceType, browserName, browserVersion, fullBrowserVersion, mobileVendor, mobileModel, engineName, engineVersion } from 'react-device-detect';

import Serf from "../Base/Serf";

class Client extends Serf {

    constructor(Core, path) {
        super(Core, path);

        this.fit(_=>{
            return {
                deviceType,
                browserName,
                browserVersion,
                fullBrowserVersion,
                mobileVendor,
                mobileModel,
                engineName,
                engineVersion,
            }
        })

        this.set();
    }

}


export default Client;