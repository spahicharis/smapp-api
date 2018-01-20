const express = require('express');
const helperFunctions = require('../utils/helper-functions.js');
const _ = require('lodash');
module.exports = function(router, connection, mysql, logger) {
    router.get('/push/', function (req, res) {
        res.send("This is basic route");
    });
    router.put('/push/register/:id', function (req, res) {

        if(_.isEmpty(req.body))  {return res.status(400).json({"Message": "Body is empty :)"});}
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow

        logger.info("req.query.id", req.body);
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        let query = "UPDATE ?? SET ??=? WHERE idkorisnici=" + connection.escape(req.params.id);
        const table = ["korisnici",
            "reg_id",
            req.body.reg_id
        ];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({"Error": true, "Message": "Error executing MySQL query " + err});
                } else {
                    res.json({"Error": false, "Message": "Device is registered!", "Result": rows});
                }
                conn.release();
            });
        });
    });
    router.get('/push/send', function (req, res) {
        helperFunctions.posaljiTestPush(res, logger);
    });
};