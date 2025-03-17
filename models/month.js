const { DataTypes } = require('sequelize');

const db = require('../database/connection');
const Registry = require('./registry')

const Month = db.define('month', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    budget: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

Month.hasMany(Registry, {
    foreignKey: {
        name: 'month_id',
        type: DataTypes.UUID
    }
});

Registry.belongsTo(Month, {
    foreignKey: {
        name: 'month_id',
        type: DataTypes.UUID
    }
});




module.exports = Month;