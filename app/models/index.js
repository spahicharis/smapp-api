"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");

const config = require('../config/db_conf.js');

// const CONNSTR = 'postgres://oxgdbcckgarzad:4NGG2eiFCiANXtPRqimrtdkqOc@ec2-54-243-201-107.compute-1.amazonaws.com:5432/d1aldiv6s6g0p1'
//const CONNSTR = config.configParams.connectionString;
//const sequelize = new Sequelize(CONNSTR);

const sequelize = new Sequelize(config.configParams.database,config.configParams.username,config.configParams.password, {
    host: config.configParams.host,
    dialect: 'mysql'
});

const db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        console.log('import model: ' + file)
        const model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
