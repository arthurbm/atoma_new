const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Project = require("../models/Project")
const Member = require("../models/Member")

const router = express.Router();

router.use(authMiddleware);

//List
router.get("/", async (req, res) => {
  try {
    //Eager loading
    const projects = await Project.find().populate(["user", "members"])
    return res.send({ projects })
  } catch (error) {
    return res.status(400).send({ error: "Error listing projects" })
  }
})

//Show
router.get("/:projectId", async (req, res) => {
  try {
    //Eager loading
    const project = await Project.findById(req.params.projectId).populate(["user", "members"])
    return res.send({ project })
  } catch (error) {
    return res.status(400).send({ error: "Error listing project" })
  }
})

//Create project
router.post("/", async (req, res) => {
  try {
    const { title, description, members, allocations, started } = req.body
    const project = await Project.create({ title, description, user: req.userId, members: members._id, allocations, started })

    await Promise.all(
      members.map(async (member) => {
        const projectMember = new Member({ ...member, project: project._id })
        await projectMember.save()
        project.members.push(projectMember)
      })
    )
    //Como estamos adicionando novos members no projeto, precisamos atualizar ele
    await project.save()
    return res.send({ project })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: "Error creating new project" })
  }
})

//Update
router.put("/:projectId", async (req, res) => {
  try {
    const { title, description, members } = req.body
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    ) //o mongoose vai retornar o valor atualizado
    //Vamos apagar todos os members antes de criá-los novamente
    project.members = []
    await Member.deleteMany({ project: project._id })
    await Promise.all(
      members.map(async (member) => {
        const projectMember = new Member({ ...member, project: project._id })
        await projectMember.save()
        project.members.push(projectMember)
      })
    )
    //Como estamos adicionando novos members no projeto, precisamos atualizar ele
    await project.save()
    return res.send({ project })
  } catch (err) {
    return res.status(400).send({ error: "Error updating project" })
  }
})

//Delete
router.delete("/:projectId", async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId)
    return res.send()
  } catch (error) {
    return res.status(400).send({ error: "Error removing project" })
  }
})

module.exports = (app) => app.use("/projects", router);
