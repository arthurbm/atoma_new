const express = require('express');
//Importando o nosso modelo User
const User = require('../models/User');
//Importanto o módulo de encriptação e decriptação
const bcryptjs = require('bcryptjs');
//Importando o jwt
const jwt = require('jsonwebtoken');

const authConfig = require("../config/auth.json");

// Para podermos definir e trabalhar com as nossas rotas
const router = express.Router();

/**
 * O primeiro parâmetro é o que vai ser efetivamente único, por isso usamos
 * o id. O segundo parâmetro é um hash que deve ser único da aplicação,
 * por isso vamos criar esse hash e salvar em /config/auth.json. O terceiro
 * parâmetro é o tempo para o token expirar.
 */
function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400, //um dia em segundos
  });
}


/** 
 * Rota de cadastro. Uso do async (a partir do node 9) para tratar promises com 
 * o await.
 */
router.post('/authenticate', async(req, res) => {
  const { password } = req.body;
  const { information } = req.body;
  if (information.indexOf("@")!=-1){
    const email = information
    var user = await User.findOne({ email }).select('+password');
  }
  else{
    const username = information
    var user = await User.findOne({ username }).select('+password');
  }
  //O password nao vem no retorno de consultas, por isso usamos o metodo select
  if (!user)
    return res.status(400).send({ error: 'User not found' });
  if (!await (bcryptjs.compare(password, user.password)))
    return res.status(400).send({ error: 'Invalid password' });
  user.password = undefined;
  res.send({ 
    user, 
    token: generateToken({ id: user.id }),
  });
});

/**
 * Rota de autenticação
 */
router.post('/authenticate', async(req, res) => {
  const { email, password } = req.body;
  //O password nao vem no retorno de consultas, por isso usamos o metodo select
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return res.status(400).send({ error: 'User not found' });
  if (!await bcryptjs.compare(password, user.password))
    return res.status(400).send({ error: 'Invalid password' });
  user.password = undefined;
  res.send({ 
    user, 
    token: generateToken({ id: user.id }) 
  });
});

/** Definindo o router para ser utilizado dentro do app. Toda vez que o usuário 
 * acessar /session nosso router vai ser chamado. Com isso teremos uma rota
 * /session/register
 */
module.exports = app => app.use('/session', router);