import { state } from "../../state";
import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {}

  render() {
    this.innerHTML = `
    <div class="main-container">
    <custom-text>Piedra Papel o Tijera </custom-text>
    <div class="home-container">
    <custom-text type="subtitle">Bienvenidx ${state.getUserName()}</custom-text>
    <button class="button">Nuevo Juego</button>
    <button class="button">Ingresar a una sala</button>
    </div>
    </div>
    `;
    this.addListeners();
  }
}
customElements.define("home-page", Home);
