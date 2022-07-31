const validarCampos = require('../middlewares/validar-campos');
const validarRoles = require('../middlewares/validar-roles');
const validarJWT = require('../middlewares/validar-jwt');
const validarArchivoSubir = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarRoles,
    ...validarJWT,
    ...validarArchivoSubir
}