const { MarmitaDao } = require('../infra');

const api = {};

api.inserir = async (req, res) => {
    const marmita = req.body;
    const marmitaId = await new MarmitaDao(req.db).inserir(marmita);
    res.status(204).end();
};
api.selecionar = async (req, res) => {
    const { marmitaId } = req.params;
    const marmita = await new MarmitaDao(req.db).selecionar(marmitaId);
    if (marmita) {
        res.json(marmita);
    } else {
        res.status(404).json({ message: 'A marmita informada não existe' });
    }
};
api.excluir = async (req, res) => {
    const { marmitaId } = req.params;
    await new MarmitaDao(req.db).excluir(marmitaId);
    res.status(200).end();
};
api.alterar = async (req, res) => {
    const marmita = req.body;
    await new MarmitaDao(req.db).alterar(marmita);
    res.status(204).end();
};
api.listar = async (req, res) => {
    const { pagina } = req.params;
    let marmitas = await new MarmitaDao(req.db).listar(pagina, 9);
    if (marmitas) {
        res.json(marmitas);
    } else {
        res.status(404).json({ message: 'Não foi possível encontrar resultados para a página informada' });
    }
};

module.exports = api;