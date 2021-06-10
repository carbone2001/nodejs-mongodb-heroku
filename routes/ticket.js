const express = require('express')
const router = express.Router()
const Controller = require('../controllers/ticket.controller');

router.post('/', Controller.findAll);

//desperfectos
router.post('/desperfectosPorLocalidades', Controller.findDesperfectosPorLocalidades);//CORRECTO!

//atencion
router.post('/clientesQueSonEmpleadosConTickets', Controller.clientesQueSonEmpleadosConTickets);//CORRECTO!

module.exports = router