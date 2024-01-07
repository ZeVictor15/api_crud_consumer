class Produto {
    _idFornFK: null;
    nome: string;
    qtdeEstoque: number;
    preco: number
  
    constructor(nome: string, qtdeEstoque: number, preco: number, _idFornFK: null) {
      this.nome = nome;
      this.qtdeEstoque = qtdeEstoque;
      this.preco = preco;
      this._idFornFK = _idFornFK;
    }
}  
module.exports = Produto;