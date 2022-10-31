const path          = require('path');
const fs            = require('fs');
const Promise       = require("bluebird");
const fsPromise     = Promise.promisifyAll(fs);
const _             = require('lodash');

class Repository {
  constructor(db) {
    this._db = db; 
  }

  async registerRepositories() {
    const repositoriesPath    = path.join(__dirname, '/');
    try {
      var repositories      = [];
      let excludeFiles      = ["repository","repositoryBase"];
      let repositoriesFiles = await fsPromise.readdirSync(repositoriesPath); 
      repositoriesFiles.forEach(file => {
        let fileName      = path.basename(file, '.js');
        if( path.extname(file).toLowerCase() === '.js' && !_.includes(excludeFiles, fileName)) {
          let repositoryName = path.basename(file, '.js').replace("Repository", "");
          repositories.push(repositoryName);
        }
      });		
      if( repositories.length ) {
        repositories.forEach( (repository => {
          const repositoryName  = repository+"Repository";
          const repositoryClass = require("./"+repositoryName);
            this[repository]      = new repositoryClass(this._db);
        }).bind(this));
      }
    } catch(error) {
      console.log(error);
    }
    }
}

module.exports = Repository;
