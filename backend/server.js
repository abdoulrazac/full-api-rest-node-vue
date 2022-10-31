const _         = require('lodash');
const path      = require('path');
const fs        = require('fs');
const Promise   = require("bluebird");
const fsPromise = Promise.promisifyAll(fs);
const config    = require('config');
const App       = require('./app');
const Router    = require('./routing/router');
const Repository = require('./repositories/repository');
const apiDocumentation = require('./docs/swagger.json');
const db = require('./mock/db');
const Security = require('./security/security');

class Server {
  constructor() {
    this.repository  = new Repository(db);
    this.security    = new Security(this.repository, config.get('api.security.jwtSecret')) ;
    this.router      = {};
    this._initRouter = this._initRouter.bind(this); 
  }

  async _initRouter(){
    const routesBuildersPath    = path.join(__dirname, '/routing/routesBuilders/');
    try {
      var routesBuilders      = [];
      var excludes            = ["routesBuilderBase"];
      let routesBuildersFiles = await fsPromise.readdirSync(routesBuildersPath); 
      routesBuildersFiles.forEach(file => {
        let jsFileName = path.basename(file, '.js');
        if( path.extname(file).toLowerCase() === '.js' && !_.includes(excludes, jsFileName)) {				
          const builderClass = require(routesBuildersPath+jsFileName);
          const builderObject= new builderClass(); 
          routesBuilders.push(builderObject);
        }
      });

      this.router	= new Router(routesBuilders, this.router);
      

    } catch(error) {
      this.router	= new Router([]);
    }
  }

  /**
   * Initialiser les routes, créer une instance de APP
   * et demarrer  APP
   */
  async start() {
    await this._initRouter();
    this.app = new App(this.router, this.repository, this.security, apiDocumentation);	
    this.app.run();
  }
}

const server = new Server();
server.start();
