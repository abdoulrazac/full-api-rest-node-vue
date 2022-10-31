const crypto = require("crypto");

class UserService {

  static generateSalt(){
    return crypto.randomBytes(32).toString('hex').slice(0, 32)
  }

  static encryptPassword(password, salt) {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
  }

  static checkPassword(hashedPassword, salt, password) {
    return (
      hashedPassword && this.encryptPassword(password, salt) === hashedPassword
    );
  }

  static isEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  static isUsername(username) {
    var USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    return USERNAME_REGEX.test(username);
  }
  
  static isValidPassword(password) {
    var PASSWORD_REGEX = /^[a-zA-Z]\w{6,14}$/;
    return PASSWORD_REGEX.test(password);
  }
}

module.exports = UserService;
