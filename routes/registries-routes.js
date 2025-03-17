const { Router } = require('express');
const { check, body, query } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { validateJWT } = require('../helpers/jwt-helpers');

const { categoryExistsById, monthExistsById, isValidDay } = require('../helpers/db-validators');

const { getRegistriesForMonth, postRegistries, deleteRegistries, patchRegistry } = require('../controllers/registries-controller');
    
const router = Router();

router.get('/', [ 
    validateJWT,
    query('month', 'Month is necessary and should be a number').isNumeric(),
    query('year', 'Year is necessary and should be a number').isNumeric(),
    validateFields
], getRegistriesForMonth);

router.post('/', [
    validateJWT,
    check('quantity', 'Quantity is necessary and must be a number').isNumeric(),
    check('concept', 'You need to insert a concept for this registry. Allowed characters: A-Z, a-z, 0-9 spaces and -').isAlphanumeric( [ 'en-US' ] , {ignore: ' -'} ),
    check('category_id').custom( categoryExistsById ),
    check('month_id').custom( monthExistsById ),
    body().custom( isValidDay ),
    validateFields
], postRegistries);

router.patch('/:id', [
    validateJWT
], patchRegistry);

router.delete('/:id', [
    validateFields
], deleteRegistries);



module.exports = router;