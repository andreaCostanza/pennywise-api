const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth-controller');

const { validateFields } = require('../middlewares/validate-fields');


const router = Router();

router.post('/', [
    check( 'username', 'El username es obligatorio' ).trim().notEmpty(),
    check( 'passwd', 'La contraseña es obligatoria' ).notEmpty(),
    validateFields
], login);


module.exports = router;