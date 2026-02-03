import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import OpenGSL from './pages/OpenGSL';
import Docs from './pages/Docs';
import Playground from './pages/Playground';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<OpenGSL />} />
        <Route path="/community" element={<OpenGSL />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
