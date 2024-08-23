import './common.css'
import './style.css'
import './rete.css'

import reteLogo from './assets/rete.svg'
import litLogo from './assets/lit.svg'
import { createEditor } from './rete';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://retejs.org" target="_blank">
      <img src="${reteLogo}" class="logo rete-logo" alt="Rete logo" />
    </a>
    <a href="https://lit.dev" target="_blank">
      <img src="${litLogo}" class="logo" alt="Lit logo" />
    </a>
    <h1>Rete + Lit</h1>
    <div class="rete"></div>
  </div>
`

createEditor(document.querySelector('.rete')!)
