const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { usernameExists, 
        userExistsById } = require('../helpers/db-validators'); // validaciones

const { validateJWT } = require('../helpers/jwt-helpers');

const { getUsers,
        getUserById,
        patchUser,
        postUser } = require('../controllers/users-controller'); //controladores

const router = Router();

router.get('/', [ 
    validateJWT
], getUsers);

router.get('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isUUID(),
    check('id').custom( userExistsById ),
], getUserById);

router.post('/', [
    check('first_name', 'El nombre es obligatorio').not().isEmpty(),
    check('last_name', 'El apellido es obligatorio').not().isEmpty(),
    check('username', 'El username es obligatorio').not().isEmpty().trim(' '),
    check('username', 'El username solo puede contener letras y números').isAlphanumeric(),
    check('username').custom( usernameExists ),
    check('passwd', 'La contraseña tiene que tener mas de 6 caracteres').not().isEmpty().isLength({ min: 6}), 
    validateFields
], postUser);

router.patch('/:id',[
    validateJWT,
    check('id', 'No es un ID valido').isUUID(),
    check('id').custom( userExistsById ),
    validateFields
], patchUser);




module.exports = router;