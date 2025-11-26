import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar(){
    return(
        <nav className="navbar">
            <h1>Sistema de Registro de Produtos e Categorias</h1>
            <ul>
                <li><Link to="/">Início</Link></li>
                <li><Link to="/produto">Inserir novo produto</Link></li>
                <li><Link to="/categoria">Inserir nova categoria</Link></li>
                <li><Link to="/listar">Listar</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;