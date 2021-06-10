const express = require('express')
const router = express.Router()
const Controller = require('../controllers/empleado.controller');

router.post('/', Controller.findAll);

//Datos zonales
router.post('/cantidadNoSeanDeUnaLocalidad', Controller.cantidadNoSeanDeUnaLocalidad)//CORRECTO!
router.post('/cantidadNoSeanDeUnArea', Controller.cantidadNoSeanDeUnArea)//CORRECTO!
router.post('/empleadosDeUnArea', Controller.empleadosDeUnArea)//CORRECTO!
router.post('/empleadosDeUnaLocalidad', Controller.empleadosDeUnaLocalidad)//CORRECTO!

//Atencion al cliente
router.post('/cantidadTicketsMayorA', Controller.cantidadTicketsMayorA)//CORRECTO!
module.exports = router