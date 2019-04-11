const Debt = require('../models').Debt;
const moment = require("moment");
const helperFunctions = require('../utils/helper-functions');

module.exports = function (router, connection, mysql, logger) {
    router.get("/debts", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /debts');
        Debt.findAndCountAll()
            .then(function (debts) {
                const response = {
                    ORM: true,
                    Error: false,
                    Message: 'Success',
                    Count: debts.count,
                    Data: []
                };
                debts.rows.forEach(function (item) {
                    response.Data.push(item.dataValues);
                });
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data: []
                };
                res.json(response);
            });
    });
    router.get("/debts/onlyLast", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /debts');
        Debt.findAndCountAll({
            limit: 1,
            order: [['dateCreated', 'DESC']]
        })
            .then(function (debts) {
                const response = {
                    ORM: true,
                    Error: false,
                    Message: 'Success',
                    Data: debts.rows
                };
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data: []
                };
                res.json(response);
            });
    });
    router.get("/debts/:debtId", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        logger.info('GET /debt by ID');
        Debt.findOne({ where: { debtId: req.params.debtId } })
            .then(function (debt) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Data: []
                };
                if (debt)
                    response.Data.push(debt.dataValues);
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data: []
                };
                res.json(response);
            });
    });
    router.post("/debts", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        logger.info('POST /debts');

        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        const tempData = req.body;

        tempData.dateCreated = date;

        Debt.create(tempData)
            .then(function (debt) {
                const response = {
                    Error: false,
                    Message: 'Success',
                    Data: []
                };

                const msg = tempData.debtor + ' dužan ' + tempData.creditor + 'u ' + tempData.debt_value;
                helperFunctions.posaljiPush('Novo stanje duga',
                    msg,
                    tempData.senderId, res, logger, debt.dataValues.idprodaja);

                if (debt)
                    response.Data.push(debt.dataValues);
                res.json(response);

            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data: []
                };
                res.json(response);
            });
    });

    router.delete("/debts/:debtId", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
        logger.info('DELETE /debts');
        Debt.destroy({ where: { debtId: req.params.debtId } })
            .then(function (debt) {
                const response = {
                    Error: false,
                    Message: debt + " deleted!"
                };
                res.json(response);
            })
            .catch(function (e) {
                logger.error(e);
                const response = {
                    Error: true,
                    Message: e.message,
                    Data: []
                };
                res.json(response);
            });
    });
};