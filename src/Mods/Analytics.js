
import ReactGA from 'react-ga';

import jet from "@randajan/react-jetpack";

import Serf from "../Base/Serf";


class Analytics extends Serf {

    static formatAll(obj) {
        return jet.obj.map(obj, v=>jet.str.to(v, "|"));
    }

    constructor(core, path, tag, debug) {
        super(core, path);

        if (tag) {
            ReactGA.initialize(tag, { debug });
        }
      
        this.set({ tag });
    }
      
      event(category, action, label) {
        const obj = Analytics.formatAll({ category, action, label });
        
        if (this.get("tag")) { ReactGA.event(obj); }
        this.parent.debugLog("Analytics", "event", obj);
      }
      
      page(label) {

        if (this.get("tag")) { ReactGA.pageview(label); }
        this.parent.debugLog("Analytics", "page", label);

      }
      
      view(label) {
        this.event("Section", "View", label);
      }
      
      msg(level, type) {
        this.event("Modal", "Msg", [level, type]);
      }

      pane(label) {
        this.event("Modal", "Pane", label);
      }
      
      lang(lang) {
        this.event("Lang", "Set", lang);
      }

      link(label) {
        this.event("Link", "Out", label);
      }

      fieldFocus(form, field) {
        this.event("Form", "Focus", [form, field]);
      }
      
      fieldChange(form, field) {
        this.event("Form", "Change", [form, field]);
      }
      
      formSubmit(form) {
        this.event("Form", "Submit", form);
      }

}

export default Analytics;