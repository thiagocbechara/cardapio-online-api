const { usuarioAPI } = require('../controllers');
const { wrapAsync } = require('../infra');

module.exports = app => {
    app.route('/usuario/login').post(wrapAsync(usuarioAPI.login));
    app.route('/usuario/registar').post(wrapAsync(usuarioAPI.cadastrar));
    app.route('/usuario/existe/:nome_usuario').get(wrapAsync(usuarioAPI.verificaNomeUsarioEmUso));
};