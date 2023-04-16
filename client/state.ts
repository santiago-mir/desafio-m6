import { rtdb, ref, onValue } from "./db";
import * as lodash from "lodash";

let API_BASE_URL = "http://localhost:3002";

const state = {
  data: {
    userData: {
      name: "",
      email: "",
      userId: "",
    },
  },
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
  setUserData(name, email, userId?) {
    const currentState = this.getState();
    currentState.userData.name = name;
    currentState.userData.email = email;
    currentState.userData.userId = userId;
    this.setState(currentState);
  },
  signUpUser(email: string, name: string) {
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: name,
        email: email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        state.setUserData(name, email, res.id);
      });
  },
  loginUser(email: string) {
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((ResFromServer) => {
        state.setUserData(
          ResFromServer.data.nombre,
          ResFromServer.data.email,
          ResFromServer.id
        );
      });
  },
};

export { state };
