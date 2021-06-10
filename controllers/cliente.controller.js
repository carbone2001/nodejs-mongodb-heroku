const { compile } = require('morgan');
const db = require('../models/db');
const collection = 'clientes';

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

//Clientes con cantidad de ticket mayor a
exports.cantidadTicketsMayorA = (req, res) => {
    const CANTIDAD = req.body.cantidad ?? 2;
    console.log("CANTIDAD",CANTIDAD);
    var condition = [
        {
            $group: {
                _id: "$cliente.dni",
                nombre: { "$first": "$cliente.nombre" },
                apellido: { "$first": "$cliente.apellido" },
                cantidadTickets: { $sum: 1 },
            }
        },
        {
            $match: {
                $expr: {
                    $gt: ["$cantidadTickets", CANTIDAD]
                }
            }
        },
        {
            $sort: {
                "cantidadTickets": 1
            }
        }
    ];
    db.getInstance().collection('tickets').aggregate(condition).toArray()
        .then(data => {
            console.log("data",data);
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

// Clientes de Avellaneda con plan SuperPack1
exports.clientesDeUnaLocalidadConPlan = (req, res) => {
    const LOCALIDAD = req.body.localidad ?? "Avellaneda";
    const PLAN = req.body.plan ?? "Normal";
    var condition = [
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$localizacion.localidad.descripcion", LOCALIDAD] },
                        { $in: [PLAN, "$planes.tipo"] }
                    ]
                }
            }
        }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Element not found. params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error al traer la informacion. Params: " + JSON.stringify(req.body)});
        });
};

// Clientes de CABA que tenga el canal Noticias2
exports.clientesDeUnaLocalidadConCanal = (req, res) => {
    const LOCALIDAD = req.body.localidad ?? "Avellaneda";
    const CANAL = req.body.canal ?? "Noticias2";
    var condition = [
        {
            $project: {
                dni: 1,
                nombre: 1,
                apellido: 1,
                planes: "$planes",
                localidad: "$localizacion.localidad.descripcion"
            }
        },
        { $unwind: "$planes" },
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$localidad", LOCALIDAD] },
                        { $in: [CANAL, "$planes.canales"] }
                    ]
                }
            }
        },
        {
            $project: {
                dni: 1,
                nombre: 1,
                apellido: 1
            }
        }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Element not found. params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error al traer la informacion. Params: " + JSON.stringify(req.body)});
        });
};


// Clientes con plan SuperPack1 o SuperPackFull
exports.clientesConPlanes= (req, res) => {
    const PLAN1 = req.body.plan[0] ?? "";
    const PLAN2 = req.body.plan[1] ?? "";
    //console.log(req.body);
    var condition = [
        {
            $match: {
                $expr: {
                    $or: [
                        { $in: [PLAN1, "$planes.tipo"] },
                        { $in: [PLAN2, "$planes.tipo"] }
                    ]
                }
            }
        },
        {
            $project: {
                nombre: 1,
                apellido: 1,
                planes: "$planes.tipo"
            }
        }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Element not found. params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error al traer la informacion. Params: " + JSON.stringify(req.body)});
        });
};

// Cantidad de clientes con cada canal
exports.clientesPorCadaCanal= (req, res) => {
    var condition = [
        {
            $project: {
                planes: "$planes"
            }
        },
        { $unwind: "$planes" },
        { $unwind: "$planes.canales" },
        { $project: { nombre: 1, apellido: 1, canal: "$planes.canales" } },
        { $group: { _id: "$canal", cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1, canal: 1 } }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Element not found. params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error al traer la informacion. Params: " + JSON.stringify(req.body)});
        });
};

// Cantidad de canales de cada usuario
exports.canalesPorCadaCliente = (req, res) => {
    var condition = [
        {
            $project: {
                dni: 1,
                nombre: 1,
                apellido: 1,
                planes: "$planes"
            }
        },
        { $unwind: "$planes" },
        { $unwind: "$planes.canales" },
        { $project: { dni: 1, nombre: 1, apellido: 1, canal: "$planes.canales" } },
        { $group: { _id: "$dni", nombre: { $first: "$nombre" }, apellido: { $first: "$apellido" }, cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1, canal: 1 } }
    ];
    db.getInstance().collection(collection).aggregate(condition).toArray()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Element not found. params: " + JSON.stringify(req.body)});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error al traer la informacion. Params: " + JSON.stringify(req.body)});
        });
};

// Clientes dentro de area del Servicio Tecnico de Avellaneda
exports.dentroAreaServicioDeLocalidad = (req, res) => {
    const SERVICIO = req.body.area ?? 'Servicio Tecnico';
    const LOCALIDAD = req.body.localidad ?? 'Avellaneda';
    db.getInstance().collection("areas").findOne({ nombre: SERVICIO, "localizacion.localidad.descripcion": LOCALIDAD }, { "geometry": "$localizacion.geometry" })
    .then((area)=>{
        var condition = {
            "localizacion.geometry": {
                $geoWithin: {
                    $geometry: area.localizacion.geometry
                }
            }
        };
        var project = { nombre: 1, apellido: 1, localidad: "$localizacion.localidad.descripcion" };
        db.getInstance().collection(collection).find(condition,project).toArray()
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "No se encontro ningun area. params: " + JSON.stringify(req.body)});
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


