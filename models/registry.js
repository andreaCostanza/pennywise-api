const { DataTypes } = require('sequelize');

const db = require('../database/connection');


const Registry = db.define('registry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    concept: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    
}, {
    timestamps: false
});


module.exports = Registry;