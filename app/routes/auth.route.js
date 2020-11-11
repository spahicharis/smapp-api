const models = require('../models');
const jwt = require('jsonwebtoken');
const con = require('../config/db_conf.js');

module.exports = function (router, connection, mysql, logger) {
    router.post("/api/auth", function (req, res) {
        models.Korisnik.findOne({where: {ime: req.body.ime}})
            .then(function (korisnik) {
                korisnik = korisnik.dataValues;
                console.log("kroisnik", korisnik);

                if (!korisnik) {
                    return res.json({Success: false, Message: "Greška kod autentifikacije. Korisnik nije pronađen!"});
                } else if (korisnik) {

                    if (korisnik.sifra !== req.body.sifra) {
                        return res.json({Success: false, Message: "Greška kod autentifikacije. Pogrešna šifra!"})
                    } else {
                        const token = jwt.sign(korisnik, con.configParams.secret, {
                            expiresIn: 1440
                        });
                        const users = [];
                        users.push(korisnik);
                        return res.json({Success: true, Message: "Uživaj u tokenu", Token: token, Users: users});
                    }
                }
            })
            .catch(function (error) {
                res.json({Success: false, Message: error});
            });
    });
};
