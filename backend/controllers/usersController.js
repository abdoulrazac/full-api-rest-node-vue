const _ = require("lodash");
const asyncLib = require("async");
const userService = require("./../services/userService");
const ControllerBase = require("./controllerBase");
const { isEmail } = require("./../services/userService");

class UsersController extends ControllerBase {

  async checkPostData(postData){
	if (_.isNull(postData.full_name) || _.isUndefined(postData.full_name)) {
        return {status: 400, error: "Veuillez fournir un nom valide", };
      }
      if (_.isNull(postData.email) || _.isUndefined(postData.email) || !isEmail(postData.email) ) {
        return {status: 400, error: "Veuillez fournir une adresse email valide"};
      }
      if ( _.isNull(postData.username) || _.isUndefined(postData.username) || !userService.isUsername(postData.username) ) {
        return {status: 400, error: "Veuillez fournir un nom d'utilisateur invalide", };
      }
      if ( _.isNull(postData.cnib_passport) || _.isUndefined(postData.cnib_passport) ) {
        return {status: 400, error: "Veuillez fournir une référence CNIB/Passport invalide", };
      }
      if (_.isNull(postData.lieu_cnib) || _.isUndefined(postData.lieu_cnib)) {
        return {status: 400, error: "Veuillez fournir un nom de ville valide"};
      }
      if (_.isNull(postData.telephone) || _.isUndefined(postData.telephone)) { 
        return { status: 400, error: "Veuillez fournir un numéro de téléphne valide" };
      }
      if ( _.isNull(postData.permis_type) || _.isUndefined(postData.permis_type)) {
        return {status: 400, error: "Veuillez fournir un type de permis de conduire valide"};
      }
      if ( _.isNull(postData.role) || _.isUndefined(postData.role) || !["Guest", "BasicUser", "AdminUser"].includes(postData.role) ) {
        return {status: 400, error: "Veuillez fournir un role valide ('Guest', 'BasicUser', 'AdminUser')"};
      }
      if ( _.isNull(postData.password) || _.isUndefined(postData.password) || !userService.isValidPassword(postData.password) ) {
        return { status: 400, error: "Veuillez fournir un mot de passe valide (au moins 8 caractères, une lette majuscule, un chiffre)" };
      }
	  return {}
  }

  async create() {
    try {
      const postData = this.body;
	  let postDataChecked = await this.checkPostData(postData)
	  if(postDataChecked.length > 0){
		return this.error(postDataChecked)
	  }

      var dataClean = await this.repository.user.getValidValues(postData);

      dataClean.full_name = _.escape(dataClean.full_name);
      dataClean.cnib_passport = _.escape(dataClean.cnib_passport);
      dataClean.lieu_cnib = _.escape(dataClean.lieu_cnib);
      dataClean.permis_type = _.escape(dataClean.permis_type);
      dataClean.description = dataClean.description ? _.escape(dataClean.description) : "";
      dataClean.creator_id = this.me.id;
      dataClean.created_at = new Date();
	  console.log(dataClean);

      asyncLib.waterfall(
        [
          // Vérification de l'existence de mail
          (done) => {
            try {
              this.repository.user.getByEmail(dataClean.email).then((user) => {
                done(null, user);
              });
            } catch (error) {
              return this.error({
                status: 500,
                error: "Impossible de vérifier le mail " + error,
              });
            }
          },

          // Vérification de l'existence du nom d'utilisateur
          (userByEmail, done) => {
            if (!userByEmail) {
              try {
                this.repository.user
                  .getByUsername(postData.username)
                  .then((user) => {
                    done(null, user);
                  });
              } catch (error) {
                return this.error({
                  status: 500,
                  error: "Impossible de vérifier le nom d'utilisateur " + error,
                });
              }
            } else {
              return this.error({
                status: 409,
                error: "Le compte mail existe déjà",
              });
            }
          },

          (userByUsername, done) => {
            if (!userByUsername) {
              const salt = userService.generateSalt();
              const hashedPassword = userService.encryptPassword(
                postData.password,
                salt
              );
              done(null, hashedPassword, salt);
            } else {
              return this.error({
                status: 409,
                error: "Le nom d'utilisateur existe déjà",
              });
            }
          },
          (hashedPassword, salt, done) => {
            dataClean.hashed_password = hashedPassword;
            dataClean.salt_password = salt;
            this.repository.user
              .create(dataClean, this.uriGenerator)
              .then((newUser) => {
                done(newUser);
              })
              .catch((err) => {
                return this.error({
                  status: 500,
                  error: "Impossible d'enregistrer le compte utilisateur" + err,
                });
              });
          },
        ],
        (newUser) => {
          if (newUser) {
            return this.ok(newUser);
          } else {
            return this.error({
              status: 500,
              error: "La création du compte utilisateur a echoué",
            });
          }
        }
      );
    } catch (err) {
      return this.error({
        status: 500,
        error: "La création du compte utilisateur a echoué",
      });
    }
  }

  async list() {
    try {
	  let {limit, page } = this.query ;
	  let whereClause = await this.repository.user.getValidValues(this.query)

      const users = await this.repository.user.list(whereClause, this.uriGenerator, page = page, limit = limit);
      if (null == users || undefined == users) {
        this.ok([]);
      } else {
        this.ok(users);
      }
    } catch (err) {
      this.error(err);
    }
  }

  async get() {
    try {
      let { id } = this.params;
      let userResource = await this.repository.user.find(id, this.uriGenerator);
      this.ok(userResource);
    } catch (err) {
      this.noContent();
    }
  }

  async getMe() {
    try {
      let user = this.me;
      let userResource = await this.repository.user.find(
        user.id,
        this.uriGenerator
      );
      this.ok(userResource);
    } catch (err) {
      this.error(err);
    }
  }

  async delete() {
    try {
      const { id } = this.params;
      await this.repository.user.delete(id, this.uriGenerator);
      this.noContent();
    } catch (err) {
      this.error(err);
    }
  }


  async updateFunction(postData, id) {

    try {

	  delete postData.id

      asyncLib.waterfall(
        [
          // Récupération de l'utilisateur
          (done) => {
            try {
              this.repository.user
                .find(id, this.uriGenerator)
                .then(async (userOld) => {
					delete userOld._links ; 

					let postDataChecked = await this.checkPostData(postData)
					if(postDataChecked.length > 0){
						return this.error(postDataChecked)
					}
					var dataClean = await this.repository.user.getValidValues(postData, userOld);

					dataClean.full_name = _.escape(dataClean.full_name);
					dataClean.cnib_passport = _.escape(dataClean.cnib_passport);
					dataClean.lieu_cnib = _.escape(dataClean.lieu_cnib);
					dataClean.permis_type = _.escape(dataClean.permis_type);
					dataClean.description = dataClean.description ? _.escape(dataClean.description) : "";
					dataClean.updater_id = this.me.id;
					dataClean.updated_at = new Date();
					
                  	done(null, dataClean);
                });
            } catch (error) {
              return this.error({
                status: 500,
                error: "Impossible de recupérer l'utilisateur",
              });
            }
          },

          // Vérification de l'existence de mail
          (userOld, done) => {
            try {
              this.repository.user
                .list({ email: userOld.email }, this.uriGenerator)
                .then((results) => {
                  done(null, userOld, results);
                });
            } catch (error) {
              return this.error({status: 500, error: "Impossible de vérifier le mail" });
            }
          },

          // Vérification de l'existence du nom d'utilisateur
          (userOld, users, done) => {
            if (!users.length || users[0].email == userOld.email) {
              try {
                this.repository.user
                  .list({ username: userOld.username }, this.uriGenerator)
                  .then((results) => {
                    done(null, userOld, results);
                  });
              } catch (error) {
                return this.error({ status: 500, error: "Impossible de vérifier le nom d'utilisateur " + error });
              }
            } else {
              return this.error({ status: 409, error: "Le compte mail existe déjà" });
            }
          },
          (userOld, users, done) => {
            if (!users.length || users[0].username == userOld.username) {
              this.repository.user
                .update(userOld, this.uriGenerator)
                .then((userUpdated) => {
                  done(userUpdated);
                })
                .catch((err) => {
                  return this.error({status: 500, error: "Impossible de mettre à jour le compte utilisateur " + err });
                });
            } else {
              return this.error({status: 409, error: "Le nom d'utilisateur existe déjà", });
            }
          },
        ],
        (userUpdated) => {
          if (userUpdated) {
            return this.ok(userUpdated);
          } else {
            return this.error({
              status: 500,
              error: "La mise à jour du compte utilisateur a echoué",
            });
          }
        }
      );
    } catch (err) {
      return this.error({
        status: 500,
        error: "La mise à jour du compte utilisateur a echoué",
      });
    }
  }

  async update() {
    const postData = this.body;
    const { id } = this.params;

    return await this.updateFunction(postData, id) ;

  }

  async updateMe() {
    const postData = this.body;
    const { id } = this.me;

    return await this.updateFunction(postData, id) ;

  }
    

}

module.exports = UsersController;
