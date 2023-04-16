import { state } from "../../state";
import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {}

  render() {
    this.innerHTML = `
    hola q tal soy la home 
    `;
    this.addListeners();
  }
}
customElements.define("home-page", Home);
