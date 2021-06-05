const db = require('../models/db');
const collection = 'clientes';
// Create cliente
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre && !req.body.apellido && !req.body.dni && !req.body.servicios && !req.body.localizacion && !req.body.estado && !req.body.fechaAlta) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a cliente
    const cliente = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        servicios: req.body.servicios,
        localizacion: req.body.localizacion,
        estado: req.body.estado,
        fechaAlta: req.body.fechaAlta
    };
    

    // Save cliente in the database
    db.getInstance().collection(collection).save(cliente)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the db.getInstance().collection('clientes')."
            });
        });
};

// Retrieve all clientes from the database.
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

// Find a single user with an DNI
exports.findByDNI = (req, res) => {
    const DNI = parseInt(req.body.dni);
    var condition = {"dni":DNI};
    db.getInstance().collection(collection).findOne(condition)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found user with DNI " + DNI + " params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving user with DNI=" + DNI + "params: " + JSON.stringify(req.body)});
        });
};

// Update a cliente by the id in the request
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
                    message: `Cannot update cliente with id=${id}. Maybe user was not found!`
                });
            } else res.send({ message: "cliente was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating cliente with id=" + id
            });
        });
};

// Delete a cliente with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    db.getInstance().collection(collection).findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete cliente with id=${id}. Maybe cliente was not found!`
                });
            } else {
                res.send({
                    message: "cliente was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete cliente with id=" + id
            });
        });
};
