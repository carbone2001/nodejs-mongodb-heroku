const db = require('../models/db');
const collection = 'areas';

//Servicio Tecnico de que sucursal para el ticket especifico
exports.servicioMasCercanoParaTicket = (req, res) => {
    const SERVICIO = req.body.area ?? 'Servicio Tecnico';
    const CLIENTE = req.body.dni ?? 0;
    console.log("BODY",req.body);
    db.getInstance().collection("tickets").findOne({"cliente.dni":CLIENTE})
    .then((ticket)=>{
        console.log("Ticket",ticket);
        var condition = {
            $and: [
                {
                    "nombre": { $eq: SERVICIO }
                },
                {
                    "localizacion.geometry": {
                        $geoIntersects: {
                            $geometry: ticket.cliente.localizacion.geometry
                        }
                    }
                }
            ]
        };
        //var project = { "sucursal": "$localizacion.localidad.descripcion", "direccion": "$localizacion.direccion"};
        db.getInstance().collection(collection).find(condition).toArray()
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

