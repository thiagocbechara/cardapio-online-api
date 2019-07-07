const { marmitaAPI } = require('../controllers');
const { wrapAsync } = require('../infra');

module.exports = app => {
    app.route('/marmita/inserir').post(wrapAsync(marmitaAPI.inserir));
    app.route('/marmita/alterar').post(wrapAsync(marmitaAPI.alterar));
    app.route('/marmita/excluir/:id').post(wrapAsync(marmitaAPI.excluir));
    app.route('/marmita/selecionar/:id').get(wrapAsync(marmitaAPI.selecionar));
    app.route('/marmita/listar/:pagina').post(wrapAsync(marmitaAPI.pagina));
};