import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Bem-vindo ao Sistema de Produtos</h1>
                <p>Gerencie categorias e produtos de forma eficiente</p>
            </div>
            
            <div className="features-grid">
                <div className="feature-card">
                    <h3>Gerenciar Produtos</h3>
                    <p>Crie, edite, visualize e exclua produtos do seu catálogo</p>
                    <Link to="/produto" className="btn-primary">Cadastrar Produtos</Link>
                </div>
                
                <div className="feature-card">
                    <h3>Gerenciar Categorias</h3>
                    <p>Organize seus produtos em categorias para melhor controle</p>
                    <Link to="/categoria" className="btn-primary">Cadastrar Categorias</Link>
                </div>
                
                <div className="feature-card">
                    <h3>Listar Itens</h3>
                    <p>Visualize todos os produtos e categorias cadastradas</p>
                    <Link to="/listar" className="btn-primary">Ver Listagem</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;