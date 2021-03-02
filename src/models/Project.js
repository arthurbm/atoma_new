//Importar o mongoose
const mongoose = require("../database")
const bcryptjs = require("bcryptjs")

//Definição do Schema (arquitetura de informação no DB para a entidade Project)
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  started: {
    type: Date,
    required: true,
  },
  finished: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  allocations: [
    {
      type: Number,
      required: true,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Project = mongoose.model("Project", ProjectSchema)

module.exports = Project
