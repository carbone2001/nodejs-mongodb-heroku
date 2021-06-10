const db = require('../models/db');
const collection = 'empleados';

// Retrieve all empleados from the database.
exports.findAll = (req, res) => {
    // const razon = req.query.razon;
    // var condition = razon ? { razon: { $regex: new RegExp(razon), $options: "i" } } : {};
    var condition = {};

    db.getInstance().collection(collection).find(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Cantidad de Empleados no sean de Avellaneda
exports.cantidadNoSeanDeUnaLocalidad = (req, res) => {
    const localidad = req.body.localidad ? req.body.localidad : 'Avellaneda';
    var condition = [
        {
            $match: {
                $expr: {
                    $ne: ["$localizacion.localidad.descripcion", localidad]
                }
            }
        },
        {
            $count: "dni"
        }
    ];

    db.getInstance().collection(collection).aggregate(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Cantidad de Empleados no sean de atencion al cliente
exports.cantidadNoSeanDeUnArea = (req, res) => {
    const AREA = req.body.area ? req.body.area : 'Avellaneda';
    var condition = [
        {
            $match: {
                $expr: {
                    $ne: ["$area", AREA]
                }
            }
        },
        {
            $count: "dni"
        }
    ];

    db.getInstance().collection(collection).aggregate(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Empleados con cantidad de tickets atendidos mayor a
exports.cantidadTicketsMayorA = (req, res) => {
    console.log("BOdy",req.body);
    const CANTIDAD = req.body.cantidad ? req.body.cantidad : 0;
    console.log("BOdy",req.body);
    var condition = [
        {
            $match: {
                $expr: {
                    $gt: ["$ticekts_atendidos", CANTIDAD]
                }
            }
        },
        {
            $project: {
                "nombre": 1,
                "apellido": 1,
                "ticekts_atendidos": 1,
            }
        },
        {
            $sort: {
                "ticekts_atendidos": 1
            }
        }
    ];

    db.getInstance().collection(collection).aggregate(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Empleados con cantidad de tickets resueltos menor a
exports.cantidadTicketsMayorA = (req, res) => {
    const CANTIDAD = req.body.cantidad ? req.body.cantidad : 0;
    var condition = [
        {
            $match: {
                $expr: {
                    $lt: ["$ticekts_atendidos", CANTIDAD]
                }
            }
        },
        {
            $project: {
                "nombre": 1,
                "apellido": 1,
                "ticekts_atendidos": 1,
            }
        },
        {
            $sort: {
                "ticekts_atendidos": 1
            }
        }
    ];

    db.getInstance().collection(collection).aggregate(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Empleados de servicios financieros
exports.empleadosDeUnArea = (req, res) => {
    const AREA = req.body.area ? req.body.area : "Servicios Financieros";
    var condition = { "area": { $eq: AREA } };

    db.getInstance().collection(collection).find(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Empeados que sean de CABA
exports.empleadosDeUnaLocalidad = (req, res) => {
    const LOCALIDAD = req.body.localidad ? req.body.localidad : "Servicios Financieros";
    var condition = { "localizacion.localidad.descripcion": { $eq: LOCALIDAD } };

    db.getInstance().collection(collection).find(condition).toArray().then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};



