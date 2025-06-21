// index.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import Home from './Home.tsx'
import Login from './Login.tsx'
import Welcome from './Welcome.tsx'
import Choose from './Choose.tsx'
import Driver from './Driver.tsx'
import Rider from './Rider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/rider" element={<Rider />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
