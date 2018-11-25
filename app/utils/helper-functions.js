const gcm = require('node-gcm');
const mysql = require("mysql");
const con = require('../config/db_conf.js');
const connection = con.connection();

const messageOptions = {
    // collapseKey: 'SMApp aktivnosti',
    delayWhileIdle: true, //delay sending while receiving device is offline
}

function posaljiPush(titleMsg, bodyMsg, senderId, res, logger, id = 0) {

    const device_tokens = []; //create array for storing device tokens
    const retry_times = 4; //the number of times to retry sending the message if it fails
    const sender = new gcm.Sender(con.getGcmKey()); //create a new sender

    const m = Object.assign({
        "data": {
            "title": titleMsg,
            "body": bodyMsg,
            "notId": id,
            "surveyID": "ewtawgreg-gragrag-rgarhthgbad",
            "priority": "high",
            "sound":"default",
            "click_action": id,
            "color":"#3F3250"
        }
    }, messageOptions);

    const message = new gcm.Message(m); //create a new message
   

    logger.info("Sending push");

    // get users from db
    let query = "SELECT * FROM ?? WHERE NOT idkorisnici=" + senderId;
    const table = ["korisnici"];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            //res.json({ "Error": true, "Message": "Error executing MySQL query" });
            logger.error({ Message: err });
        } else {
            //res.json({ "Error": false, "Message": "Success", "Artikli": rows });
            if (rows[0].pushNotif) {
                device_tokens[0] = rows[0].reg_id;
                sender.send(message, device_tokens[0], retry_times, function (result) {
                    logger.info({ Message: 'Push sent to: ' + device_tokens[0] });
                }, function (err) {
                    logger.error({ Message: err });

                });
            }

        }
    });

    //Take the registration id(lengthy string) that you logged
    //in your ionic v2 app and update device_tokens[0] with it for testing.
    //Later save device tokens to db and
    //get back all tokens and push to multiple devices
    //device_tokens[0] = "dVL21thex9o:APA91bHLfdit_-NSg_v1rpNyN3RqJU1J0EKDXj8GD5QfboJmIWXpF4pdSR95K0JQIqKII5FUp-sqMmQQdz5batCmvN-YqThmRbxRG4hjbjjbRgx4K662D1TdxibcYUztPo2whiNL-fhk";
}

function posaljiTestPush(id, res, logger) {

    const device_tokens = []; //create array for storing device tokens
    const retry_times = 4; //the number of times to retry sending the message if it fails
    const sender = new gcm.Sender(con.getGcmKey()); //create a new sender

    const m = Object.assign({
        "data": {
            "title": "SMAPP Test Notification",
            "body": "Radiiii ! :)",
            "notId": 1,
            "surveyID": "ewtawgreg-gragrag-rgarhthgbad",
            "priority": "high"
        }
    }, messageOptions);

    const message = new gcm.Message(m); //create a new message
    // message.addData('title', 'SMApp notification');
    // message.addData('message', 'It works :)');
    // message.addData('sound', 'default');
    // message.addData('color', '#3F3250');
    // message.addData('forceStart', '1');
    // message.addData('priority', 'high');

    //server if the device is offline

    logger.info("Sending test push");
    // get users from db
    let query = "SELECT * FROM ?? WHERE idkorisnici=" + id;
    const table = ["korisnici"];
    query = mysql.format(query, table);
    connection.query(query, function (err, rows) {
        if (err) {
            logger.error("ERROR - Select korisnici", err);
            res.status(400).send({ Message: err });
        } else {
            //res.json({ "Error": false, "Message": "Success", "Artikli": rows });
            if (rows[0].pushNotif) {
                device_tokens[0] = rows[0].reg_id;
                sender.send(message, device_tokens[0], retry_times, function (result) {
                    res.status(200).send({ Message: 'Push sent to: ' + device_tokens[0] });
                }, function (err) {
                    logger.error(err);
                    res.status(400).send({ Message: err });
                });
            }

        }
    });

    //Take the registration id(lengthy string) that you logged
    //in your ionic v2 app and update device_tokens[0] with it for testing.
    //Later save device tokens to db and
    //get back all tokens and push to multiple devices
    //device_tokens[0] = "dVL21thex9o:APA91bHLfdit_-NSg_v1rpNyN3RqJU1J0EKDXj8GD5QfboJmIWXpF4pdSR95K0JQIqKII5FUp-sqMmQQdz5batCmvN-YqThmRbxRG4hjbjjbRgx4K662D1TdxibcYUztPo2whiNL-fhk";
}

function posaljiMail(mailTo, subject, text) {

    var helper = require('sendgrid').mail;
    const email = new helper.Mail();
    var fromEmail = new helper.Email('no-reply@smapp.com');
    var toEmail = new helper.Email(mailTo);
    var subject = subject;
    var content = new helper.Content('text/plain', text);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var sg = require('sendgrid')(con.sgkey());
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });

}

module.exports = {
    posaljiPush: posaljiPush,
    posaljiTestPush: posaljiTestPush,
    posaljiMail: posaljiMail
};