const { response } = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user')

const {
    generateJWT,
} = require('../helpers/jwt-helpers');
const { where } = require("sequelize");


const login = async (req, res = response ) => {

    const { username, passwd } = req.body;
    
    try {

        const user = await User.findOne( {where: {username} } );
        //console.log( user );

        if ( !user ) {
            return res.status(400).json({
                msg: 'El username es incorrecto o no existe'
            });
        };


        // Verificar contraseña
        const validPass = bcrypt.compareSync( passwd, user.passwd );
        if( !validPass ) {
            return res.status(400).json({
                msg: 'La password no es correcta'
            });
        }

        //generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            'access_token': token
        })

        
    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salió mal'
        });
    }

    
};

module.exports = {
    login
}