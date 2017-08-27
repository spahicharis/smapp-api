const express = require('express');
const helperFunctions = require('../utils/helper-functions.js');

module.exports = function(router, connection, mysql, logger) {
    router.get('/push/', function (req, res) {
        res.send("This is basic route");
    });
    router.put('/push/register', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow

        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        let query = "UPDATE ?? SET ??=? WHERE ime=" + connection.escape(req.body.ime);
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