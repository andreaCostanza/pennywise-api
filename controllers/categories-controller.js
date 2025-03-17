const { response, request } = require('express');

const Category = require('../models/category');


const getCategories = async ( req, res ) => {
    try {

        const categories = await Category.findAll()
        
        res.json({
            msg: 'Existing categories',
            categories                
        });
        
        
    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        });
    }
}

const postCategory = async ( req, res ) => {
    
    const data = req.body;
    console.log( data );

    try {

        const category = await Category.create({
            category_name: data.name
        })
        

        res.json({
            msg: 'category created',
            category                
        });
        
        
    } catch ( error ) {
        res.status( 500 ).json({
            msg: 'Something went wrong',
            error
        });
    }

}

const deleteCategory = async ( req, res ) => {

    const { id } = req.params;
    
    try {

        const category = await Category.findByPk( id );

        if ( !category ) {
            throw new Error(`Month with id ${id} doesn't exist`, { cause: { code: 'badReq' } });
        }

        await category.destroy();
        
        res.json({
            msg: 'Category deleted correctly'               
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
    getCategories,
    postCategory,
    deleteCategory
}