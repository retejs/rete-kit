import { css, html, LitElement } from 'lit'

export class CustomSocketElement extends LitElement {
  static get properties() {
    return {
      data: { type: Object }
    }
  }

  declare data: { name: string }

  static styles = css`
    :host {
      --socket-size: 16px;
      display: inline-block;
      cursor: pointer;
      border: 1px solid grey;
      width: var(--socket-size);
      height: calc(var(--socket-size) * 2);
      vertical-align: middle;
      background: #fff;
      z-index: 2;
      box-sizing: border-box;
      &:hover {
        background: #ddd;
      }
    }
  `

  render() {
    return html`
      <div title="${this.data?.name}"></div>
    `
  }
}
