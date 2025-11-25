import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./NavBar/NavBar";
import Lista from "./pages/Lista";
import Home from "./pages/Home";
import Produto from "./pages/Produto";
import Categoria from "./pages/Categoria"  

function App(){

  return(
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route
        path="/"
        element={
          <Home/>
        }/>

        <Route
        path="/produto"
        element={
          <Produto/>
        }/>

        <Route
        path="/listar"
        element={
          <Lista/>
        }/>

         <Route
        path="/categoria"
        element={
          <Categoria/>
        }/>
      </Routes>
    </Router>
  )
}

export default App;