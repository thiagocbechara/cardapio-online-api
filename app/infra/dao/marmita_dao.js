const marmitaConverter = row => ({
    id: row.ingrediente_id,
    descricao: row.marmita_descricao,
    preco: row.marmita_preco,
    qt_estoque: marmita_qt_estoque,
    url_imagem: marmita_url_imagem,
    pec_desconto: marmita_pec_desconto,
    ingredientes: []
});
const ingredienteConverter = row => ({
    id: row.ingrediente_id,
    nome: row.ingrediente_nome
})

class MarmitaDao {
    constructor(db) {
        this._db = db;
    }
    inserir(marmita) {
        return new Promise((resolve, reject) => {
            let _this = this;
            _this._db.run(`
                INSERT INTO marmitas (
                    marmita_descricao,
                    marmita_preco,
                    marmita_qt_estoque,
                    marmita_url_imagem,
                    marmita_pec_desconto
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    marmita.descricao,
                    marmita.preco,
                    marmita.qt_estoque,
                    marmita.url_imagem,
                    marmita.pec_desconto
                ],
                function (err) {
                    if (err) {
                        console.log(err);
                        return reject('Não é possível inserir a marmita');
                    }
                    marmita.id = this.lastId;
                    for (let ingrediente of marmita.ingredientes) {
                        _this._db.run(`
                            INSERT INTO marmitas_ingredientes (
                                marmitas_ingredientes_marmita_id,
                                marmitas_ingredientes_ingrediente_id
                            ) VALUES (?, ?)`,
                            [marmita.id, ingrediente.id],
                            function (err) {
                                if (err) {
                                    console.log(err);
                                    return reject('Não é possível inserir o ingrediente na marmita');
                                }
                            });
                    }
                    resolve(marmita.id);
                });            
        })
    }
    inserirIngrediente(ingrediente) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO ingredientes (ingrediente_nome) VALUES (?)`,
                [ingrediente.nome],
                function (err) {
                    if (err) {
                        console.log(err);
                        return reject('Não é possível inserir o ingrediente');
                    }
                    ingrediente.id = this.lastId;
                    resolve(ingrediente.id);
                })
        });
    }
    selecionar(id) {
        return new Promise((resolve, reject) => {
            let marmita = {};
            let _this = this;
            _this._db.run(`
                SELECT *
                  FROM marmitas
                 WHERE marmita_id = ?`,
                [id],
                function (err, row) {
                    if (err) {
                        console.log(err);
                        return reject('Marmita não encontrada');
                    }
                    if (!row) {
                        resolve(null);
                    }
                    marmita = marmitaConverter(row);
                    _this._db.run(`
                        SELECT ingrediente.*
                        FROM ingredientes, marmitas_ingredientes
                        WHERE marmitas_ingredientes_ingrediente_id = ingrediente_id
                        AND marmitas_ingredientes_marmita_id     = ?`,
                        [marmita.id],
                        function (err, rows) {
                            if (err) {
                                console.log(err);
                                return reject('Ingredientes não encontrados');
                            }
                            marmita.ingredientes = rows.map(ingredienteConverter);
                        });
                        resolve(marmita);
                });            
        })
    }
    listar(pagina, quantidade) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                SELECT *
                  FROM marmitas
                  LIMIT ? OFFSET ?`,
                [quantidade, pagina * quantidade],
                function (err, rows) {
                    if (err) {
                        console.log(err);
                        return reject('Não é realizar a busca');
                    }
                    resolve(rows.map(marmitaConverter));
                })
        })
    }
    alterar(marmita) {
        return new Promise((resolve, reject) => {
            let _this = this;
            _this._db.run(`
                UPDATE marmitas
                   SET marmita_descricao    = ?,
                       marmita_preco        = ?,
                       marmita_qt_estoque   = ?,
                       marmita_url_imagem   = ?,
                       marmita_pec_desconto = ?
                 WHERE marmita_id = ?`,
                [marmita.descricao, marmita.preco, marmita.qt_estoque,
                marmita.url_imagem, marmita.pec_desconto, marmita.id],
                err => {
                    if (err) {
                        console.log(err);
                        return reject('Não é possível alterar a marmita');
                    }
                    _this._db.run(`
                        DELETE
                          FROM marmitas_ingredientes
                         WHERE marmitas_ingredientes_marmita_id = ?`,
                        [marmita.id]);
                    for (let ingrediente of marmita.ingredientes) {
                        this._db.run(`
                            INSERT INTO marmitas_ingredientes (
                                marmitas_ingredientes_marmita_id,
                                marmitas_ingredientes_ingrediente_id
                            ) VALUES (?, ?)`,
                            [marmita.id, ingrediente.id],
                            function (err) {
                                if (err) {
                                    console.log(err);
                                    return reject('Não é possível inserir o ingrediente na marmita');
                                }
                            });
                    }
                    resolve('Marmita alterada com sucesso');
                });
        })
    }
    excluir(id) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                DELETE marmita WHERE marmita_id = ?`,
                [id],
                function(err){
                    if(err){
                        console.log(err);
                        return reject('Não foi possível excluir a marmita');
                    }
                    resolve('Marmita excluída com sucesso');
                })
        })
    }
}