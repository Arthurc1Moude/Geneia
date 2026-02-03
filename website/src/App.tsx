import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Extensions from './pages/Extensions'
import Download from './pages/Download'
import Playground from './pages/Playground'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/extensions" element={<Extensions />} />
          <Route path="/download" element={<Download />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
