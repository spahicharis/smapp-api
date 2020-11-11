const models = require('../models');

module.exports = function (router, connection, mysql, logger) {
    router.get("/korisnici", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /korisnici');
        models.Korisnik.findAndCountAll()
            .then(function (korisnici) {
                const response = {
                    ORM: true,
                    Error: false,
                    Message: 'Success',
                    Count: korisnici.count,
                    Users: []
                };
                korisnici.rows.forEach(function (item) {
                    response.Users.push(item.dataValues);
                });
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Users: []
                };
                res.json(response);
            });
    });
    router.get("/korisnici/:idkorisnici", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /korisnici by ID');
        models.Korisnik.findOne({where: {idkorisnici: req.params.idkorisnici}})
            .then(function (korisnik) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Users: []
                };
                if (korisnik)
                    response.Users.push(korisnik.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Users: []
                };
                res.json(response);
            });
    });
    router.post("/korisnici", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        logger.info('POST /korisnici');
        models.Korisnik.findOne({where: {ime: req.body.ime, sifra: req.body.sifra}})
            .then(function (korisnik) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Users: []
                };
                if (korisnik)
                    response.Users.push(korisnik.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Users: []
                };
                res.json(response);
            });
    });
    router.put("/korisnici/:idkorisnici", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        let query = "UPDATE ?? SET ?? = ?,?? = ? WHERE ?? = ?";
        const table = ["korisnici",
            "imeprezime", req.body.imeprezime,
            "ime", req.body.ime,
            "idkorisnici", req.params.idkorisnici
        ];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                logger.error(err);
                res.json({"Error": true, "Message": err});
            } else {
                res.json({"Error": false, "Message": "Korisnik izmijenjen!"});
            }
            connection.release();
        });
    });
    router.put("/korisnici/push/:idkorisnici", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        let query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        const table = ["korisnici",
            "pushNotif", req.body.pushNotif,
            "idkorisnici", req.params.idkorisnici
        ];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                logger.error(err);
                res.json({"Error": true, "Message": err});
            } else {
                res.json({"Error": false, "Message": "Osoba uspješno ažurirana!"});
            }
            connection.release();
        });
    });
};
