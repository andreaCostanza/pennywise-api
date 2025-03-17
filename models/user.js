const { DataTypes } = require('sequelize');

const db = require('../database/connection');

const Month = require('./month')

const User = db.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwd: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

User.hasMany(Month, {
    foreignKey: {
        name: 'user_id',
        type: DataTypes.UUID
    }
});

Month.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        type: DataTypes.UUID
    }
});

module.exports = User;