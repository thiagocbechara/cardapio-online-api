const sign = require('jsonwebtoken');
const { UsuarioDao } = require('../infra');

const api = {}

api.login = async (req, res) => {
    const { nome_usuario, password } = req.body;
    console.log('####################################');
    const usuario = await new UsuarioDao(req.db).buscarPorNomeSenha(nome_usuario, password);
    console.log(usuario);
    if (usuario) {
        console.log(`User ${nome_usuario} authenticated`);
        console.log('Authentication Token added to response');
        const token = sign(usuario, req.app.get('secret'), {
            expiresIn: 86400 // seconds, 24h
        });
        res.set('x-access-token', token);
        return res.json(usuario);
    } else {
        console.log(`Authentication failed for user ${nome_usuario}`);
        console.log('No token generated');
        res.status(401).json({ message: `Authentication failed for user ${nome_usuario}` });
    }
};

api.cadastrar = async (req, res) => {
    const usuario = req.body;
    const usuarioId = await new UsuarioDao(req.db).inserir(usuario);
    res.status(204).end();
};

api.verificaNomeUsarioEmUso = async (req, res) => {
    const { nome_usuario } = req.params;
    const usuario = await new UsuarioDao(req.db).buscarPorNome(nome_usuario);
    res.json(!!usuario);
};

module.exports = api;