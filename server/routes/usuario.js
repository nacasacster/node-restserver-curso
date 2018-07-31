const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0; //si no me especifica desde que numero empiesa entonces lo muestra desde la pagina cero 
    desde = Number(desde); // convertimos a numero 
    let limite = req.query.limite || 5 //si no me especifica el limite entonces dejo por defecto el 5
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //permite llamar toda la base de datos, lo que se encuentra dentro de las comillas sencillas especifica que campos deseo mostrar 
        .skip(desde) //trae lso registros desde el numero asignado en adelante teniendo en cuenta el limite que se le aigna en la siguiente linea 
        .limit(limite) //limita la cantidad de registros a cinco 
        .exec((err, usuarios) => { //exec permite ejecutar los comandos 
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {

                Usuario.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        Numero_de_Registros: conteo
                    });
                });
            }
        })
});
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //es diferente por que va encriptado con bcrypt
        role: body.role
    });
    // guardar usuario
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    });
});

//put es la actualizacion de un registro 
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }

    });
});
//put es la actualizacion de un registro 
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!usuarioBorrado) { // si el usuario no fue encontrado osea es === null entonces entra a este if 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        }

    });
});
// app.delete('/usuario/:id', function(req, res) {
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { //permite remover el registro que se encuentre en la base de datos con el id entregado
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         } else if (!usuarioBorrado) { // si el usuario no fue encontrado osea es === null entonces entra a este if 
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         } else {
//             res.json({
//                 ok: true,
//                 usuario: usuarioBorrado

//             });
//         }
//     });
// });

module.exports = app;