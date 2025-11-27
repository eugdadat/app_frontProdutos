import React, { useState, useEffect } from "react";
import "../styles/Listar.css";

function Listar() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("produtos");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    useEffect(() => {
        if (abaAtiva === "produtos") {
            buscarProdutos();
        } else {
            buscarCategorias();
        }
    }, [abaAtiva]);

    const buscarProdutos = async () => {
        try {
            const response = await fetch("http://localhost:4567/produtos");
            if (response.ok) {
                const data = await response.json();
                setProdutos(data);
            } else {
                mostrarMensagem("Erro ao carregar produtos", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const buscarCategorias = async () => {
        try {
            const response = await fetch("http://localhost:4567/categorias");
            if (response.ok) {
                const data = await response.json();
                setCategorias(data);
            } else {
                mostrarMensagem("Erro ao carregar categorias", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const deletarProduto = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4567/produtos/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                mostrarMensagem(`Produto "${nome}" excluído com sucesso!`, "sucesso");
                buscarProdutos();
            } else {
                const erro = await response.json();
                mostrarMensagem(erro.mensagem || "Erro ao excluir produto", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const deletarCategoria = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4567/categorias/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                mostrarMensagem(`Categoria "${nome}" excluída com sucesso!`, "sucesso");
                buscarCategorias();
            } else {
                const erro = await response.json();
                mostrarMensagem(erro.mensagem || "Erro ao excluir categoria", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const editarProduto = async (produto) => {
        const novoNome = prompt("Novo nome do produto:", produto.nome);
        if (!novoNome) return;

        const novoPreco = prompt("Novo preço do produto:", produto.preco);
        if (!novoPreco) return;

        const novoEstoque = prompt("Novo estoque do produto:", produto.estoque);
        if (!novoEstoque) return;

        try {
            const produtoAtualizado = {
                nome: novoNome,
                preco: parseFloat(novoPreco),
                estoque: parseInt(novoEstoque),
                categoria: produto.categoria || null
            };

            const response = await fetch(`http://localhost:4567/produtos/${produto.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(produtoAtualizado),
            });

            if (response.ok) {
                mostrarMensagem(`Produto "${novoNome}" atualizado com sucesso!`, "sucesso");
                buscarProdutos();
            } else {
                const erro = await response.json();
                mostrarMensagem(erro.mensagem || "Erro ao atualizar produto", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const editarCategoria = async (categoria) => {
        const novoNome = prompt("Novo nome da categoria:", categoria.nome);
        if (!novoNome) return;

        try {
            const response = await fetch(`http://localhost:4567/categorias/${categoria.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome: novoNome }),
            });

            if (response.ok) {
                mostrarMensagem(`Categoria "${novoNome}" atualizada com sucesso!`, "sucesso");
                buscarCategorias();
            } else {
                const erro = await response.json();
                mostrarMensagem(erro.mensagem || "Erro ao atualizar categoria", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const mostrarMensagem = (msg, tipo) => {
        setMensagem(msg);
        setTipoMensagem(tipo);
        setTimeout(() => {
            setMensagem("");
            setTipoMensagem("");
        }, 5000);
    };

    return (
        <div className="listar-container">
            <h2>Listagem de Dados</h2>

            {mensagem && (
                <div className={`mensagem ${tipoMensagem}`}>
                    {mensagem}
                </div>
            )}

            <div className="abas">
                <button 
                    className={`aba ${abaAtiva === "produtos" ? "ativa" : ""}`}
                    onClick={() => setAbaAtiva("produtos")}
                >
                    Produtos ({produtos.length})
                </button>
                <button 
                    className={`aba ${abaAtiva === "categorias" ? "ativa" : ""}`}
                    onClick={() => setAbaAtiva("categorias")}
                >
                    Categorias ({categorias.length})
                </button>
            </div>

            {abaAtiva === "produtos" && (
                <div className="tabela-container">
                    <h3>Lista de Produtos</h3>
                    {produtos.length === 0 ? (
                        <p className="sem-dados">Nenhum produto cadastrado.</p>
                    ) : (
                        <table className="tabela">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Preço</th>
                                    <th>Estoque</th>
                                    <th>Categoria</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map(produto => (
                                    <tr key={produto.id}>
                                        <td>{produto.id}</td>
                                        <td>{produto.nome}</td>
                                        <td>R$ {produto.preco?.toFixed(2)}</td>
                                        <td>{produto.estoque}</td>
                                        <td>{produto.categoria?.nome || "Sem categoria"}</td>
                                        <td>
                                            <div className="acoes-container">
                                                <button 
                                                    className="btn-editar"
                                                    onClick={() => editarProduto(produto)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="btn-excluir"
                                                    onClick={() => deletarProduto(produto.id, produto.nome)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {abaAtiva === "categorias" && (
                <div className="tabela-container">
                    <h3>Lista de Categorias</h3>
                    {categorias.length === 0 ? (
                        <p className="sem-dados">Nenhuma categoria cadastrada.</p>
                    ) : (
                        <table className="tabela">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(categoria => (
                                    <tr key={categoria.id}>
                                        <td>{categoria.id}</td>
                                        <td>{categoria.nome}</td>
                                        <td>
                                            <div className="acoes-container">
                                                <button 
                                                    className="btn-editar"
                                                    onClick={() => editarCategoria(categoria)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="btn-excluir"
                                                    onClick={() => deletarCategoria(categoria.id, categoria.nome)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Listar;