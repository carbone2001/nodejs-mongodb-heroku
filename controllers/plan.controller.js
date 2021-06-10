const db = require('../models/db');
const collection = 'planes';

// Planes lanzados antes de una fecha
exports.lanzamientosAntesDe = (req, res) => {
    const FECHA = req.body.fecha ? req.body.fecha : 0;
    //console.log(req.body);
    var condition = [
        {
            $match: {
                $expr: {
                    $lt: ["$fecha_lanzamiento", FECHA]
                }
            }
        },
        {
            $project: {
                "fecha_lanzamiento": 1,
                "tipo": 1,
                "cantidad_canales": 1,
            }
        },
        {
            $sort: {
                "fecha_lanzamiento": -1
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



