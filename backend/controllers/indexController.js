const halson = require('halson');
const ControllerBase = require('./controllerBase');

class IndexController extends ControllerBase {
  async index() {
  
    const resource = halson({ 

      api: '/api/v1',
      docs : '/api/docs'
    });
    super.ok(resource) ;

  }
}

module.exports = IndexController;
