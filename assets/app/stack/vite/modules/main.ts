import './common.css';
import './style.css'
import './rete.css'

import viteLogo from '/vite.svg'
import React from 'react'

import reteLogo from './assets/rete.svg'
import { createEditor } from './rete'
import typescriptLogo from './typescript.svg'

window.React = React

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <a href="https://retejs.org/" target="_blank">
      <img src="${reteLogo}" class="logo rete-logo" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript + Rete.js</h1>
    <div id="rete" class="rete"></div>
  </div>
`

createEditor(document.querySelector('#rete')!)
