import { state } from "../../state";
import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const newGameButtonEl = this.querySelector(".new-game-room");
    newGameButtonEl?.addEventListener("click", () => {
      this.submitNewRoom();
    });
  }
  submitNewRoom() {
    const userId = state.getUserId();
    state.createRoom(userId);
    Router.go("/game-room");
  }
  render() {
    this.innerHTML = `
    <div class="main-container">
    <custom-text>Piedra Papel o Tijera </custom-text>
    <div class="home-container">
    <custom-text type="subtitle">Bienvenidx ${state.getUserName()}</custom-text>
    <button class="new-game-room button">Nuevo Juego</button>
    <button class="login-game-room button">Ingresar a una sala</button>
    </div>
    </div>
    `;
    this.addListeners();
  }
}
customElements.define("home-page", Home);
