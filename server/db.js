let instance;

class Db {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance of db.js");
    }

    this.users = {};
    this.credentials = {};
    this.session = {
      challenge: undefined,
      user: undefined,
    };
    instance = this;
  }
}

const db = Object.freeze(new Db());

module.exports = db;
