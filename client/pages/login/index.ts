class Login extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <div class="main-container">
    <custom-text type="subtitle">Registrate</custom-text>
    <div class="form-container">
    <form class="form">
    <label class="label"> Email
    <input class="input" type="email" name="email"/>
    </label>
    <label class="label"> Nombre
    <input class="input" type="text" name="name"/>
    </label>
    <custom-button>Registrate</custom-button>
    </form>
    </div>  
    <custom-text type="subtitle">Ingresa</custom-text>
    <div class="form-container">
    <form class="form">
    <label class="label"> Email
    <input class="input" type="email" name="email"/>
    </label>
    <custom-button>Ingresa</custom-button>
    </form>
    </div>
    </div>  
    `;
  }
}
customElements.define("login-page", Login);
