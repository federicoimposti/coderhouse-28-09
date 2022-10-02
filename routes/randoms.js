const { Router } = require("express");
const randoms = Router();
const { fork } = require("child_process");

randoms.get("/", (req, res) => {  
  const cant = req.query.cant;
  
  const child = fork('./utils/randomCalulate.js');

  child.send({
    start: 'start',
    cant: cant
  });
  
  child.on("message", (numerosRandom) => {
      res.send(numerosRandom);
  });
});

module.exports = randoms;