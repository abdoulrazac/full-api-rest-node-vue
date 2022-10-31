const _ = require("lodash");
const Knex = require("knex");
const utils = require("../services/utils.helpers");

class RepositoryBase {
  constructor(db, tableName, pkName) {
    const repositoryName = this.constructor.name
      .replace("Repository", "")
      .toLowerCase();
    const modelClassName = repositoryName + "Model";
    const modelClass = require("../models/" + modelClassName);

    this.model = modelClass;
    this.table = tableName;
    this.tablePrimary = pkName == undefined ? "id" : pkName;
    this.db = db;
  }

  static async getDb() {
    return this.db;
  }

  static async setDb(db) {
    try {
      let isValidDb = await this.checkDb(db);
      if (isValidDb) {
        this.db = db;
      }
    } catch (error) {
      throw new Error(error);
    }
    return this;
  }

  async useDb(dbConfig) {
    try {
      this.db = await Knex(dbConfig);
    } catch (err) {
      throw new Error(error);
    } finally {
      return this.db;
    }
  }

  async checkDb(db) {
    let validDb = false;
    try {
      validDb = await db.raw("select 1+1 as result").catch((err) => {
        if (err) {
          throw new Error(error);
        }
      });
    } catch (e) {
      validDb = false;
    }
    return validDb;
  }

  async getEmptyData(defaultValue) {
    let tableColumns = false;
	let query = ''

	switch (this.db.client.constructor.name) {
		case 'Client_MSSQL':
			query = `SELECT column_name FROM information_schema.columns WHERE table_schema = \'public\' AND table_catalog = ? AND table_name = ?`;
			break;
		case 'Client_MySQL':
		case 'Client_MySQL2':
			query = `SELECT column_name FROM information_schema.columns WHERE table_schema = ?  AND table_name = ?`;
			break;
		case 'Client_Oracle':
		case 'Client_Oracledb':
			query = "SELECT column_name FROM all_tab_cols WHERE owner=? AND table_name=? AND column_name NOT IN ( 'PASSWORD', 'VERSION', 'ID' )";
			break;
		case 'Client_PG':
			query = `SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = ?`;
			break;
	}
    try {
      tableColumns = await this.db.raw(query, [this.table])
        .then(results => {
          let rows = [];
		  results['rows'].map((row) => {
            rows.push(row.column_name);
          });
          return rows;
        })
        .catch((err) => {
          if (err) {
            throw new Error(err);
          }
        });
    } catch (e) {
      tableColumns = false;
    }

	let totalColumns = tableColumns.length;
	var data = {};
	var value = (defaultValue == undefined) ? "" : defaultValue;
	if (totalColumns) {
		tableColumns.forEach((key, idx) => data[key] = value);
	}

	return data;
  }


  async getValidValues(postData, oldData){
    let dataCleaned = {} ;
    if(oldData){
      Object.entries(oldData).forEach((key, idx) => {
        dataCleaned[key[0]] = (_.isUndefined(postData[key[0]]) || postData[key[0]] == '') ? oldData[key[0]] : postData[key[0]];
      });
    } else {
      let emptyData = await this.getEmptyData();
      Object.entries(emptyData).forEach((key, idx) => {
        if(!(_.isUndefined(postData[key[0]]) || _.isNull(postData[key[0]]))){
          dataCleaned[key[0]] = postData[key[0]] ;
        }
      });
    }
    return dataCleaned ;
  }


  /**
   * Loads an entity from the given id
   * @param {int} id The object's id
   * @returns {object} The corresponding entity
   */
  async findRow(id) {
    const db = this.db;
    var model = await new this.model();

    return db(this.table)
      .where(db.raw(this.tablePrimary + " = ?", id))
      .select()
      .then(async (data) => {
        let modelData = data[0];
        modelData["id"] = id;
        return modelData;
      });
  }

  /**
   * Loads an entity from the given id
   * @param {int} id The object's id
   * @returns {object} The corresponding entity
   */
  async find(id, uriGenerator) {
    const db = this.db;
    var model = await new this.model();

    return db(this.table)
      .where(db.raw(this.tablePrimary + " = ?", id))
      .select()
      .then(async (data) => {
        let modelData = data[0];
        model.setData(modelData);
        const resource = await model.getResource(uriGenerator);
        return resource;
      });
  }

  /**
   * Lists the entities
   * @param {object} whereClause Conditions (optionnal)
   * @returns {array} A list of entities
   */
  async list(whereClause = {}, uriGenerator, page = 1, limit = 100) {
    limit = (limit == undefined || limit <= 0) ? 100:limit ;
    page  = (page == undefined || page <= 0) ? 1 : page ;

    var model = await new this.model();
    var results = await this.db(this.table)
      .select()
      .where(whereClause)
      .offset((page-1) * limit)
      .limit(limit)
      .then(async (results) => {
        let resources = await Promise.all(
          results.map(async (data, index) => {
            data["id"] = data[this.tablePrimary];
            model.setData(data);
            const resource = await model.getResource(uriGenerator);
            return resource;
          })
        ); 
        return resources;
      });
    return results;
  }

  /**
   * Persists a new entity in database
   * @param {object} object The entity to persist
   * @returns {object} An entity, with a database generated id
   */
  async create(object, uriGenerator) {
    return this.db(this.table) //.returning(this.tablePrimary)
      .insert(object)
      .returning('id')
      .then(async (id) => {
        return await this.find(id, uriGenerator);
      });
  }

  /**
   * Updates an enitity in database
   * @param {object} object The entity to persist in database
   * @returns {boolean} True if the operation was a success
   */
  async update(object, uriGenerator) {
    let id = object[this.tablePrimary] || object["id"];
    if (object["id"]) {
      delete object["id"];
    }
    return this.db(this.table)
      .where(this.db.raw(this.tablePrimary + " = ?", id))
      .update(object)
      .returning('id')
      .then(async (id) => {
        return await this.find(id, uriGenerator);
      });
  }

  /**
   * Deletes an entity from database
   * @param {number} id The entity's id
   * @returns {boolean} True if the operation was a success
   */
  async delete(id) {
    return this.db(this.table)
      .where(db.raw(this.tablePrimary + " = ?", id))
      .del()
      .then(() => true);
  }
}

module.exports = RepositoryBase;
