const db = require('../models/db');
const collection = 'sucursales';
// Create sucursal
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nombre && !req.body.localizacion) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a sucursal
    const sucursal = {
        nombre: req.body.nombre,
        localizacion: req.body.localizacion
    };
    

    // Save sucursal in the database
    db.getInstance().collection(collection).save(sucursal)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the db.getInstance().collection('sucursals')."
            });
        });
};

// Retrieve all sucursals from the database.
// exports.findAll = (req, res) => {
//     // const razon = req.query.razon;
//     // var condition = razon ? { razon: { $regex: new RegExp(razon), $options: "i" } } : {};
//     var condition = {};

//     db.getInstance().collection(collection).find(condition).toArray().then(data => {
//         res.send(data);
//     })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving users."
//             });
//         });
// };

// Find a single user with an id
// exports.findOne = (req, res) => {
//     const id = req.params.id;

//     db.getInstance().collection(collection).findById(id)
//         .then(data => {
//             if (!data)
//                 res.status(404).send({ message: "Not found user with id " + id });
//             else res.send(data);
//         })
//         .catch(err => {
//             res
//                 .status(500)
//                 .send({ message: "Error retrieving user with id=" + id });
//         });
// };

// Find a single user with an DNI
// exports.findByDNI = (req, res) => {
//     const DNI = parseInt(req.body.dni);
//     var condition = {"dni":DNI};
//     db.getInstance().collection(collection).findOne(condition)
//         .then(data => {
//             if (!data)
//                 res.status(404).send({ message: "Not found user with DNI " + DNI + " params: " + JSON.stringify(req.body)});
//             else res.send(data);
//         })
//         .catch(err => {
//             res
//                 .status(500)
//                 .send({ message: "Error retrieving user with DNI=" + DNI + "params: " + JSON.stringify(req.body)});
//         });
// };

//Obtener tickets a 2000mts/5000mts/10000mts de una sucursal
exports.buscarTicketsCercanos = (req, res) => {
    const NOMBRE = req.body.nombre;
    const DISTANCIA = parseInt(req.body.distancia);
    db.getInstance().collection(collection).findOne({ nombre: NOMBRE })
    .then((sucursal)=>{
        var condition = {
            "cliente.localizacion.geometry": {
                $near: {
                    $geometry: sucursal.localizacion.geometry,
                    $maxDistance: DISTANCIA
                }
            }
        };
        db.getInstance().collection("tickets").find(condition).toArray()
            .then(data => {

                if (!data)
                    res.status(404).send({ message: "No se encontro ningun ticket. params: " + JSON.stringify(req.body)});
                else res.send(data);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error al devolver la informacion. params: " + JSON.stringify(req.body)});
            });
    })
    .catch(()=>{
        res.status(500).send({message:"Ocurrio un error"});
    });
};


// Update a sucursal by the id in the request
// exports.update = (req, res) => {
//     if (!req.body) {
//         return res.status(400).send({
//             message: "Data to update can not be empty!"
//         });
//     }

//     const id = req.params.id;

//     db.getInstance().collection(collection).findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `Cannot update sucursal with id=${id}. Maybe user was not found!`
//                 });
//             } else res.send({ message: "sucursal was updated successfully." });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error updating sucursal with id=" + id
//             });
//         });
// };

// Delete a sucursal with the specified id in the request
// exports.delete = (req, res) => {
//     const id = req.params.id;

//     db.getInstance().collection(collection).findByIdAndRemove(id, { useFindAndModify: false })
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `Cannot delete sucursal with id=${id}. Maybe sucursal was not found!`
//                 });
//             } else {
//                 res.send({
//                     message: "sucursal was deleted successfully!"
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete sucursal with id=" + id
//             });
//         });
// };
