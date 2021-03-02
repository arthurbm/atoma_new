//Importar o mongoose
const mongoose = require('../database');
const bcryptjs = require("bcryptjs");

//Definição do Schema (arquitetura de informação no DB para a entidade User)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  projectsOwned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  projectsPartOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  }
});

//Função do mongoose para dizer o que é para acontecer antes de...
//Ao criar um usuário, o hash da senha vai acontecer automaticamente
UserSchema.pre('save', async function(next) {
  //quantas vezes o hash será gerado (o número de rounds)
  const hash = await bcryptjs.hash(this.password, 10); 
  this.password = hash;

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;