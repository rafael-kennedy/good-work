const initializePersistence = require('./persistence/init');
const initializeUi = require('./ui/init');
const EventEmitter = require('events');

const crud = require('./persistence/crud');
const updateTasks = require('./updateTasks');
const showTaskDetail = require('./ui/task-detail');

module.exports = async function (projectName, command) {

  const db = await initializePersistence(projectName)
    .catch(err => {
      console.error(err);
    })

  const app = Object.assign(new EventEmitter(), {
    projectName,
    db
  })

  const tasksService = crud(app);

  app.on('create-task', async (data) => {
    const created = await tasksService.create({ text: data.text, dueDate: data.due });
    app.emit('update-tasks');
  })
  app.on('update-task', async (task) => {
    const updated = await tasksService.update({ _id: task._id }, task)
    debugger;
    app.emit('update-tasks');
  })
  app.on('update-tasks', () => updateTasks(app));
  app.on('show-detail', (task) => showTaskDetail(app, task));
  app.on('mark-done', async (task) => {
    const updated = await tasksService.update({ _id: task._id }, { $set: { done: !task.done } });
    updateTasks(app);
  })

  initializeUi(app);
  updateTasks(app);

}