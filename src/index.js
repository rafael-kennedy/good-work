const EventEmitter = require('events');

const initializePersistence = require('./persistence/init');
const initializeUi = require('./ui/init');
const updateTasks = require('./updateTasks');
const registerListeners = require('./register-listeners');

module.exports = async function (projectName, command) {

  const db = await initializePersistence(projectName)
    .catch(err => {
      console.error(err);
    })

  const app = Object.assign(new EventEmitter(), {
    projectName,
    db
  })

  registerListeners(app)
  initializeUi(app);
  updateTasks(app);
}