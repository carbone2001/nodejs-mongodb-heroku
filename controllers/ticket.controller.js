const db = require('../models/db');
const collection = 'tickets';


// Retrieve all tickets from the database.
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

// Find a single user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    db.getInstance().collection(collection).findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving user with id=" + id });
        });
};


//Agrupar tickets por razon y ordenarlos por cantidad
exports.findDesperfectosPorLocalidades = (req, res) => {
    var condition = [
        {
            $match:{
                $expr:{
                    $and:{
                        $eq:[
                            "$razon",
                            "desperfecto"
                        ]
                    }
                }
            }
        },
        {
            $group: {
                _id: "$cliente.localizacion.localidad.descripcion",
                cantidadTickets: { $sum: 1 },
            }
        },
        {
            $sort:{cantidadTickets:-1}
        }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No se pudieron encontrar tickets"});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving tickets" });
        });
};


// Cliente que son ademas empleados y generaron ticket
exports.clientesQueSonEmpleadosConTickets = (req, res) => {
    var condition = [
        {
            $lookup: {
                from: "empleados",
                as: "empleado",
                let: { dniCliente: "$cliente.dni" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: {
                                    $eq: [
                                        '$dni',
                                        '$$dniCliente'
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $match: {
                $expr: {
                    $and: [
                        {
                            $gt: [
                                { $size: "$empleado" },
                                0
                            ]
                        }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$cliente.dni",
                nombre: { $first: "$cliente.nombre" },
                apellido: { $first: "$cliente.apellido" },
                cantidadTickets: { $sum: 1 }
            }
        }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No se pudieron encontrar tickets"});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving tickets" });
        });
};