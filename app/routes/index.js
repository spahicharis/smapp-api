const artikli = require('./artikli.route');
const korisnici = require('./korisnici.route');
const paketi = require('./paketi.route');
const reklame = require('./reklame.route');
// const osobe = require('./osobe.route');
const auth = require('./auth.route');
const push = require('./push.route');
const statistika = require('./statistika.route');
const debts = require('./debts.route');


module.exports = function(router, connection, mysql, logger) {
    auth(router, connection, mysql, logger);
    artikli(router, connection, mysql, logger);
    korisnici(router, connection, mysql, logger);
    // osobe(router, connection, mysql, logger);
    paketi(router, connection, mysql, logger);
    reklame(router, connection, mysql, logger);
    push(router, connection, mysql, logger);
    statistika(router, connection, mysql, logger);
    debts(router, connection, mysql, logger);

};
