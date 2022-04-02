const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

// Mock do banco de dados do backend para testes isolados no front
const users = []

// Para teste somente!
app.get('/users', (req, res) => {
  res.json(users)
})

// Cadastro do usuario (Rota no Frontend)
app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) // criptografia da senha
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user) // Mandar POST em /cadastrar do backend
    /* 
    Depois de mandar o POST pro backend, entra a parte de 
    receber o request com o id_login do usuario cadastrado e guarda-la no JWT
    */
    res.status(201).send() // Cadastro com sucesso
  } catch {
    res.status(500).send() // Erro no cadastro
  }
})

// Backend
app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)