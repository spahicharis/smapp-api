'use strict';
module.exports = function(sequelize, DataTypes) {

const Korisnik = sequelize.define('Korisnik', {
    idkorisnici: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ime: {
        type: DataTypes.STRING // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    sifra: {
        type: DataTypes.STRING
    },
    imeprezime: {
        type:  DataTypes.STRING
    },
    reg_id: {
        type: DataTypes.STRING
    },
    pushNotif: {
        type: DataTypes.STRING
    },
    fbToken: {
        type: DataTypes.STRING
    }
},
{
    timestamps: false,
    freezeTableName: true,
    tableName: 'korisnici'
});
return Korisnik;
};

