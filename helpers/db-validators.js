const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`el rol ${rol} no esta registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);
    }
}

const existeUsuarioById = async (id) => {
    //verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

const existeCategoriaById = async (id) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

const existeProductoById = async (id) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El ID no existe: ${id}`);
    }
}

/**
 * validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioById,
    existeCategoriaById,
    existeProductoById,
    coleccionesPermitidas
}