const UsersController = require('../../controllers/usersController');
const RoutesBase = require('./routesBuilderBase');

class UsersRoutesBuilder extends RoutesBase {
  constructor() {
    super(UsersController);
  }

  getRoutes() {
    this.buildRoute('/me',                'get',    'getMe');  
    this.buildRoute('/me',                'put',    'updateMe');

    this.buildRoute('/users',             'get',    'list');    
	  this.buildRoute('/users/',            'post',   'create');
    this.buildRoute('/users/:id',         'get',    'get');
    this.buildRoute('/users/:id',         'delete', 'delete');
    this.buildRoute('/users/:id',         'put',    'update');

    return this.routes;
  }
}

module.exports = UsersRoutesBuilder;