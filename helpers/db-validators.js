const { getDaysInMonth } = require('date-fns');

const User = require('../models/user');
const Category = require('../models/category');
const Month = require('../models/month');


const usernameExists = async ( username ) => {
    const findUsername = await User.findOne({ where: { username } });
    if ( findUsername ) {
         throw new Error(`El username ${ username } ya esta registrado`, { cause: { code: 'badReq' } });
    };
};

const userExistsById = async ( id ) => {
    const userExists = await User.findByPk( id );
    if ( !userExists ) {
         throw new Error(`El usuario con id ${id} no existe`);
    };
};

const categoryExistsById = async ( id ) => {
    const categoryExists = await Category.findByPk( id );
    if ( !categoryExists ) {
         throw new Error(`The category id is not valid`);
    };
};

const monthExistsById = async ( id ) => {
    const monthExists = await Month.findByPk( id );
    if ( !monthExists ) {
         throw new Error(`The month doesn't exist or the id is not valid`);
    };
};

const isValidDay = async ( body ) => {
    const { day, month_id } = body;
    const { date } = await Month.findByPk( month_id );
    const daysInMonth = getDaysInMonth( date );

    if ( day < 1 || day > daysInMonth ) {
        throw new Error('Day is not a valid day for this month');
    };
};

module.exports = {
    usernameExists,
    userExistsById,
    categoryExistsById,
    monthExistsById,
    isValidDay
}