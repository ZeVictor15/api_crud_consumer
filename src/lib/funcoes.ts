const Produto = require('../classes/produto');

import axios from 'axios';
import input from 'readline-sync';

const Fornecedor = require('../classes/fornecedor');

//FUNÇÕES CRUD para consumo da API
export async function listarFornecedores() {
    // Lista fornecedores cadastrados
    console.log('------------------------------');
    console.log('        FORNECEDORES');
    console.log('------------------------------');
    console.log('          ID NOME');
    console.log('------------------------------');
    try {
        await axios.get('http://localhost:3000/fornecedores').then(
            (result: { data: { _id: string; nome: string; }[]; }) => {
                result.data.forEach(({ _id, nome }) =>
                    console.log(_id + '- ' + nome))
            });
        console.log('------------------------------');
    } catch (error) {
        console.log('ERRO: ' + error);
    }
}

export async function listarProdutosComFornecedores() {
    // Lista fornecedores cadastrados
    console.log('--------------------------------------------');
    console.log('         PRODUTOS COM FORNECEDORES');
    console.log('--------------------------------------------');
    console.log('                 PRODUTO');
    console.log('         ID - NOME (NOME FORNECEDOR)');
    console.log('--------------------------------------------');

    await Promise.all([axios.get('http://localhost:3000/produtos'),
    axios.get('http://localhost:3000/fornecedores')]).then((results) => {
        const produtos = results[0].data; // Array de produtos
        const fornecedores = results[1].data; // Array de fornecedores
        //const fornecedor = fornecedores.find(elemento => elemento._id === id);

        let produtosComFornecedor = results[0].data.map((elemProduto: {
            _id: string; nome: string; qtdeEstoque: string; preco: string; _idFornFK: string;
        }) => ({
            _id: elemProduto._id,
            nome: elemProduto.nome,
            qtdeEstoque: elemProduto.qtdeEstoque,
            preco: elemProduto.preco,
            _idFornFK: elemProduto._idFornFK,

            nomeForn: fornecedores.find((elemForn: { _id: string; }) =>
                elemForn._id === elemProduto._idFornFK).nome
        })
        );
        produtosComFornecedor.forEach((elemento: { _id: string; nome: string; nomeForn: string; }) => {
            console.log(`${elemento._id} - ${elemento.nome} (${elemento.nomeForn})`);

        });
        console.log('--------------------------------------------');
    }
    )
        .catch((error) => console.log('ERRO: ' + error));
}

export async function adicionarProduto() {
    const produto = new Produto();
    produto.nome = input.question('Digite o nome do produto: ');
    produto.qtdeEstoque = parseInt(input.question('Digite a quantidade em estoque: ')
    );
    produto.preco = parseFloat(input.question('Digite o preço: '));
    try {
        // Lista fornecedores para obter o _id do fornecedor que fornece o produto
        // que está sendo cadastrado
        await axios.get('http://localhost:3000/fornecedores').then((result: { data: any[]; }) => {
            const vetFornecedores = result.data.map((elemForn) => elemForn.nome)
            console.log('Selecione abaixo o fornecedor para o produto:')
            const opcao = input.keyInSelect(vetFornecedores, 'Digite a opção: ', {
                cancel: 'null'
            });
            // CANCEL = -1

            produto._idFornFK = opcao >= 0 ? opcao + 1 : null;
            console.log(`Fornecedor selecionado: ${produto._idFornFK} ${produto._idFornFK ? '-'
                + vetFornecedores[produto._idFornFK - 1] : ''}`);
        });
        // Cadastra o produto
        await axios.post('http://localhost:3000/produtos', produto).then((result: { data: { message: any; }; }) =>
            console.log(result.data.message));
    } catch (error) {
        console.log('ERRO: ' + error);
    }
}
export async function listarEditarProdutos() {
    const Produto = require('../classes/produto');
    // Lista produtos cadastrados
    console.log('Selecione abaixo o produto para Alterar/Excluir:')
    try {
        let opcao, produtoId, produto: { _id: any; nome: any; qtdeEstoque?: any; preco?: any; _idFornFK?: any; }
        await axios.get('http://localhost:3000/produtos').then(
            (result: { data: { _id: string; nome: string; }[]; }) => {
                const vetProdutos = result.data.map(({ _id, nome }) => `-> ${_id} - ${nome}`)
                console.log('----------------------------------');
                console.log('              PRODUTOS');
                console.log('----------------------------------');
                console.log('           [ ] ID NOME');
                console.log('----------------------------------');
                opcao = input.keyInSelect(vetProdutos, 'Digite a opção: ', {
                    cancel: 'Sair'
                }); // CANCEL = -1
                produtoId = opcao >= 0 ? opcao + 1 : null;
                //console.clear();
            });
        if (opcao !== -1) { // -1 -> Sair
            console.clear();
            const produto = axios.get(`http://localhost:3000/produtos/${produtoId}`).then((result: { data: { _id: any; nome: any; qtdeEstoque: any; preco: any; _idFornFK: any; }; }) => {
                const opcoesDeMenu = ['Alterar', 'Excluir'];

                //produto = result.data;
                console.log('-----------------------------------');
                console.log(' DETALHE DO PRODUTO');
                console.log('-----------------------------------');
                console.log(`ID: ${result.data._id}`);
                console.log(`NOME: ${result.data.nome}`);
                console.log(`QTDE: ${result.data.qtdeEstoque} PREÇO: ${result.data.preco} ID_FORN: ${result.data._idFornFK}`);
                console.log('-----------------------------------');
                return result.data
            });
            opcao = input.keyInSelect(['Alterar', 'Excluir'], 'Digite a opção: ',
                { cancel: 'Sair' }); // CANCEL = -1

            switch (opcao) {
                case 0: // Alterar
                    const produtoData = await produto;
                    const produtoId = produtoData._id;
                    const updatedProduto = {
                        nome: input.question('NOME: '),
                        qtdeEstoque: parseInt(input.question('QTDE ESTOQUE: ')),
                        preco: parseFloat(input.question('PREÇO: ')),
                        _idFornFK: parseInt(input.question('ID FORNECEDOR: '))
                    };
                    await axios.put(`http://localhost:3000/produtos/${produtoId}`, updatedProduto)
                        .then((result: { data: { message: any; }; }) => console.log(result.data.message));
                    break;
                case 1: // Excluir
                    const excluir = input.keyInYN(`Deseja excluir o produto "${(await produto)._id} - ${(await produto).nome}" (y=sim / n=não)?`);
                    if (excluir) {
                        const produtoData = await produto;
                        const produtoId = produtoData._id;
                        await axios.delete(`http://localhost:3000/produtos/${produtoId}`).then((result: { data: { message: any; }; }) => console.log(result.data.message));
                    }
                    break;
                case -1:
                    console.log('Operação de "Alteração/Exclusão" CANCELADA!');
                    break;
            }
        } else {
            console.log('Operação de "Alteração/Exclusão" CANCELADA!')
        }
    } catch (error) {
        console.log('ERRO: ' + error);
    }
}