const { response, request } = require('express');
const { getDaysInMonth } = require('date-fns');
const Registry = require('../models/registry');
const Month = require('../models/month');
const User = require('../models/user');




const getRegistriesForMonth = async ( req, res ) => {
    const user = req.user
    const { month, year } = req.query

    try {
        const currentMonth = await Month.findOne({ 
                                            where: { date: `${year}-${month}-01` },
                                            include: {
                                                model: User,
                                                attributes: ['username', 'first_name', 'last_name'],
                                                where: { id: user.id },
                                                required: true
                                            }
                                        });

        const registries = await currentMonth.getRegistries({ order: [ 'day' ] });
        
        if ( !registries.length ) {
            throw new Error('There are no registries for this month', { cause: { code: 'notFound' } });
        }
        
        res.json({
            msg: `Registries for user ${user.username} for month ${ currentMonth.date }`,
            currentMonth,
            registries
        })

    } catch ( error ) {
        console.log( error )
        if ( error.cause && error.cause.code == 'notFound' ) {
            res.status( 404 ).json({
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

const postRegistries = async ( req, res ) => {
    const data = req.body;

    try {
        const registry = await Registry.create( data );

        res.json({
            msg: 'Registry created succesfully',
            registry
        })

    } catch {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        });
    }
}

const patchRegistry = async ( req, res ) => {
    const { id } = req.params;
    const { body } = req;
   
    try {
        
        const registry = await Registry.findByPk( id );
        if ( !registry ) {
            throw new Error(`Can't find registry with id ${id}`, { cause: { code: 'badReq' } });
        }

        const { date } = await registry.getMonth();
                
        if ( body.day && ( body.day < 1 || body.day > getDaysInMonth( date ) )) { 
            
            throw new Error('Day is not valid for this month', { cause: { code: 'badReq' } }); 
    
        }

        await registry.update( body );

        res.json({
            msg: 'registry updated',
            registry
        });

    } catch ( error ) {
        if ( error.cause && error.cause.code == 'badReq' ) {
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

const deleteRegistries = async ( req, res ) => {
    
    const { id } = req.params
          
    try {
        
        const registry = await Registry.findByPk( id );
        if ( !registry ) {
            throw new Error(`Registry with id ${id} doesn't exist`, { cause: { code: 'badReq' } });
        }

        await registry.destroy();

        res.json({
            msg: 'registry deleted'
        });

    } catch ( error ) {
        if ( error.cause && error.cause.code == 'badReq' ) {
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
    getRegistriesForMonth,
    postRegistries,
    deleteRegistries,
    patchRegistry
}