import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Router } from 'react-router-dom'
createRoot(document.getElementById('root')).render(

    <StrictMode>
    <App />
  </StrictMode>,

  
)
