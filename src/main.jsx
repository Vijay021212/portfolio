import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { flags } from './debug'

if (flags.nosmooth) document.documentElement.style.scrollBehavior = 'auto'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
