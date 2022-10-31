const Model = require('./model');

class UserModel extends Model {
  constructor(data) {

    // Préciser le nom de la table et la clé primaire
    super(data);
  }
 
  async getResource(uriGenerator) {
    const resource = super.getResource({
      id: this.id,
      full_name : this.full_name,
      username: this.username,
      email: this.email, 
      password: this.password,
      role: this.role,
      full_name : this.full_name,
      username : this.username,
      cnib_passport : this.cnib_passport,
      lieu_cnib : this.lieu_cnib,
      date_naissance : this.date_naissance,
      telephone : this.telephone,
      avatar : this.avatar,
      description : this.description,
      permis_type : this.permis_type,
      permis_date : this.permis_date,
      contrat_debut : this.contrat_debut,
      contrat_fin : this.contrat_fin,
      is_use : this.is_use,
      is_active : this.is_active,
      is_superuser : this.is_superuser    
    });

    await this.addLinks(resource, uriGenerator);
    return resource;
  }

  async addLinks(resource, uriGenerator) {
    
    const getURI = await uriGenerator.getURI(
      'UsersController_get',
      { id: this.id },
    );
    if (getURI) {
      resource.addLink(getURI.id, getURI);
    }
    const updateURI = await uriGenerator.getURI(
      'UsersController_update',
      { id: this.id },
    );
    if (updateURI) {
      resource.addLink(updateURI.id, updateURI);
    }
    const deleteURI = await uriGenerator.getURI(
      'UsersController_delete',
      { id: this.id },
    );
    if (deleteURI) {
      resource.addLink(deleteURI.id, deleteURI);
    }
  }
}

module.exports = UserModel;
