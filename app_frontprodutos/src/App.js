import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Produto from './pages/Produto';
import Categoria from './pages/Categoria';
import Listar from './pages/Listar'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produto" element={<Produto />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/listar" element={<Listar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;