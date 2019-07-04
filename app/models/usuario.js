module.exports = class Usuario {
    constructor({id, nome_usuario, email, senha, nome_completo}){
        this.id = id;
        this.nome_usuario = nome_usuario;
        this.email = email;
        this.senha = senha;
        this.nome_completo = nome_completo;
    }
};