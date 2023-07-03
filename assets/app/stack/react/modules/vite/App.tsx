import { useRete } from 'rete-react-plugin';
import reactLogo from './assets/react.svg'
import reteLogo from './assets/rete.svg'
import viteLogo from '/vite.svg'
import { createEditor } from './rete';
import './App.css'
import './rete.css';

function App() {
  const [ref] = useRete(createEditor)

  return (
    <>
      <div>
        <a href="https://retejs.org" target="_blank">
          <img src={reteLogo} className="logo rete-logo" alt="Rete logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Rete + Vite + React</h1>
      <div ref={ref} className="rete"></div>
    </>
  )
}

export default App
