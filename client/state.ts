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
      currentGame: {
        playerOne: {
          name: "",
          online: false,
          start: false,
        },
        playerTwo: {
          name: "",
          online: false,
          start: false,
        },
      },
    },
  },
  listeners: [],
  getState() {
    return this.data;
  },
  init() {
    let localData;
    const storageData = localStorage.getItem("actual-state");
    if (storageData) {
      localData = storageData;
      this.setState(JSON.parse(localData!));
    } else {
      localData = this.getState();
      this.setState(localData);
    }
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
    const chatRoomRef = ref(rtdb, "/rooms/" + state.getPrivateId());
    onValue(chatRoomRef, (snapShot) => {
      const data = snapShot.val();
      currentState.rtdbData.currentGame = data.currentGame;
      state.setState(currentState);
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
  createRoom(userId: string, userName: string) {
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userName,
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
  enterRoom(roomId: string, userName: string) {
    const userId = state.getUserId();
    fetch(
      API_BASE_URL +
        "/rooms/" +
        roomId +
        "?userId=" +
        userId +
        "&userName=" +
        userName,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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
  getPrivateId() {
    const currentState = this.getState();
    return currentState.rtdbData.privateId;
  },
  getPlayerTwoName() {
    const currentState = this.getState();
    return currentState.rtdbData.currentGame.playerTwo.name;
  },
  playersAreOnline() {
    const currentState = this.getState();
    return (
      currentState.rtdbData.currentGame.playerOne.online &&
      currentState.rtdbData.currentGame.playerTwo.online
    );
  },
};

export { state };
