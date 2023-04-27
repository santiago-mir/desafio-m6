import { log } from "console";
import { rtdb, ref, onValue } from "./db";
import * as lodash from "lodash";

let API_BASE_URL = "";
if (process.env.ENVIRONMENT == "development") {
  API_BASE_URL = "http://localhost:3002";
} else {
  API_BASE_URL = "https://desafio-mod-6.onrender.com";
}

const state = {
  data: {
    userData: {
      name: "",
      email: "",
      userId: "",
    },
    rtdbData: {
      publicId: "",
      privateId: "",
      currentGame: "hola",
    },
  },
  listeners: [],
  getState() {
    return this.data;
  },
  init() {
    const localData = localStorage.getItem("actual-state") || this.getState();
    this.setState(JSON.parse(localData!));
  },
  setState(newState) {
    this.data = newState;
    console.log(newState);
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("actual-state", JSON.stringify(newState));
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
  listenRoom() {
    const currentState = this.getState();
    const chatRoomRef = ref(rtdb, "/rooms/" + currentState.privateRoomId); // error aca
    onValue(chatRoomRef, (snapShot) => {
      const data = snapShot.val();
      console.log(data);
    });
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
  createRoom(userId: string) {
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resFromServer) => {
        state.setRtdbData(resFromServer.id, resFromServer.privateId);
        this.listenRoom();
      });
  },
  enterRoom(roomId: string) {
    const userId = state.getUserId();
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        state.setRtdbData(roomId, data.rtdbRoomId);
        this.listenRoom();
      });
  },
  setRtdbData(publicId: string, privateId: string) {
    const currentState = this.getState();
    currentState.rtdbData.publicId = publicId;
    currentState.rtdbData.privateId = privateId;
    this.setState(currentState);
  },
  getUserName() {
    const currentState = this.getState();
    return currentState.userData.name;
  },
  getUserId() {
    const currentState = this.getState();
    return currentState.userData.userId;
  },
  getPublicId() {
    const currentState = this.getState();
    return currentState.rtdbData.publicId;
  },
};

export { state };
