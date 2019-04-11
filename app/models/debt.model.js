'use strict';
module.exports = function (sequelize, DataTypes) {

    return sequelize.define('Debt', {
        debtId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'debt_id'
        },
        debtor: {
            type: DataTypes.STRING // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        creditor: {
            type: DataTypes.STRING
        },
        dateCreated: {
            type: DataTypes.DATE,
            field: 'date_created'
        },
        note: {
            type: DataTypes.STRING
        },
        debt: {
            type: DataTypes.DOUBLE
        },
    },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'debts'
        });
};

