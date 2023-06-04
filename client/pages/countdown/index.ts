import { state } from "../../state";
import { Router } from "@vaadin/router";

class countdown extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {}

  render() {
    this.innerHTML = `
       soy la countdown
    `;
    this.addListeners();
  }
}
customElements.define("countdown-page", countdown);
