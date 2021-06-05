const express = require('express')
const router = express.Router()
const Controller = require('../controllers/ticket.controller');

router.get('/', Controller.findAll);

router.get('/desperfectosPorLocalidades', Controller.findDesperfectosPorLocalidades)

router.post('/addTicket', Controller.create)



module.exports = router