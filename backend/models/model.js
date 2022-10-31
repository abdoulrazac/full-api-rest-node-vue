const halson = require('halson');

class Model {
  constructor(data) {
	this.setData     = this.setData.bind(this);
	this.setData(data);
  }
  
  setData(data) {
	  if( data !== undefined ) {
		  for( const [key, value] of Object.entries(data)) {
			   this[key]  = value;
		 }
	  }    
  }

  getData(){
    return this;
  }

  getResource(data) {
    return halson(data);
  }
}

module.exports = Model;