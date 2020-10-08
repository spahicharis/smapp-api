#!/bin/env node
//  OpenShift sample Node application
const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const path = require('path');
const con = require('./config/db_conf.js');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
const dumpDir = 'dump';
const router = express.Router();
const connection = con.connection();
const winston = require('winston');
const schedule = require('node-schedule');
const moment = require("moment");
const mysqlDump = require('mysqldump');
const helper = require('./utils/helper-functions');
const cors = require('cors');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

if (!fs.existsSync(dumpDir)) {
    fs.mkdirSync(dumpDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (winston.transports.File)({
            filename: `${logDir}/results.log`,
            timestamp: tsFormat,
            level: env === 'development' ? 'debug' : 'info'
        })
    ]
});

const j = schedule.scheduleJob({ hour: 7, minute: 0 }, function () {
    const date = moment(new Date()).format("YYYY-MM-DD-HH-mm-ss");
    logger.info('Creating backup at ' + date);
    mysqlDump({
        host: con.configParams.host,
        user: con.configParams.username,
        password: con.configParams.password,
        database: con.configParams.database,
        tables: ['prodaja', 'kupovina', 'korisnici', 'reklame', 'debts'], // only these tables
        //dest: `${dumpDir}/data-` + date + `.sql.txt`, // destination file
        getDump: true
    }, function (err, result) {
        // create data.sql file;
        //logger.info("ress" + err)
        helper.posaljiMail('kjhgfass@gmail.com', `SMAPP - Backup - ${date}`, result);
        if (err) {
            logger.error(err);
        }
    });
});


const date = moment(new Date()).format("YYYY-MM-DD-HH-mm-ss");
logger.info('Creating backup at ' + date);
mysqlDump({
    host: con.configParams.host,
    user: con.configParams.username,
    password: con.configParams.password,
    database: con.configParams.database,
    tables: ['prodaja', 'kupovina', 'korisnici', 'reklame', 'debts'], // only these tables
    //dest: `${dumpDir}/data-` + date + `.sql.txt`, // destination file
    getDump: true
}, function (err, result) {
    // create data.sql file;
    //logger.info("ress" + err)
    helper.posaljiMail('kjhgfass@gmail.com', `SMAPP - Backup - ${date}`, result);
    if (err) {
        logger.error(err);
    }
});

app.set('superSecret', con.configParams.secret);
app.set('port', (process.env.PORT || 8081));


var whitelist = ['http://localhost:8100', 'http://localhost']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    allowedHeaders: ['Content-Type', 'Accept', 'x-access-token', 'X-Requested-With']
}));

app.use(cors());

//Unprotected routes
app.use("/static", express.static(__dirname + '/static'));
app.get('/', function (req, res) {
    const indexPath = path.join(__dirname, 'static', 'index.html');
    fs.readFile(indexPath, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            res.sendFile(indexPath);
        }
    });
});

/*
app.use(function (req, res, next) {

    if (req.method === 'OPTIONS') {
        const headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-access-token";
        res.writeHead(200, headers);
        res.end();
    }else{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, con.configParams.secret, function (err, decoded) {
            if (err) {
                return res.json({Success: false, Message: "Ne valja token."});
            } else {
                req.decoded = decoded;
                next();
            }

        })
    } else {
        return res.status(403).send({
            Success: false,
            Message: 'Nema tokena.'
        });
    }
    }
});
*/


//PROTECTED ROUTES
require('./routes')(router, connection, mysql, logger);
app.use(router);

app.listen(app.get('port'), function () {
    logger.info('CZOO - Node app is running on port', app.get('port'), ' | MODE: ', env);
});
