import React, { useState, useEffect } from "react";
import "../styles/Listar.css";

function Listar() {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [abaAtiva, setAbaAtiva] = useState("produtos");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const [idEditando, setIdEditando] = useState(null);
    const [dadosTemporarios, setDadosTemporarios] = useState({});

    useEffect(() => {
        buscarCategorias();
        if (abaAtiva === "produtos") {
            buscarProdutos();
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

    const iniciarEdicao = (item, tipo) => {
        setIdEditando({ id: item.id, tipo: tipo });
        setDadosTemporarios({ ...item }); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosTemporarios(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const cancelarEdicao = () => {
        setIdEditando(null);
        setDadosTemporarios({});
    };

    const salvarEdicaoProduto = async () => {
        const { id, nome, preco, estoque, categoria } = dadosTemporarios;

        if (!nome || !preco || !estoque) {
            mostrarMensagem("Preencha todos os campos do produto.", "erro");
            return;
        }

        try {
            const produtoAtualizado = {
                nome: nome,
                preco: parseFloat(preco),
                estoque: parseInt(estoque),
                categoria: categoria.id ? { id: categoria.id, nome: categoria.nome } : null
            };

            const response = await fetch(`http://localhost:4567/produtos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(produtoAtualizado),
            });

            if (response.ok) {
                mostrarMensagem(`Produto "${nome}" atualizado com sucesso!`, "sucesso");
                buscarProdutos();
                cancelarEdicao();
            } else {
                const erro = await response.json();
                mostrarMensagem(erro.mensagem || "Erro ao atualizar produto", "erro");
            }
        } catch (error) {
            console.error("Erro:", error);
            mostrarMensagem("Erro de conexão com o servidor", "erro");
        }
    };

    const salvarEdicaoCategoria = async () => {
        const { id, nome } = dadosTemporarios;

        if (!nome) {
            mostrarMensagem("O nome da categoria não pode estar vazio.", "erro");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4567/categorias/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome }),
            });

            if (response.ok) {
                mostrarMensagem(`Categoria "${nome}" atualizada com sucesso!`, "sucesso");
                buscarCategorias();
                cancelarEdicao();
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
                                {produtos.map(produto => {
                                    const estaEditando = idEditando && idEditando.id === produto.id && idEditando.tipo === 'produto';
                                    
                                    if (estaEditando) {
                                        return (
                                            <tr key={produto.id}>
                                                <td>{produto.id}</td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        name="nome"
                                                        value={dadosTemporarios.nome || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        name="preco"
                                                        step="0.01"
                                                        value={dadosTemporarios.preco || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                        type="number" 
                                                        name="estoque"
                                                        value={dadosTemporarios.estoque || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                                <td>
                                                    {produto.categoria?.nome || "Sem categoria"}
                                                </td>
                                                <td>
                                                    <div className="acoes-container">
                                                        <button 
                                                            className="btn-salvar"
                                                            onClick={salvarEdicaoProduto}
                                                        >
                                                            Salvar
                                                        </button>
                                                        <button 
                                                            className="btn-cancelar"
                                                            onClick={cancelarEdicao}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
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
                                                        onClick={() => iniciarEdicao(produto, 'produto')}
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
                                    );
                                })}
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
                                {categorias.map(categoria => {
                                    const estaEditando = idEditando && idEditando.id === categoria.id && idEditando.tipo === 'categoria';

                                    if (estaEditando) {
                                        return (
                                            <tr key={categoria.id}>
                                                <td>{categoria.id}</td>
                                                <td>
                                                    <input 
                                                        type="text" 
                                                        name="nome"
                                                        value={dadosTemporarios.nome || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="acoes-container">
                                                        <button 
                                                            className="btn-salvar"
                                                            onClick={salvarEdicaoCategoria}
                                                        >
                                                            Salvar
                                                        </button>
                                                        <button 
                                                            className="btn-cancelar"
                                                            onClick={cancelarEdicao}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={categoria.id}>
                                            <td>{categoria.id}</td>
                                            <td>{categoria.nome}</td>
                                            <td>
                                                <div className="acoes-container">
                                                    <button 
                                                        className="btn-editar"
                                                        onClick={() => iniciarEdicao(categoria, 'categoria')}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Listar;