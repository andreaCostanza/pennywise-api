const express = require('express');
const cors = require('cors');

const db = require('./database/connection');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.NODE_DOCKER_PORT || process.env.PORT;
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';
        this.monthsPath = '/api/months';
        this.categoriesPath = '/api/categories';
        this.registriesPath = '/api/registries';
        
        // Conectar a base de datos
        this.dbConnection();

        // Middlewares
        this.middlewares();
        
        // Rutas de la aplicacion
        this.routes();
    };

    async dbConnection() {
        
        try {
            await db.authenticate();
            console.log('Conexión con la BBDD establecida');
        } catch (error) {
            throw new Error( 'No se ha podido establecer la conexión con la BBDD\n', error );
        }
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // directorio publico
        this.app.use( express.static('public') );
    };

    routes() {

        this.app.use(this.usersPath, require('./routes/users-routes'));
        this.app.use(this.authPath, require('./routes/auth-routes'));
        this.app.use(this.monthsPath, require( './routes/months-routes'));
        this.app.use(this.categoriesPath, require( './routes/categories-routes'));
        this.app.use(this.registriesPath, require('./routes/registries-routes'));
    };

    listen() {

        this.app.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto:', this.port );
        });
    };


};

module.exports = Server;