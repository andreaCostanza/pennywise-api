const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { usernameExists } = require('../helpers/db-validators');


const getUsers = async (req , res ) => {
    
    try {
        const users = await User.findAll();
        if ( users.length ) {
            res.json({
                msg: 'get users API - controller',
                users
            });
        } else {
            res.status( 404 ).json({
                msg: 'No users found'
            })
        }
        
    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        })
    }

}

const getUserById = async (req , res ) => {

    const { id } = req.params;
    
    try {
        const user = await User.findByPk( id );
        if ( user ) {
            res.json({
                msg: 'get user by id',
                user
            });
        } else {
            res.status( 404 ).json({
                msg: 'No user found'
            })
        }
        
    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        })
    }

}


// Crea usuario
const postUser = async (req, res) => {
    
    const data = req.body;
    
    try {
        const user = new User( data );

        const salt = bcrypt.genSaltSync(); //Hash contraseña
        user.passwd = bcrypt.hashSync( data.passwd, salt);


        await user.save();

        res.json({
            msg: 'post API - usuario creado',
            user
        });

    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        })
    }

}

    

const patchUser = async (req, res) => {
    
    const { id } = req.params;
    const { body } = req;
    
    try {
        const user = await User.findByPk( id );
        
        if ( body.passwd ) { // Hash contraseña
            
            if ( body.passwd.length < 6 ) {
                throw new Error('Password must be longer than 6 characters', { cause: { code: 'badReq' } });
            }
            const salt = bcrypt.genSaltSync();
            body.passwd = bcrypt.hashSync( body.passwd, salt);
        }

        if ( body.username ) {
            
            body.username.trim(' ');

            if (  ! /^[a-z0-9]+$/.test( body.username ) ) {
                
                throw new Error('Username must contain only letters or numbers', { cause: { code: 'badReq' } });
            }
            await usernameExists( body.username );
        }

        await user.update( body );

        res.json({
            msg: 'put API - usuario actualizado',
            user
        });

    } catch ( error ) {
        if ( error.cause.code == 'badReq' ) {
            res.status( 400 ).json({
                error: error.message
            })
        } else {
           res.status( 500 ).json({
                msg: 'Something went wrong',
                error
            }) 
        }
        
    }


}



module.exports = {
    getUsers,
    getUserById,
    postUser,
    patchUser
}