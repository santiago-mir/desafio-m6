import { state } from "../../state";
import { Router } from "@vaadin/router";

class gameRoom extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {}

  render() {
    this.innerHTML = `
        hola soy la game room
    `;
    this.addListeners();
  }
}
customElements.define("game-room-page", gameRoom);
