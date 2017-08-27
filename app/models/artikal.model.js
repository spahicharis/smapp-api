'use strict';
module.exports = function (sequelize, DataTypes) {

    const Artikal = sequelize.define('Artikal', {
            idprodaja: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            imeprezime: {
                type: DataTypes.STRING // Will result in an attribute that is firstName when user facing but first_name in the database
            },
            datum: {
                type: DataTypes.DATE
            },
            tip: {
                type: DataTypes.STRING
            },
            kolicina: {
                type: DataTypes.INTEGER
            },
            cijena: {
                type: DataTypes.DOUBLE
            },
            status: {
                type: DataTypes.STRING
            },
            nacinpotraznje: {
                type: DataTypes.STRING
            },
            nacinslanja: {
                type: DataTypes.STRING
            },
            prodavac: {
                type: DataTypes.STRING
            },
            info: {
                type: DataTypes.STRING
            },
            track_num: {
                type: DataTypes.STRING
            },
            datumizmjene: {
                type: DataTypes.DATE
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'prodaja'
        });
    return Artikal;
};

