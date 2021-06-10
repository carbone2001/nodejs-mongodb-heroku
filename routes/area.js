const express = require('express')
const router = express.Router()
const Controller = require('../controllers/area.controller');

router.post('/servicioMasCercanoParaTicket', Controller.servicioMasCercanoParaTicket);//CORRECTO!

module.exports = router