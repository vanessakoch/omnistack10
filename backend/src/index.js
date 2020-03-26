const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect("mongodb+srv://os10:os10@cluster0-lrai1.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Metodos HTTP: Get, post, put, delete
// Tipos de parametros:
// Query Params: req.query (filtros, ordenacao, paginacao)
// Route Params: req.params (identificar recurso na alteracao e remocao)
// Body: req.body (dados para criar ou alterar um registro)


app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);