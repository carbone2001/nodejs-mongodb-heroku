const db = require('../models/db');
const collection = 'tickets';
// Create ticket
exports.create = (req, res) => {
    // Validate request
    if (!req.body.razon && !req.body.responsable && !req.body.cliente && !req.body.estado && !req.body.fecha) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a ticket
    const ticket = {
        razon: req.body.razon,
        responsable: req.body.responsable,
        cliente: req.body.cliente,
        estado: req.body.estado,
        fecha: req.body.fecha,
    };
    

    // Save ticket in the database
    db.getInstance().collection(collection).save(ticket)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the db.getInstance().collection('tickets')."
            });
        });
};

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



// Update a ticket by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    db.getInstance().collection(collection).findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update ticket with id=${id}. Maybe user was not found!`
                });
            } else res.send({ message: "ticket was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ticket with id=" + id
            });
        });
};

// Delete a ticket with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    db.getInstance().collection(collection).findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete ticket with id=${id}. Maybe ticket was not found!`
                });
            } else {
                res.send({
                    message: "ticket was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ticket with id=" + id
            });
        });
};
