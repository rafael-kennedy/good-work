const fs = require('fs');
const path = require('path');
const Datastore = require('nedb');

const homedir = require('os').homedir();
const dataDirectory = path.join(homedir, '.good-work');


module.exports = async function (projectName) {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
  }
  const projectFile = path.join(dataDirectory, projectName + '.db');
  const db = new Datastore({ filename: projectFile });
  return new Promise((resolve, reject) => {
    db.loadDatabase((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    })
  })
}