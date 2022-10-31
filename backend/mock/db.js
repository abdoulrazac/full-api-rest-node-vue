const Knex   = require('knex') ;
const config = require('config')

// async function connection(dbConfig){
//   try {
//     let db = Knex(dbConfig)
//     let users = await db("users")
//                     .select()
//                     .then(rows => rows)
//     console.log("Connection Done");
//     console.log(users);
//   } catch (error) {
//     console.log("Connection Failed");
//   }
// };

// connection(config.get('db'));

// console.log();

try {
  var db = Knex(config.get('db')) ;
  console.log("DB connection is done");
} catch (error) {
  console.log("DB connection is failed");
}
module.exports = db ;

// const books = require('./books');
// const users = require('./users');

// module.exports = {
//   books,
//   users,
// };
