const express = require('express')
const router = express.Router()
const Controller = require('../controllers/sucursal.controller');

//router.get('/', Controller.);

router.get('/buscarTicketCercanos', Controller.buscarTicketsCercanos);

router.post('/addSucursal', Controller.create)

module.exports = router