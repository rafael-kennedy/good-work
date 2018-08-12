const crud = require('./persistence/crud');
const updateTasks = require('./updateTasks');
const showTaskDetail = require('./ui/task-detail');
const createTaskBox = require('./ui/create-task-box');

module.exports = function (app) {
  const tasksService = crud(app);
  const listeners = {
    'create-task': async (data, parentTask) => {
      const ancestors = parentTask
        ? (parentTask.ancestors || []).concat(parentTask._id)
        : [];
      await tasksService.create({ text: data.text, dueDate: data.due, ancestors });
      app.emit('update-tasks');
    },
    'update-task': async (task) => {
      await tasksService.update({ _id: task._id }, task)
      app.emit('update-tasks');
    },
    'delete-task': async (task) => {
      await tasksService.remove({ _id: task._id });
      updateTasks(app);
    },
    'add-subtask': async (task) => {
      createTaskBox(app, task);
    },
    'update-tasks': () => updateTasks(app),
    'show-detail': (task) => showTaskDetail(app, task),
    'mark-done': async (task) => {
      await tasksService.update({ _id: task._id }, { $set: { done: !task.done } });
      updateTasks(app);
    }
  }
  Object.entries(listeners).forEach(([evt, handler]) => {
    app.on(evt, handler);
  })
}