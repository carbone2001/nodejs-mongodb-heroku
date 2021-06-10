const express = require('express')
const router = express.Router()
const Controller = require('../controllers/sucursal.controller');

//Datos zonales
router.post('/buscarTicketCercanos', Controller.buscarTicketsCercanos);//CORRECTO!
router.post('/buscarClientesCercanos', Controller.buscarClientesCercanos);//CORRECTO!

module.exports = router