const express = require('express')
const router = express.Router()
const Controller = require('../controllers/cliente.controller');

router.post('/', Controller.findAll);

router.post('/byDni', Controller.findByDNI);

//Clientes
router.post('/cantidadTicketsMayorA', Controller.cantidadTicketsMayorA);//CORRECTO!
router.post('/clientesConPlanes', Controller.clientesConPlanes);//CORRECTO!
router.post('/clientesPorCadaCanal', Controller.clientesPorCadaCanal);//CORRECTO!
router.post('/canalesPorCadaCliente', Controller.canalesPorCadaCliente);//CORRECTO!

//datos zonales
router.post('/clientesDeUnaLocalidadConPlan', Controller.clientesDeUnaLocalidadConPlan);//CORRECTO!
router.post('/clientesDeUnaLocalidadConCanal', Controller.clientesDeUnaLocalidadConCanal);//CORRECTO!
router.post('/dentroAreaServicioDeLocalidad', Controller.dentroAreaServicioDeLocalidad);//CORRECTO!
module.exports = router