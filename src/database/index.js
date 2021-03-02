//Importar o mongoose
const mongoose = require('mongoose');

//Mais informações em 'Deprecation Warnings'
//URL: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Indicar a URL de conexao com o banco de dados e como vai se dar a conexao
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 

//Precisamos indicar qual a classe de promise o mongoose vai usar
mongoose.Promise = global.Promise;

module.exports = mongoose;