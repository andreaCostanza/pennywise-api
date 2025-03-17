const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { getCategories, postCategory, deleteCategory } = require('../controllers/categories-controller');

const { validateJWT } = require('../helpers/jwt-helpers');

const router = Router();

router.get('/', [
    validateJWT
], getCategories);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio y no puede contener números').trim().isAlpha(),
    validateFields
], postCategory);

router.delete('/:id', [
    validateJWT
], deleteCategory);


module.exports = router;