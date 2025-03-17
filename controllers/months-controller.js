const { response, request } = require('express');

const { startOfMonth, format } = require('date-fns');

const Month = require('../models/month');
const User = require('../models/user');


const postMonth = async ( req, res ) => {
    
    const user = req.user;
    let data = req.body;

    data.date = startOfMonth( data.date );
    data.date = format(data.date, 'yyyy-MM-dd');

    try {
        const monthExists = await Month.findOne({ where: { date: data.date, user_id: user.id } });
        if ( monthExists ) {
            res.status( 400 ).json({
                msg: 'There is already an entry for this month'
            });
        } else {
            const month = await Month.create( {
                user_id: user.id,
                ...data
            })

            res.json({
                msg: 'post month',
                "user": {
                    id: user.id,
                    username: user.username
                },
                month

            });
        }
        
    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        });
    }
}

const getMonths = async ( req, res ) => {
    const user = req.user
    try {
        const months = await Month.findAll({
                                            include: {
                                                model: User,
                                                attributes: ['username', 'first_name', 'last_name'],
                                                where: { id: user.id },
                                                required: true
                                            },
                                            order: [ [ 'date', 'DESC'] ]
                                        });
        res.json({
            msg: `Months for user ${user.username}`,
            months
        })

    } catch ( error ) {
        console.log( error )
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        });
    }
}

const patchMonth = async ( req, res ) => {

    const { id } = req.params;
    const { body } = req;
   
    try {
        
        const month = await Month.findByPk( id );
        if ( !month ) {
            throw new Error(`Can't find month with id ${id}`, { cause: { code: 'badReq' } });
        }
                
        if ( body.date ) { 
            body.date = startOfMonth( body.date );
            body.date = format(body.date, 'yyyy-MM-dd');

            const newMonthExists = await Month.findOne({ where: { date: body.date } });
            if ( newMonthExists ) {
                throw new Error('There is already an entry for this month', { cause: { code: 'badReq' } }); 
            }
        }

        await month.update( body );

        res.json({
            msg: 'put API - usuario actualizado',
            month
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

const deleteMonth = async ( req, res ) => {
    
    const { id } = req.params;
       
    try {
        
        const month = await Month.findByPk( id );
        if ( !month ) {
            throw new Error(`Month with id ${id} doesn't exist`, { cause: { code: 'badReq' } });
        }

        await month.destroy();

        res.json({
            msg: 'month deleted'
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
    postMonth,
    getMonths,
    patchMonth,
    deleteMonth
}

