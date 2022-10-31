const RepositoryBase = require("./repositoryBase");

class UserRepository extends RepositoryBase {
  constructor(db) {
    super(db, "users", "id");
    // this.usersCollection = db.users;
  }

  async getByUsername(username) {
    const db = this.db;

    return await db(this.table)
      .select()
      .where({ username: username })
      .then(async (data) => {
        return data[0];
      });
  }

  async getByEmail(email) {
    const db = this.db;

    return await db(this.table)
      .where({ email: email })
      .select()
      .then(async (data) => {
        return data[0];
      });
  }
}

module.exports = UserRepository;
