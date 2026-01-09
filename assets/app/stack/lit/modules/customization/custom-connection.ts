import { type Position } from '@retejs/lit-plugin'
import { css, html, LitElement, type PropertyDeclarations } from 'lit'

export class CustomConnectionElement extends LitElement {
  static get properties(): PropertyDeclarations {
    return {
      start: { type: Object },
      end: { type: Object },
      path: { type: String },
    }
  }

  declare start: Position
  declare end: Position
  declare path: string

  static styles = css`
    svg {
      overflow: visible !important;
      position: absolute;
      pointer-events: none;
      width: 9999px;
      height: 9999px;
    }

    path {
      fill: none;
      stroke-width: 5px;
      stroke: black;
      pointer-events: auto;
    }
  `

  render() {
    return html`
      <svg data-testid="connection">
        <path d=${this.path}></path>
      </svg>
    `
  }
}
