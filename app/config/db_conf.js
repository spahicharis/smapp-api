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
        connectionLimit:10,
        host: '029fa374-392e-4920-8be6-a53900bb8926.mysql.sequelizer.com',
        user: 'dslrrwsgdasruayq',
        password: 'zsTwMD6mHH64s3zojLJDrLhUQLU6rNGSFnDWKNCMWngh7X5nHDFkzBvWk7PaS843',
        database: 'db029fa374392e49208be6a53900bb8926',
        multipleStatements: true,
        queueLimit: 30,
        acquireTimeout: 1000000
    });
};

exports.configParams = {
        host: '029fa374-392e-4920-8be6-a53900bb8926.mysql.sequelizer.com',
        username: 'dslrrwsgdasruayq',
        password: 'zsTwMD6mHH64s3zojLJDrLhUQLU6rNGSFnDWKNCMWngh7X5nHDFkzBvWk7PaS843',
        database: 'db029fa374392e49208be6a53900bb8926',
        secret: 'buljakasa',
        queueLimit: 30,
        acquireTimeout: 1000000
};

exports.sgkey = function() {
    return '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';
}
