import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {}

  render() {
    this.innerHTML = `
        soy la results
    `;
    this.addListeners();
  }
}
customElements.define("results-page", Results);
