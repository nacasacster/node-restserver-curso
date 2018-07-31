//===================
//   PUERTO
//==================
process.env.PORT = process.env.PORT || 3000;

//===================
//   Entorno
//==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
//   Base de datos
//==================

let ulrDB

if (process.env.NODE_ENV === 'dev') {
    ulrDB = 'mongodb://localhost:27017/cafe';
} else {
    ulrDB = 'mongodb://cafe_database:OtraCont1023@ds133621.mlab.com:33621/cafe_database'
}

process.env.ulrDB = ulrDB;