const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// Carregar dados do arquivo user.json
const userDataPath = path.join(__dirname, "../database/user.json");
let usuarios = [];
try {
  const data = fs.readFileSync(userDataPath, "utf8");
  const jsonData = JSON.parse(data);
  usuarios = jsonData.users;
} catch (error) {
  console.error("Erro ao ler o arquivo user.json:", error);
}

router.post("/", async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ message: "Login e senha são obrigatórios" });
  }

  try {
    const user = usuarios.find((u) => u.login === login);

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
