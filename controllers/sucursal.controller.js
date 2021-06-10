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

//Obtener tickets cercanos de una sucursal
exports.buscarTicketsCercanos = (req, res) => {
    const SUCURSAL =  "Sucursal de "+(req.body.sucursal ?? 'Avellaneda');
    const DISTANCIA = req.body.distancia;
    console.log(req.body);
    console.log(SUCURSAL);
    db.getInstance().collection(collection).findOne({ nombre: SUCURSAL })
    .then((sucursal)=>{
        console.log(sucursal)
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


//Obtener clientes cercanos de la sucursal
exports.buscarClientesCercanos = (req, res) => {
    const SUCURSAL =  "Sucursal de "+(req.body.sucursal ?? 'Avellaneda');
    const DISTANCIA = req.body.distancia;
    console.log(req.body);
    console.log(SUCURSAL);
    db.getInstance().collection(collection).findOne({ nombre: SUCURSAL })
    .then((sucursal)=>{
        var condition = {
            "localizacion.geometry": {
                $near: {
                    $geometry: sucursal.localizacion.geometry,
                    $maxDistance: DISTANCIA
                }
            }
        };
        db.getInstance().collection("clientes").find(condition).toArray()
            .then(data => {

                if (!data)
                    res.status(404).send({ message: "No se encontro ningun cliente. params: " + JSON.stringify(req.body)});
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



