const createServer = require('http');
const app = require('./config/express');
    
createServer(app).listen(3000, function() {
    console.log('Servidor escutando na porta: ' + this.address().port);
});