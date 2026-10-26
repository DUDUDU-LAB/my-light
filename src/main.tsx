import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css'
import './styles/tokens.css'
import './styles/global.css'

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}