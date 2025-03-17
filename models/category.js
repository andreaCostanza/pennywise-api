const { DataTypes } = require('sequelize');

const db = require('../database/connection');

const Registry = require('./registry');

const Category = db.define('category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
}, {
    timestamps: false
});

Category.hasMany(Registry, {
    foreignKey: {
        name: 'category_id',
        type: DataTypes.INTEGER
    }
});

Registry.belongsTo(Category, {
    foreignKey: {
        name: 'category_id',
        type: DataTypes.INTEGER
    }
});

module.exports = Category;