'use strict';
module.exports = function(sequelize, DataTypes) {

const Paket = sequelize.define('Paket', {
    idkupovina: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    datumkupovine: {
        type: DataTypes.DATE
    },
    tip: {
        type: DataTypes.STRING
    },
    kolicina: {
        type:  DataTypes.INTEGER
    },
    cijena: {
        type: DataTypes.DOUBLE
    },
    status: {
        type: DataTypes.STRING
    },
    track_num: {
        type: DataTypes.STRING
    },
    datumstizanja: {
        type: DataTypes.DATE
    }
},
{
    timestamps: false,
    freezeTableName: true,
    tableName: 'kupovina'
});
return Paket;
};

