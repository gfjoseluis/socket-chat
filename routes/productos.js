const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeProductoById, existeCategoriaById } = require('../helpers/db-validators');

const { crearProducto,
        obtenerProducto,
        obtenerProductos,
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

const router = Router();

//obener todas las categorias - publico
router.get('/', obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos,
], obtenerProducto);

//crear una categoria por id - privado - cualquier persona con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto);

//actualizar - privado - cualquier con token valido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], actualizarProducto);

//borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], borrarProducto);

module.exports = router;