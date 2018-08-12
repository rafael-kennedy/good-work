const blessed = require('blessed');
const createTaskBox = require('./create-task-box');

module.exports = function (app) {
  return blessed.listbar({
    left: 'center',
    width: '95%',
    height: 'shrink',
    border: {
      type: 'line'
    },
    autoCommandKeys: true,
    mouse: true,
    commands: {
      'Add Task': {
        callback() {
          createTaskBox(app);
        }
      }
    }
  })
}