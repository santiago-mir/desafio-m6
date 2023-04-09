import { rtdb, ref, onValue } from "./db";
import * as lodash from "lodash";

const state = {
  data: {},
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    console.log(newState);

    for (const cb of this.listeners) {
      cb();
    }
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
