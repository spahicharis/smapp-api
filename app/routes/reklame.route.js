const moment = require("moment");

module.exports = function(router, connection, mysql, logger) {
    router.get("/reklame/", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        console.log(req.query);
        console.log(req.body);

        if (req.query.page && req.query.pageSize) {
            start_index = (req.query.page - 1) * req.query.pageSize;
            brojItema = req.query.pageSize;
        } else {
            start_index = 0;
            brojItema = -1;
        }

        let query = 'SELECT * FROM ?? order by pocetakReklame desc LIMIT ' + start_index + ',' + brojItema;
        const table = ["reklame"];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                } else {
                    res.json({"Error": false, "Message": "Success", "Result": rows});
                }
                conn.release();
            });
        });
    });
    router.post("/reklame/", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        res.setHeader('Access-Control-Allow-Methods', ['OPTIONS', 'POST']);
        let krajReklame = req.body.krajReklame;
        if (!req.body.krajReklame)
            krajReklame = req.body.pocetakReklame;
        let query = "INSERT INTO ?? (??,??,??,??,??,??) VALUES " +
            "(?,?,?,?,?,?)";
        const table = [
            "reklame",
            "vrstaReklame",
            "cijenaReklame",
            "pocetakReklame",
            "krajReklame",
            "vrijemeUnosa",
            "info",
            req.body.vrstaReklame,
            req.body.cijenaReklame,
            req.body.pocetakReklame,
            krajReklame,
            date,
            req.body.info
        ];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    res.json({"Error": true, "Message": "Error executing MySQL query " + err});
                } else {
                    res.json({"Error": false, "Message": "Reklama dodana !", "Result": rows});
                }
                conn.release();
            });
        });
    });
    router.get("/reklame/:idreklame", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        let query = "SELECT * FROM ?? WHERE ??=?";
        const table = ["reklame", "idreklame", req.params.idreklame];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                } else {
                    res.json({"Error": false, "Message": "Success", "Result": rows});
                }
                conn.release();
            });
        });
    });
    router.put("/reklame/:idreklame", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        const now = moment(new Date());
        const date = now.format("YYYY-MM-DD HH:mm:ss");
        let krajReklame = req.body.krajReklame;
        if (!req.body.krajReklame)
            krajReklame = null;
        let query = "UPDATE ?? SET ?? = ?,?? = ?,?? = ?,?? = ?,?? = ?,?? = ?" +
            " WHERE ?? = ?";
        const table = ["reklame",
            "vrstaReklame", req.body.vrstaReklame,
            "cijenaReklame", req.body.cijenaReklame,
            "pocetakReklame", req.body.pocetakReklame,
            "krajReklame", krajReklame,
            "vrijemeUnosa", date,
            "info", req.body.info,
            "idreklame", req.params.idreklame
        ];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                } else {
                    res.json({"Error": false, "Message": "Reklama uspješno ažurirana!"});
                }
                conn.release();
            });
        });
    });
    router.delete("/reklame/:idreklame", function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'DELETE');
        let query = "delete from ??  WHERE ?? = ?";
        const table = ["reklame",
            "idreklame", req.params.idreklame
        ];
        query = mysql.format(query, table);
        connection.getConnection(function (err, conn) {
            conn.query(query, function (err, rows) {
                if (err) {
                    res.json({"Error": true, "Message": "Error executing MySQL query"});
                } else {
                    res.json({"Error": false, "Message": "Reklama uspješno obrisana!"});
                }
                conn.release();
            });
        });
    });
};