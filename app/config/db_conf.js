const express = require('express');
const fs = require('fs');
const mysql = require("mysql");

exports = module.exports = {};

exports.getGcmKey = function () {
    const gcmApiKey = 'AAAA9JcBDuw:APA91bHKLzd-r2EL8UFmj5shytLLh98Rur2mKBn6_e1fLnOeIW5EiMa-0cikXPnv5Vpd7zjCc_5b0bkQJfw8cnRS3AKReFvYcqAsmeFULXEewuNnseYVuvEz7yGM6BPOzP9ucC9MPThpt_UyjHnUFm2hHl0NoHIJgA'; // GCM API KEY OF YOUR GOOGLE CONSOLE PROJECT
    return gcmApiKey;
};
exports.connection = function () {
    return mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'autokemo_smappuser',
        password: '1Spahaa.',
        database: 'autokemo_smapp',
        multipleStatements: true,
        queueLimit: 30,
        acquireTimeout: 1000000
    });
};

exports.configParams = {
    host: 'localhost',
    username: 'autokemo_smappuser',
    password: '1Spahaa.',
    database: 'autokemo_smapp',
    secret: 'buljakasa',
    queueLimit: 30,
    acquireTimeout: 1000000
};

exports.sgkey = function () {
    return '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';
}
