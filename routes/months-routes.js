const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { validateJWT } = require('../helpers/jwt-helpers');


const { postMonth, getMonths, patchMonth, deleteMonth } = require('../controllers/months-controller'); //controladores

const router = Router();

router.post('/', [
    validateJWT,
    check('date', 'Date is necessary and must follow YYYY-MM-DD format').isDate(),
    check('budget', 'Budget is necessary and must be a whole number').isInt(),
    validateFields
], postMonth);

router.get('/', [
    validateJWT
], getMonths);

router.patch('/:id', [
    validateJWT
], patchMonth);

router.delete('/:id',[
    validateJWT
], deleteMonth);



module.exports = router;