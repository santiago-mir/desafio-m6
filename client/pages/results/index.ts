import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const container = this.querySelector(".results-container");
    let containerStyle = document.createElement("style");
    containerStyle.innerHTML = `
    .results-container{
    height: 100vh;
    background: ${this.processResults().background}
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    }
    `;
    container?.appendChild(containerStyle);
  }

  processResults() {
    const result = state.whoWins(
      state.getPlayerOneHand(),
      state.getPlayerTwoHand()
    );
    let background;
    let imgURL;
    if (result == true) {
      background = "rgb(95 203 99 / 90%);";
      imgURL = require("url:../../assets/ganaste.png");
      return { imgURL, background };
    } else if (result == false) {
      background = "rgba(137, 73, 73, 0.9);";
      imgURL = require("url:../../assets/perdiste.png");

      return { imgURL, background };
    } else background = "rgb(254 211 92 / 90%);";
    imgURL = require("url:../../assets/empate.png");

    return { imgURL, background };
  }
  render() {
    this.innerHTML = `
    <div class="results-container">
    <div class="img-container">
      <img src="${this.processResults().imgURL}"/>
      </div>
     <div class="score-container">
     <custom-text tag="h1" type="paragraph">Score</custom-text>
     <div>
     <custom-text class="user-score" tag="p" type="paragraph">Vos:0</custom-text>
     <custom-text class="computer-score" tag="p" type="paragraph">Maquina:0</custom-text>
     </div>
     </div>
     <custom-button class="play-again-button">Volver a Jugar</custom-button>
     <custom-button class="reset-history-button">Limpiar Historial</custom-button>
     </div>
    `;
    this.addListeners();
  }
}
customElements.define("results-page", Results);
