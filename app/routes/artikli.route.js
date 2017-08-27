const models = require('../models');
const moment = require("moment");
const _ = require('lodash');
const helperFunctions = require('../utils/helper-functions');

function prepareMessage(tip, artikal) {
    const msg = {
        title: '',
        body: ''
    };
    switch (tip) {
        case 'insert':
            msg.body = artikal.kolicina + 'x ' + artikal.tip + ' za ' + artikal.imeprezime + ' po cijeni od ' + artikal.cijena + ' KM';
            if (artikal.status === 'Prodano') {
                msg.title = 'Artikal je prodan';
            } else if (artikal.status === 'Poslano') {
                msg.title = 'Artikal je poslan';
            } else {
                msg.title = 'Artikal je vraćen';
            }
            break;
        case 'update':
            msg.body = artikal.kolicina + 'x ' + artikal.tip + ' za ' + artikal.imeprezime + ' po cijeni od ' + artikal.cijena + ' KM';
            msg.title = 'Artikal je ažuriran';
            break;
        case 'delete':
            msg.title = 'Artikal je obrisan';
            msg.body = artikal.kolicina + 'x ' + artikal.tip + ' za ' + artikal.imeprezime + ' po cijeni od ' + artikal.cijena + ' KM';
            break;
        case 'statusChange':
            msg.body = artikal.kolicina + 'x ' + artikal.tip + ' za ' + artikal.imeprezime + ' po cijeni od ' + artikal.cijena + ' KM';
            if (artikal.status === 'Prodano') {
                msg.title = "Status artikla je promijenjen u 'Prodano'";
            } else if (artikal.status === 'Poslano') {
                msg.title = "Status artikla je promijenjen u 'Poslano'";
            } else {
                msg.title = "Status artikla je promijenjen u 'Vraćeno'";
            }
            break;
    }

    return msg;
}

module.exports = function (router, connection, mysql, logger) {
    router.get("/artikli", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /artikli');
        if (req.query.dateGTE && req.query.dateLTE) {
            const dateLTE = moment(new Date(req.query.dateLTE)).format("YYYY-MM-DD");
            const dateGTE = moment(new Date(req.query.dateGTE)).format("YYYY-MM-DD");
            let query = "SELECT Day(datum) as month, SUM(if(status='" + req.query.status + "',cijena,0)) as ukupnoProdano," +
                "SUM(if(status='Poslano',cijena,0)) as ukupnoPoslano" +
                " FROM ?? WHERE datum >= '" + dateGTE + "' and datum <= '" + dateLTE + "' GROUP BY Day(datum)";

            const table = ["prodaja"];
            query = mysql.format(query, table);
            connection.getConnection(function (err, conn) {
                conn.query(query, function (err, rows) {
                    if (err) {
                        logger.error(err);
                        res.json({"Error": true, "Message": err});
                    } else {
                        res.json({"Error": false, "Message": "Success", "Artikli": rows});
                    }
                    conn.release();
                });
            });
        }
        else if (req.query.pageSize && req.query.page) {

            start_index = (req.query.page - 1) * req.query.pageSize;
            brojItema = parseInt(req.query.pageSize);
            models.Artikal.findAll({
                where: {
                    status: req.query.status,
                    imeprezime: {
                        $like: req.query.searchQuery ? '%' + req.query.searchQuery + '%' : '%'
                    }
                },
                order: [['datumizmjene', 'DESC']],
                offset: start_index,
                limit: brojItema
            })
                .then(function (artikli) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Artikli: []
                    };
                    artikli.forEach(function (item) {
                        response.Artikli.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Artikli: []
                    };
                    res.json(response);
                });
        }
        else if (req.query.searchQuery || req.query.status) {
            models.Artikal.findAndCountAll({
                where: {
                    status: req.query.status,
                    imeprezime: {
                        $like: req.query.searchQuery ? '%' + req.query.searchQuery + '%' : '%'
                    }
                },
                order: [['datumizmjene', 'DESC']]
            })
                .then(function (artikli) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Count: artikli.count,
                        Artikli: []
                    };
                    artikli.rows.forEach(function (item) {
                        response.Artikli.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Artikli: []
                    };
                    res.json(response);
                });
        }
        else if (req.query.all) {
            models.Artikal.findAll({order: [['datum', 'DESC']]})
                .then(function (artikli) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Artikli: []
                    };
                    artikli.forEach(function (item) {
                        response.Artikli.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Artikli: []
                    };
                    res.json(response);
                });
        }
        else {
            models.Artikal.findAll({where: {status: ['Poslano', 'Vraceno']}, order: [['datum', 'DESC']]})
                .then(function (artikli) {
                    const response = {
                        ORM: true,
                        Error: false,
                        Message: 'Success',
                        Artikli: []
                    };
                    artikli.forEach(function (item) {
                        response.Artikli.push(item.dataValues);
                    });
                    res.json(response);
                })
                .catch(function (e) {
                    logger.error(e);
                    const response = {
                        Error: true,
                        Message: e.message,
                        Artikli: []
                    };
                    res.json(response);
                });
        }
    });
    router.get("/artikli/statistika", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');

        logger.info('GET /statistika');
        const response = {
            Error: false,
            Message: 'Success',
            Data1: [],
            Data2: [],
            Data3a: [],
            Data3b: []
        };


        models.Artikal.findAll({where: {status: ['Poslano', 'Prodano']}})
            .then(function (artikli) {
                const data = {
                    haris_poslano: 0,
                    armin_poslano: 0,
                    harisu_treba_doci: 0,
                    armin_treba_doci: 0,
                    haris_prodano_ukupno: 0,
                    armin_prodano_ukupno: 0,
                    ukupno_prodano_trakica: 0,
                    ukupno_poslano_trakica: 0,
                    ukupno_prodano_olovaka: 0,
                    ukupno_poslano_olovaka: 0,
                    ukupno_prodano_ostalo: 0,
                    ukupno_zarada_trakice: 0,
                    ukupno_zarada_olovke: 0,
                    ukupno_zarada_ostalo: 0
                };
                artikli.forEach(function (item) {
                    if (item.status === 'Poslano') {
                        if (item.prodavac === 'Haris') {
                            data.haris_poslano++;
                            data.harisu_treba_doci += item.cijena;
                        } else {
                            data.armin_poslano++;
                            data.armin_treba_doci += item.cijena;

                        }

                        if (item.tip === 'Trakice') {
                            data.ukupno_poslano_trakica += item.kolicina;
                        }
                        if (item.tip === 'Olovka') {
                            data.ukupno_poslano_olovaka += item.kolicina;
                        }
                    }
                    if (item.status === 'Prodano') {
                        if (item.prodavac === 'Haris') {
                            data.haris_prodano_ukupno++;
                        } else {
                            data.armin_prodano_ukupno++;
                        }

                        if (item.tip === 'Trakice') {
                            data.ukupno_prodano_trakica += item.kolicina;
                            data.ukupno_zarada_trakice += item.cijena;
                        }
                        else if (item.tip === 'Olovka') {
                            data.ukupno_prodano_olovaka += item.kolicina;
                            data.ukupno_zarada_olovke += item.cijena;
                        }
                        else {
                            data.ukupno_prodano_ostalo += item.kolicina;
                            data.ukupno_zarada_ostalo += item.cijena;
                        }
                    }
                });
                response.Data1.push(data);

                let query2 = "SELECT " +
                    "nacinpotraznje, Count(*) as num " +
                    "FROM ?? " +
                    "GROUP BY nacinpotraznje;";
                let query3 = '';
                let query4 = '';
                if (req.query.selectedDate) {

                    query3 = "SELECT date_format(datum, '%m.%Y') as datum_, SUM(if(tip='Trakice',kolicina,0)) as prodane_trakica, SUM(if(tip='Trakice',cijena,0)) as cijena_trakica, SUM(if(tip='Olovka',kolicina,0)) as prodane_olovke, SUM(if(tip='Olovka',cijena,0)) as cijena_olovki, SUM(if(tip='Pasta',kolicina,0)) as prodane_paste, SUM(if(tip='Pasta',cijena,0)) as cijena_paste,SUM(if(tip='Ostalo',kolicina,0)) as prodano_ostalo, SUM(if(tip='ostalo',cijena,0)) as cijena_ostalo FROM prodaja WHERE status='Prodano' and Year(datum) = " + connection.escape(req.query.selectedDate.substring(0, 4)) + " and Month(datum)= " + connection.escape(req.query.selectedDate.substring(4)) + " GROUP BY datum_  ORDER BY Year(datum) DESC,Month(datum) DESC;";
                    query4 = "SELECT date_format(datumstizanja, '%m.%Y') as datum_, SUM(if(tip='Trakice',kolicina,0)) as kupljene_trakice, SUM(if(tip='Trakice',cijena,0)) as cijena_kupljenih_trakica, SUM(if(tip='Olovke',kolicina,0)) as kupljene_olovke, SUM(if(tip='Olovke',cijena,0)) as cijena_kupljenih_olovki, SUM(if(tip='Paste',kolicina,0)) as kupljene_paste, SUM(if(tip='Paste',cijena,0)) as cijena_kupljenih_pasti FROM kupovina WHERE status='stigao' and Year(datumstizanja) = " + connection.escape(req.query.selectedDate.substring(0, 4)) + " and Month(datumstizanja)= " + connection.escape(req.query.selectedDate.substring(4)) + " GROUP BY datum_  ORDER BY Year(datumstizanja) DESC,Month(datumstizanja) DESC;";

                }
                else {
                    query3 = "SELECT date_format(datum, '%m.%Y') as datum_, SUM(if(tip='Trakice',kolicina,0)) as prodane_trakica, SUM(if(tip='Trakice',cijena,0)) as cijena_trakica, SUM(if(tip='Olovka',kolicina,0)) as prodane_olovke, SUM(if(tip='Olovka',cijena,0)) as cijena_olovki, SUM(if(tip='Pasta',kolicina,0)) as prodane_paste, SUM(if(tip='Pasta',cijena,0)) as cijena_paste,SUM(if(tip='Ostalo',kolicina,0)) as prodano_ostalo, SUM(if(tip='ostalo',cijena,0)) as cijena_ostalo FROM prodaja WHERE status='Prodano' GROUP BY datum_  ORDER BY Year(datum) DESC,Month(datum) DESC;";
                    query4 = "SELECT date_format(datumstizanja, '%m.%Y') as datum_, SUM(if(tip='Trakice',kolicina,0)) as kupljene_trakice, SUM(if(tip='Trakice',cijena,0)) as cijena_kupljenih_trakica, SUM(if(tip='Olovke',kolicina,0)) as kupljene_olovke, SUM(if(tip='Olovke',cijena,0)) as cijena_kupljenih_olovki, SUM(if(tip='Paste',kolicina,0)) as kupljene_paste, SUM(if(tip='Paste',cijena,0)) as cijena_kupljenih_pasti FROM kupovina WHERE status='stigao' GROUP BY datum_  ORDER BY Year(datumstizanja) DESC,Month(datumstizanja) DESC;";

                }


                const table = ["prodaja"];
                query2 = mysql.format(query2, table);
                query3 = mysql.format(query3, table);
                query4 = mysql.format(query4, ["kupovina"]);
                connection.getConnection(function (err, conn) {
                    conn.query(query2 + query3 + query4, function (err, results) {
                        if (err) {
                            logger.error(err);
                            res.json({"Error": true, "Message": err});
                        } else {
                            response.Data2 = results[0];
                            const merged = _.map(results[1], function(item) {
                                return _.assign(item, _.find(results[2], ['datum_', item['datum_']]));
                            });
                            // console.log("mergerLid", mergedList)
                            response.Data3 = (merged) ? merged : [];

                            res.json(response);
                        }
                        conn.release();
                    });
                });
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data1: [],
                    Data2: [],
                    Data3: []
                };
                res.json(response);
            });
    });
    router.get("/artikli/lastActivity", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /lastActivity');

        models.Artikal.findAll({order: 'datumizmjene DESC', limit: 20})
            .then(function (artikli) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Artikli: []
                };

                artikli.forEach(function (item) {
                    response.Artikli.push(item.dataValues);
                });
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
    router.get("/artikli/lastActivity/:brojStranice/:brojItema", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /lastActivity/' + req.params.brojStranice + "/" + req.params.brojItema);

        start_index = (req.params.brojStranice - 1) * req.params.brojItema;
        brojItema = parseInt(req.params.brojItema);

        models.Artikal.findAll({order: 'datumizmjene DESC', offset: start_index, limit: brojItema})
            .then(function (artikli) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Artikli: []
                };

                artikli.forEach(function (item) {
                    response.Artikli.push(item.dataValues);
                });
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
//Metoda za prodane artikle sa paging-om + counter
    router.get("/artikli/limit/:brojStranice/:brojItema", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /artikli/limit/' + req.params.brojStranice + "/" + req.params.brojItema);

        start_index = (req.params.brojStranice - 1) * req.params.brojItema;
        brojItema = parseInt(req.params.brojItema);

        models.Artikal.findAll({
            where: {status: 'Prodano'},
            order: [['datumizmjene', 'DESC'], ['imeprezime']],
            offset: start_index,
            limit: brojItema
        })
            .then(function (artikli) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Artikli: [],
                    Count: 0
                };

                artikli.forEach(function (item) {
                    response.Artikli.push(item.dataValues);
                });

                models.Artikal.count({where: {status: 'Prodano'}})
                    .then(function (c) {
                        response.Count = c;
                        res.json(response);
                    })
                    .catch(function (e) {
                        logger.error(e);
                        const response = {
                            Error: true,
                            Message: e.message,
                            Artikli: []
                        };
                        res.json(response);
                    });
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
    router.get("/artikli/:idprodaja", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /artikli/' + req.params.idprodaja);

        models.Artikal.findOne({where: {idprodaja: req.params.idprodaja}})
            .then(function (artikal) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Artikli: []
                };
                if (artikal)
                    response.Artikli.push(artikal.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
    router.post("/artikli", function (req, res) {

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'POST');

        logger.info('POST /artikli');

        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        const tempArtikal = req.body.artikal;

        tempArtikal.datumizmjene = date;
        models.Artikal.create(tempArtikal)
            .then(function (artikal) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Artikli: []
                };

                const poruka = prepareMessage('insert', req.body.artikal);
                helperFunctions.posaljiPush(poruka.title, poruka.body, req.body.artikal.senderId, res, logger);

                if (artikal)
                    response.Artikli.push(artikal.dataValues);
                res.json(response);

            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
    router.put("/artikli/:idprodaja", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');

        logger.info('PUT /artikli/' + req.params.idprodaja);

        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        const tempArtikal = req.body.artikal;
        console.log("art", tempArtikal);
        tempArtikal.datumizmjene = date;
        models.Artikal.update(tempArtikal, {where: {idprodaja: req.params.idprodaja}})
            .then(function (artikal) {
                const response = {
                    Error: false,
                    Message: artikal + ' updated!'
                };
                res.json(response);
                const poruka = prepareMessage('update', req.body.artikal);
                helperFunctions.posaljiPush(poruka.title, poruka.body, req.body.artikal.senderId, res, logger);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });

    });
    router.put("/artikli/:idprodaja/status", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        logger.info('PUT /artikli/' + req.params.idprodaja + "/status");
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");

        models.Artikal.update({status: req.body.status, datumizmjene: date}, {where: {idprodaja: req.params.idprodaja}})
            .then(function (artikal) {
                const response = {
                    Error: false,
                    Message: artikal + ' updated!'
                };
                const poruka = prepareMessage('statusChange', req.body.artikal);
                helperFunctions.posaljiPush(poruka.title, poruka.body, req.body.artikal.senderId, res, logger);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
    router.delete("/artikli/:idprodaja", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
        logger.info('DELETE /artikli');
        models.Artikal.destroy({where: {idprodaja: req.params.idprodaja}})
            .then(function (artikal) {
                const response = {
                    Error: false,
                    Message: artikal + " deleted!"
                };
                res.json(response);

                // const poruka = prepareMessage('delete', req.body.artikal);
                // helperFunctions.posaljiPush(poruka.title, poruka.body, req.body.artikal.senderId);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Artikli: []
                };
                res.json(response);
            });
    });
};