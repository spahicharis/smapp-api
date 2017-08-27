const moment = require("moment");

module.exports = function (router, connection, mysql, logger) {
    router.get("/osobe", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        let query = "SELECT * FROM ?? order by imeprezime asc";
        const table = ["osobe"];
        query = mysql.format(query, table);
        connection.query(query, function (err, rows) {
            if (err) {
                logger.error(err);
                res.json({ "Error": true, "Message": err });
            } else {
                res.json({ "Error": false, "Message": "Success", "Osobe": rows });
            }
            connection.release();
        });
    });
    router.post("/osobe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow

        res.setHeader('Access-Control-Allow-Methods', 'POST');
        let query = "INSERT INTO ?? (??,??,??) VALUES " +
            "(?,?,?)";
        const table = ["osobe",
            "imeprezime",
            "status",
            "info",
            req.body.imeprezime,
            req.body.status,
            req.body.info,
        ];
        query = mysql.format(query, table);

        connection.getConnection(function(err,conn){
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                } else {
                    res.json({ "Error": false, "Message": "Osoba dodana !", "Result": rows });
                }
                conn.release();
            });
        });
    });
    router.get("/osobe/blacklist", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        let query = "SELECT * FROM ?? where status = 'black' order by imeprezime asc";
        const table = ["osobe"];
        query = mysql.format(query, table);

        connection.getConnection(function(err,conn){
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                } else {
                    res.json({ "Error": false, "Message": "Success", "Osobe": rows });
                }
                conn.release();
            });
        });
    });
    router.get("/osobe/informlist", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        let query = "SELECT * FROM ?? where status = 'inform' order by imeprezime asc ";
        const table = ["osobe"];
        query = mysql.format(query, table);
        connection.getConnection(function(err,conn){
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                } else {
                    res.json({ "Error": false, "Message": "Success", "Osobe": rows });
                }
                conn.release();
            });
        });
    });
    router.put("/osobe/:idosobe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        let query = "UPDATE ?? SET ?? = ?,?? = ?,?? = ? WHERE ?? = ?";
        const table = ["osobe",
            "imeprezime", req.body.imeprezime,
            "status", req.body.status,
            "info", req.body.info,
            "idosobe", req.params.idosobe
        ];
        query = mysql.format(query, table);

        connection.getConnection(function(err,conn){
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                } else {
                    res.json({ "Error": false, "Message": "Osoba uspješno ažurirana!" });
                }
                conn.release();
            });
        });
    });
    router.delete("/osobe/:idosobe", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
        let query = "delete from ??  WHERE ?? = ?";
        const table = ["osobe",
            "idosobe", req.params.idosobe
        ];
        query = mysql.format(query, table);

        connection.getConnection(function(err,conn){
            conn.query(query, function (err, rows) {
                if (err) {
                    logger.error(err);
                    res.json({ "Error": true, "Message": err });
                } else {
                    res.json({ "Error": false, "Message": "Osoba uspješno obrisana!" });
                }
                conn.release();
            });
        });
    });
};

