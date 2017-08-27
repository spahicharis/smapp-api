const models = require('../models');
const moment = require("moment");

module.exports = function(router, connection, mysql, logger) {
    router.get("/paketi/statistika", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        let query = "SELECT " +
            "SUM(if(status = 'stigao' && tip='Trakice',kolicina,0)) as ukupno_kupljeno_trakica," +
            "SUM(if(status = 'stigao' && tip='Olovke',kolicina,0)) as ukupno_kupljeno_olovaka," +
            "SUM(if(status = 'stigao' && tip!='Olovke' && tip!='Trakice',kolicina,0)) as ukupno_kupljeno_ostalo," +
            "SUM(if(status = 'u putu' && tip='Trakice',1,0)) as paketi_trakica_uputu," +
            "SUM(if(status = 'u putu' && tip='Olovke',1,0)) as paketi_olovki_uputu," +
            "SUM(if(status = 'u putu' && tip!='Olovke' && tip!='Trakice',1,0)) as paketi_ostalo_uputu," +
            "SUM(if(status = 'u putu' && tip='Trakice',kolicina,0)) as trakice_uputu," +
            "SUM(if(status = 'u putu' && tip='Olovke',kolicina,0)) as olovke_uputu," +
            "SUM(if(status = 'u putu' && tip!='Olovke' && tip!='Trakice',kolicina,0)) as ostalo_uputu," +
            "SUM(if(status  = 'stigao' && tip = 'Trakice',cijena,0)) as ukupna_cijena_trakice," +
            "SUM(if(status  = 'stigao' && tip = 'Olovke',cijena,0)) as ukupna_cijena_olovki," +
            "SUM(if(status  = 'stigao' && tip != 'Olovke' && tip != 'Trakice',cijena,0)) as ukupna_cijena_ostalo" +
            " FROM ?? ;";
        let query1 = "SELECT " +
            "Month(datumkupovine),Year(datumkupovine), " +
            "Count(kolicina) as broj_pristiglih_paketa,  " +
            "SUM(if(tip = 'Trakice',cijena,0)) as cijena_pristiglih_trakica," +
            "SUM(if(tip = 'Olovke',cijena,0)) as cijena_pristiglih_olovaka," +
            "SUM(if(tip != 'Olovke' && tip != 'Trakice',cijena,0)) as cijena_pristiglih_ostalo," +
            "SUM(if(tip = 'Trakice',kolicina,0)) as kolicina_trakica," +
            "SUM(if(tip = 'Olovke',kolicina,0)) as kolicina_olovaka," +
            "SUM(if(tip != 'Olovke' && tip != 'Trakice',kolicina,0)) as kolicina_ostalo " +
            "FROM ?? " +
            "WHERE status = 'stigao' " +
            "GROUP BY Month(datumkupovine),Year(datumkupovine) " +
            "ORDER BY Year(datumkupovine),Month(datumkupovine);";
        const table = ["kupovina"];
        query = mysql.format(query, table);
        query1 = mysql.format(query1, table);
        connection.getConnection(function (err, conn) {
            conn.query(query + query1, function (err, result) {
                if (err) {
                    res.json({"Error": true, "Message": err});
                } else {
                    res.json({"Error": false, "Message": "Success", "Data1": result[0], "Data2": result[1]});
                }
                conn.release();
            });
        });
    });
    router.get("/paketi", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /paketi');
        start_index = (req.query.page - 1) * req.query.pageSize;
        brojItema = parseInt(req.query.pageSize);

        console.log("broj itema", brojItema);
        console.log("broj stranice", start_index);
        if (req.query.pageSize && req.query.page !== null) {
            models.Paket.findAndCountAll({
                where: {
                    status: req.query.status
                },
                order: [['status', 'DESC'], ['datumkupovine', 'DESC']],
                limit: brojItema,
                offset: start_index
            })
                .then(function (paketi) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Count: paketi.count,
                        Paketi: []
                    };
                    paketi.rows.forEach(function (item) {
                        response.Paketi.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Paketi: []
                    };
                    res.json(response);
                });
        } else {
            models.Paket.findAll({order: [['datumkupovine', 'DESC']]})
                .then(function (paketi) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Paketi: []
                    };
                    paketi.forEach(function (item) {
                        response.Paketi.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Paketi: []
                    };
                    res.json(response);
                });
        }
    });
    router.get("/paketi/:idkupovina", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /paketi/' + req.params.idkupovina);
        models.Paket.findOne({where: {idkupovina: req.params.idkupovina}})
            .then(function (paket) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Paketi: []
                };
                if (paket)
                    response.Paketi.push(paket.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Paketi: []
                };
                res.json(response);
            });
    });
    router.post("/paketi", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        logger.info('POST /paketi');
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        const datumstizanja = date;
        const tempPaket = req.body.paket;
        tempPaket.datumstizanja = req.body.datumstizanja ? req.body.datumstizanja : datumstizanja;
        models.Paket.create(tempPaket)
            .then(function (paket) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Paketi: []
                };
                if (paket)
                    response.Paketi.push(paket.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Paketi: []
                };
                res.json(response);
            });
    });
    router.put("/paketi/:idkupovina/status", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        logger.info('PUT /paketi/' + req.params.idkupovina + "/status");
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        models.Paket.update({
            status: req.body.status,
            datumstizanja: date
        }, {where: {idkupovina: req.params.idkupovina}})
            .then(function (paket) {
                const response = {
                    Error: false,
                    Message: paket + ' updated!'
                };
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Paketi: []
                };
                res.json(response);
            });
    });
    router.put("/paketi/:idkupovina", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        logger.info('PUT /paketi/' + req.params.idkupovina);
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        const datumstizanja = date;
        const tempPaket = req.body.paket;
        tempPaket.datumstizanja = req.body.datumstizanja ? req.body.datumstizanja : datumstizanja;
        models.Paket.update(tempPaket, {where: {idkupovina: req.params.idkupovina}})
            .then(function (paket) {
                const response = {
                    Error: false,
                    Message: paket + ' updated!'
                };
                res.json(response);
                // pushService.posaljiPush("Paket je ažuriran", req.body.senderId);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Paketi: []
                };
                res.json(response);
            });
    });
    router.delete("/paketi/:idkupovina", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
        logger.info('DELETE /paketi');
        models.Paket.destroy({where: {idkupovina: req.params.idkupovina}})
            .then(function (paket) {
                const response = {
                    Error: false,
                    Message: paket + " deleted!"
                };
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Paketi: []
                };
                res.json(response);
            });
    });
};