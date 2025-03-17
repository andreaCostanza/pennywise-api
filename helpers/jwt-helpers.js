const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user')


const generateJWT = ( id = '' ) => {
    
    return new Promise( (resolve,reject ) => {

        const payload = { id };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '7d' // FIXME: 7d expiration time only for dev purposes
        }, (err, token ) => {

            if ( err ) {
                console.log( err );
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            }
        })
    })
}

const validateJWT = async ( req, res = response, next ) => {

    const token = req.header( 'access-token' );

    if ( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid
        const user = await User.findByPk( id );

        req.user = user;

        next();

    } catch (error) {
        
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
        
    }
}


module.exports = {
    generateJWT,
    validateJWT
};