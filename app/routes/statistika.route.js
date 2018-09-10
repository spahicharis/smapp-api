const models = require('../models');
const moment = require("moment");
const _ = require('lodash');
const helperFunctions = require('../utils/helper-functions');
const sequelize = require('sequelize');
module.exports = function (router, connection, mysql, logger) {
    router.get("/statistika/kupovinaPoGodinama", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/kupovinaPoGodinama');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Kupovina po godinama',
            Result: []
        };

        const table = ["kupovina"]
        let query = 'SELECT YEAR(datumkupovine) as godina, sum(cijena) as cijena, sum(kolicina) as kolicina, count(status) as brojKupovina FROM kupovina WHERE status = '+"'stigao'"+'  group by year(datumkupovine);'
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    response.Result = results;
                    res.json(response);
                }
                conn.release();
            });
        });
    });

    router.get("/statistika/kupovinaPoMjesecima", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/kupovinaPoMjesecima');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Kupovina po mjesecima za sve godine',
            Result: []
        };

        const table = ["kupovina"]
        let query = 'SELECT year(datumkupovine) as godina, month(datumkupovine) as mjesec, sum(cijena) as cijena, sum(kolicina) as kolicina, count(status) as brojKupovina FROM kupovina WHERE status = '+"'stigao'"+'  group by year(datumkupovine),month(datumkupovine);'
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    response.Result = results;
                    res.json(response);
                }
                conn.release();
            });
        });
    });


    router.get("/statistika/prodajaPoGodinama", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/prodajaPoGodinama');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Prodaja po godinama',
            Result: []
        };

        const table = ["prodaja"]
        let query = 'SELECT YEAR(datum) as godina, sum(cijena) as cijena, count(status) as brojProdaja FROM prodaja WHERE status = '+"'Prodano'"+'  group by year(datum);'
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    response.Result = results;
                    res.json(response);
                }
                conn.release();
            });
        });
    });


    router.get("/statistika/prodajaPoMjesecima", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/prodajaPoGodinama');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Prodaja po mjesecima za sve godine',
            Result: []
        };

        const table = ["prodaja"]
        let query = 'SELECT YEAR(datum) as godina, month(datum) as mjesec, sum(cijena) as cijena, count(status) as brojProdaja FROM prodaja WHERE status = '+"'Prodano'"+'  group by year(datum), month(datum);'
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    response.Result = results;
                    res.json(response);
                }
                conn.release();
            });
        });
    });

    router.get("/statistika/finansije", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/finansije');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Finasije (kupljeno/prodano)',
            Result: []
        };

        const table = ["kupovina", "prodaja"];
        let query = 'SELECT sum(cijena) as kupljeno FROM kupovina;'
        let query2 = 'SELECT sum(cijena) as prodano FROM prodaja;'
        let query3 = 'SELECT sum(cijenaReklame) as cijenaReklama FROM reklame;'
        query = mysql.format(query, table);
        query2 = mysql.format(query2, table);
        query3 = mysql.format(query3, table);
        connection.getConnection(function (err, conn) {
            conn.query(query + query2 + query3, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    response.Result = [Object.assign({}, results[0][0], results[1][0], results[2][0],{zarada: results[1][0].prodano - (results[0][0].kupljeno + results[2][0].cijenaReklama)})];
                    res.json(response);
                }
                conn.release();
            });
        });
    });

    router.get("/statistika/prodajaPoGodinamaSveGodine", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /statistika/prodajaPoGodinamaSveGodine');

        const response = {
            Error: false,
            Message: 'Success',
            Desc: 'Prodaja po godinama',
            Result: []
        };

        const table = ["prodaja"]
        let query = 'SELECT year(datum) as godina, month(datum) as mjesec, sum(kolicina) as kolicina, sum(cijena) as cijena FROM prodaja  where status=\'Prodano\' group by year(datum), month(datum) order by year(datum), month(datum)';
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, results) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                }
                else {
                    // [{godina: 2014, podaci: [ {mjesec:4,kolicina400},
                //                                mjesec:5,kolicina:500}
                    //                          ] }
                    // ]
                    let myResult = [];
                    let grouped = _.groupBy(results, 'godina');
                    _.forEach(grouped, (value, key) => {
                        myResult.push({
                            godina: parseInt(key),
                            podaci: value
                        })
                    });
                    let brojMjeseci = [1,2,3,4,5,6,7,8,9,10,11,12];
                    myResult.forEach((item) => {
                        let brojMjeseciTemp = _.clone(brojMjeseci);
                        item.podaci.forEach((podatakItem) => {
                            _.remove(brojMjeseciTemp, (n) => {
                                return n === podatakItem.mjesec;
                            });
                        });

                        brojMjeseciTemp.forEach((mjesecItem) => {
                            item.podaci.push({godina: item.godina, mjesec: mjesecItem, kolicina: 0, cijena: 0})
                        })

                        _.sortBy(item.podaci, ['mjesec']);
                    });

                    response.Result = myResult;
                    res.json(response);
                }
                conn.release();
            });
        });
    });

};