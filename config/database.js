const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

const USUARIOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    usuario_nome_usuario VARCHAR(30) NOT NULL UNIQUE, 
    usuario_email VARCHAR(255) NOT NULL, 
    usuario_senha VARCAHR(255) NOT NULL,
    usuario_nome_completo VARCAHR(40) NOT NULL
)`;

const MARMITAS_SCHEMA = `
CREATE TABLE IF NOT EXISTS marmitas (
    marmita_id INTEGER PRIMARY KEY AUTOINCREMENT,
    marmita_descricao TEXT NOT NULL,
    marmita_preco DOUBLE NOT NULL,
    marmita_qt_estoque INTEGER NOT NULL,
    marmita_url_imagem TEXT NOT NULL,
    marmita_pec_desconto DOUBLE DEFAULT (0)
)`;

const INGREDIENTES_SCHEMA = `
CREATE TABLE IF NOT EXISTS ingredientes (
    ingrediente_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingrediente_nome VARCHAR(255) NOT NULL
)`;

const MARMITAS_INGREDIENTES_SCHEMA = `
CREATE TABLE IF NOT EXISTS marmitas_ingredientes (
    marmitas_ingreditentes_id INTEGER PRIMARY KEY AUTOINCREMENT,
    marmitas_ingredientes_marmita_id INTEGER NOT NULL,
    marmitas_ingredientes_ingrediente_id INTEGER NOT NULL,
    FOREIGN KEY(marmitas_ingredientes_marmita_id) REFERENCES marmitas(marmita_id) ON DELETE CASCADE,
    FOREIGN KEY(marmitas_ingredientes_ingrediente_id) REFERENCES ingredientes(ingrediente_id) ON DELETE CASCADE
)`;
const INSERT_DEFAULT_USER = 
`
INSERT INTO usuarios (
    usuario_nome_usuario, 
    usuario_email,
    usuario_senha,
    usuario_nome_completo
) SELECT 'beleaf', 'beleaf@teste.com.br', 'beleaf', 'Beleaf' WHERE NOT EXISTS (SELECT * FROM usuarios WHERE usuario_nome_usuario = 'beleaf')
`;

db.serialize(() => {
    db.run("PRAGMA foreign_keys=ON");
    db.run(USUARIOS_SCHEMA);
    db.run(MARMITAS_SCHEMA);
    db.run(INGREDIENTES_SCHEMA);
    db.run(MARMITAS_INGREDIENTES_SCHEMA);        
    db.run(INSERT_DEFAULT_USER);        

    db.each("SELECT * FROM usuarios", (err, user) => {
        console.log('Usuários');
        console.log(user);
    });
});

process.on('SIGINT', () =>
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    })
);

module.exports = db;