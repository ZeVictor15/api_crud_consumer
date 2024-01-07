const input = require('readline-sync');

const { 
    listarFornecedores,
    listarProdutosComFornecedores,
    adicionarProduto,
    listarEditarProdutos } = require('./src/lib/funcoes.ts');

const opcoesMenu = [
    'Listar Fornecedores',
    'Listar Produtos com Fornecedores',
    'Cadastrar Produto',
    'Listar/Editar Produtos',
]
// FUNÇÃO MAIN
async function main() {
    let sair = false;
    while (!sair) {
        console.clear();
        console.log('---------------------------------------');

        console.log(' BEM VIDO AO CONTROLE DE ESTOQUE ');
        console.log(' MENU DE OPÇÕES ');
        console.log('---------------------------------------');
        const opcao = parseInt(input.keyInSelect(opcoesMenu, 'Digite a opção: ',
            { cancel: 'Sair' }));
        switch (opcao) {
            case 0:
                console.clear();
                await listarFornecedores();
                input.question('...Pressione alguma tecla para continuar');
                break;
            case 1:
                console.clear();
                await listarProdutosComFornecedores();
                input.question('...Pressione alguma tecla para continuar');
                break;
            case 2:
                console.clear();
                await adicionarProduto();
                input.question('...Pressione alguma tecla para continuar');
                break;
            case 3:
                console.clear();
                await listarEditarProdutos();
                input.question('...Pressione alguma tecla para continuar');
                break;
            case -1:
                sair = input.keyInYN('Deseja sair da aplicação (y=sim / n=não)?')
        }
    }
}
// EXECUÇÃO DO APLICATIVO
main();