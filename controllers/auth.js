const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const renovarToken = async(req, res = response) => {
    const {usuario} = req;
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    });
}

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - correo'
            });
        }
        //si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - estado:false'
            });
        }
        //verificar la contraseña
        const validPasword = bcryptjs.compareSync(password, usuario.password);
        if (!validPasword) {
            return res.status(400).json({
                msg: 'Usuario/password no son correctos - password'
            });
        }
        //generar el jwt
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'hable con el admin'
        })
    }
}

const googleSignin = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const {correo, nombre, img}= await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            //crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'todo ok! google signin',
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'El token de Google no es valido'
        });
    }
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}