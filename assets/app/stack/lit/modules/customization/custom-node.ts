import { css, html, LitElement } from 'lit'
import { type ClassicScheme } from '@retejs/lit-plugin'

type NodeExtraData = { width?: number, height?: number }

export class CustomNodeElement extends LitElement {

  static get properties() {
    return {
      width: { type: Number },
      height: { type: Number },
      data: { type: Object },
      styles: { type: Function },
      emit: { type: Function }
    }
  }
  declare width: number
  declare height: number
  declare data: ClassicScheme['Node'] & NodeExtraData
  declare styles: ((props: any) => any) | null
  declare emit: ((type: string, payload: any) => void) | null

  static styles = css`
    :host {
      --socket-size: 16px;
      --socket-margin: 6px;
      --socket-color: #96b38a;
      --node-width: 200px;
    }

    :host {
      display: block;
      background: black;
      border: 2px solid grey;
      border-radius: 10px;
      cursor: pointer;
      box-sizing: border-box;
      padding-bottom: 6px;
      position: relative;
      user-select: none;
    }

    :host(:hover) {
      background: #333;
    }

    :host(.selected) {
      border-color: red;
    }

    .title {
      color: white;
      font-family: sans-serif;
      font-size: 18px;
      padding: 8px;
    }

    .output {
      text-align: right;
    }
    .input {
      text-align: left;
    }

    .output-socket {
      text-align: right;
      margin-right: -1px;
      display: inline-block;
    }
    .input-socket {
      text-align: left;
      margin-left: -1px;
      display: inline-block;
    }

    .input-title,
    .output-title {
      vertical-align: middle;
      color: white;
      display: inline-block;
      font-family: sans-serif;
      font-size: 14px;
      margin: var(--socket-margin);
      line-height: var(--socket-size);
    }

    .input-control {
      z-index: 1;
      width: calc(100% - calc(var(--socket-size) + 2 * var(--socket-margin)));
      vertical-align: middle;
      display: inline-block;
    }

    .control {
      display: block;
      padding: var(--socket-margin) calc(var(--socket-size) / 2 + var(--socket-margin));
    }
  `

  sortByIndex(entries: any[]) {
    entries.sort((a, b) => {
      const ai = a[1]?.index || 0
      const bi = b[1]?.index || 0

      return ai - bi
    })
  }

  render() {
    const inputs = Object.entries(this.data.inputs || {})
    const outputs = Object.entries(this.data.outputs || {})
    const controls = Object.entries(this.data.controls || {})
    const { id, label, width, height } = this.data

    this.sortByIndex(inputs)
    this.sortByIndex(outputs)
    this.sortByIndex(controls)

    if (this.data.selected) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }

    this.dataset.testid = 'node'

    return html`
      <style>
        :host {
          width: ${Number.isFinite(width) ? `${width}px` : 'var(--node-width)'};
          height: ${Number.isFinite(height) ? `${height}px` : 'auto'};
        }
        ${this.styles && this.styles(this)}
      </style>
      <div class="title" data-testid="title">${label}</div>
      ${outputs.map(([key, output]: any) => output ? html`
        <div class="output" key=${key}  data-testid=${`output-${key}`}>
          <div class="output-title" data-testid="output-title">${output?.label}</div>
          <span class="output-socket" data-testid="output-socket">
            <rete-ref
              .data=${{ type: 'socket', side: 'output', key, nodeId: id, payload: output.socket }}
              .emit=${this.emit}
            ></rete-ref>
          </span>
        </div>` : null)}
      ${controls.map(([key, control]: any) => control ? html`
        <span class="control" data-testid="${'control-'+key}">
          <rete-ref
            .emit=${this.emit}
            .data="${{ type: 'control', payload: control }}"
          ></rete-ref>
        </span>
        ` : null)}
      ${inputs.map(([key, input]: any) => input ? html`
        <div class="input" key=${key} data-testid=${`input-${key}`}>
          <span class="input-socket" data-testid="input-socket">
            <rete-ref
              .data=${{ type: 'socket', side: 'input', key, nodeId: id, payload: input.socket }}
              .emit=${this.emit}
            ></rete-ref>
          </span>
          ${input && (!input.control || !input.showControl) ? html`
            <div class="input-title" data-testid="input-title">${input?.label}</div>` : null}
          ${input?.control && input?.showControl ? html`
            <span class="control" data-testid="input-control">
              <rete-ref
                .emit=${this.emit}
                .data="${{ type: 'control', payload: input.control }}"
              ></rete-ref>
            </span>
          ` : null}
        </div>` : null)}
    `
  }
}
