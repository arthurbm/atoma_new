const jwt = require("jsonwebtoken")
const authConfig = require("../config/auth.json")

//O next só vai ser chamado para ir para o próximo passo
//Vamos interceptar o usuário aqui no middlware
module.exports = (req, res, next) => {
  //Vou buscar o header de autorização (authorization) na requisição
  const authHeader = req.headers.authorization

  //Se o header não foi enviado, já retorno um erro
  if (!authHeader) return res.status(401).send({ error: "No token provided" })

  //Verificar se o token está no formato correto: Bearer ksajdckjshdfkjakjdfh
  const parts = authHeader.split(" ")
  if (!parts.length == 2) return res.status(401).send({ error: "Token error" })

  const [scheme, token] = parts
  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: "Token malformatted" })

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" })
    req.userId = decoded.id
    return next()
  })
}
