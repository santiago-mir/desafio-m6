import { state } from "../../state";
import { Router } from "@vaadin/router";

class countdown extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners(counter) {
    let container = this.querySelector(".countdown-container");
    let countdown = this.querySelector(".countdown");
    let hands = this.querySelectorAll(".imagen");
    function initCountdown() {
      const intervalID = setInterval(() => {
        counter--;
        countdown!.innerHTML = `
            <custom-text type="title">${counter}</custom-text>
          `;
        if (counter <= 0) {
          clearInterval(intervalID);
          console.log("termino el countdown");
        }
      }, 1000);
      for (const hand of hands!) {
        hand.addEventListener("click", (e) => {
          const playerHand = e.target as any;
          state.updateHandPick(
            state.getUserId(),
            state.getPrivateId(),
            playerHand.type
          );
          hands.forEach((element) => {
            element.classList.add("disabeld");
            playerHand.classList.add("target");
          });
        });
      }
    }
    function updatePage(playerOneHand, playerTwoHand) {
      const intervalUpdate = setInterval(() => {
        container!.innerHTML = `
        <div class="game-container">
        <custom-image class="imagen" variant="player-one-hand" type=${playerOneHand}></custom-image>
        <custom-image class="imagen" variant="player-two-hand" type=${playerTwoHand}></custom-image>
        </div>
      `;
        clearInterval(intervalUpdate);
      }, 1000);
    }
    state.suscribe(() => {
      if (state.playersChoseMove()) {
        updatePage(state.getPlayerOneHand(), state.getPlayerTwoHand());
        const changeRoute = setInterval(() => {
          Router.go("results");
          clearInterval(changeRoute);
        }, 2000);
      }
    });
    initCountdown();
  }

  render() {
    let counter: number = 3;
    this.innerHTML = `
    <div class="countdown-container">
    <div class="countdown"><custom-text type="title">${counter}</custom-text></div>
    <div class="hands-container">
        <custom-image class="imagen" status="active" type="tijera"></custom-image>
        <custom-image class="imagen" status="active" type="piedra"></custom-image>
        <custom-image class="imagen" status="active" type="papel"></custom-image>
     </div>   
    </div>
    `;
    this.addListeners(counter);
  }
}
customElements.define("countdown-page", countdown);
