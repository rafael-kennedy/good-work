const { fromDataBase, toDataBase } = require('./task.model.js');

module.exports = function createInterface(app) {
  const { db } = app;

  return {
    create(data) {
      data = toDataBase.parse(data);
      return new Promise((resolve, reject) => {
        db.insert(data, (err, data) => {
          err
            ? reject(err)
            : resolve(data)
        })
      })
    },
    find(query) {
      return new Promise((resolve, reject) => {
        db.find(query, (err, data) => {
          err
            ? reject(err)
            : resolve(data)
        })
      })
      // .then(records => records.map(data => toDataBase.parse(data)));
    },
    update(query, update, options = {}) {

      return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, data) => {
          err
            ? reject(err)
            : resolve(data)
        })
      })
    },
    remove(query, options = {}) {
      return new Promise((resolve, reject) => {
        db.remove(query, options, (err, data) => {
          err
            ? reject(err)
            : resolve(data)
        })
      })
    },
  }
}