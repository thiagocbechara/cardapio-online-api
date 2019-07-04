const usuarioConverter = row => new Usuario(row);

class UsusarioDao {
    constructor(db) {
        this._db = db;
    }

    buscarPorNomeSenha(nome_usuario, senha) {
        return new Promise((resolve, reject) => this._db.get(
            `SELECT * FROM user WHERE usuario_nome = ? AND usuario_senha = ?`,
            [nome_usuario, senha],
            (err, row) => {
                if (err) {
                    console.log(err);
                    return reject('Can`t find user');
                }
                if (row) resolve(usuarioConverter(row));
                resolve(null);
            }
        ));
    }
    buscarPorNome(nome_usuario) {
        return new Promise((resolve, reject) => this._db.get(
            `SELECT * FROM user WHERE user_name = ?`,
            [nome_usuario],
            (err, row) => {
                if (err) {
                    console.log(err);
                    return reject('Can`t find user');
                }
                if (row) resolve(usuarioConverter(row));
                resolve(null);
            }
        ));

    }
    inserir(usuario) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO user (
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
                        return reject('Can`t register new user');
                    }
                    console.log(`User ${usuario.nome_usuario} registered!`)
                    resolve();
                });
        });
    }

}

module.exports = UsusarioDao;