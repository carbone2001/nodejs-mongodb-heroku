const express = require('express')
const router = express.Router()
const controller = require('../controllers/plan.controller');


router.post('/lanzamientosAntesDe', controller.lanzamientosAntesDe);//CORRECTO!

module.exports = router