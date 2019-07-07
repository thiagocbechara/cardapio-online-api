const usuarioConverter = row =>({
    id: row.usuario_id,
    nome_usuario: row.usuario_nome_usuario,
    email: row.usuario_email,
    senha: row.usuario_senha,
    nome_completo: row.usuario_nome_completo
});

class UsusarioDao {
    constructor(db) {
        this._db = db;
    }

    buscarPorNomeSenha(nome_usuario, senha) {
        return new Promise((resolve, reject) => this._db.get(
            `SELECT * FROM usuarios WHERE usuario_nome_usuario = ? AND usuario_senha = ?`,
            [nome_usuario, senha],
            (err, row) => {
                if (err) {
                    console.log(err);
                    return reject('Usuário não encontrado');
                }
                console.log(row)
                if (row) resolve(usuarioConverter(row));
                resolve(null);
            }
        ));
    }
    buscarPorNome(nome_usuario) {
        return new Promise((resolve, reject) => this._db.get(
            `SELECT * FROM usuarios WHERE usuario_nome_usuario = ?`,
            [nome_usuario],
            (err, row) => {
                if (err) {
                    console.log(err);
                    return reject('Usuário não encontrado');
                }
                if (row) resolve(usuarioConverter(row));
                resolve(null);
            }
        ));

    }
    inserir(usuario) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO usuarios (
                    usuario_nome_usuario,
                    usuario_email,
                    usuario_senha, 
                    usuario_nome_completo
                ) values (?,?,?,?)`,
                [
                    usuario.nome_usuario,
                    usuario.email,
                    usuario.senha,
                    usuario.nome_completo
                ],
                function (err) {
                    if (err) {
                        console.log(err);
                        return reject('Não é possível criar o novo usuário');
                    }
                    console.log(`Usuário ${usuario.nome_usuario} registrado!`)
                    resolve(this.lastId);
                });
        });
    }

}

module.exports = UsusarioDao;