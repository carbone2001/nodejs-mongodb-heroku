const express = require('express')
const router = express.Router()
const Controller = require('../controllers/cliente.controller');

router.get('/', Controller.findAll);

router.post('/byDni', Controller.findByDNI);

router.post('/addCliente', Controller.create)

module.exports = router