const crud = require('./persistence/crud');
const blessed = require('blessed');
const { get, set, flow, flattenDeep } = require('lodash');
const moment = require('moment');

function makeRow(task, app) {
  const depthGap = 2 + ((task.ancestors && task.ancestors.length) || 0);
  const row = blessed.box({ draggable: true })
  const checkbox = blessed.box({
    parent: row,
    left: depthGap,
    width: 3,
    height: 1,
    content: task.done ? '☑' : '☐'
  })
  const splitText = task.text.split('\n');
  const isOneLine = splitText.length === 1 && splitText[0].length < 30;
  const text = blessed.box({
    parent: row,
    width: 33,
    left: depthGap + 4,
    content: `${splitText[0].slice(0, 30)}${isOneLine ? '' : '...'}`
  });
  const addButton = blessed.button({
    parent: row,
    width: 3,
    height: 1,
    content: '[+]',
    left: depthGap + 3 + 1 + 33 + 1,
    style: {
      hover: {
        bg: 'lightblue'
      }
    }
  });
  checkbox.on('click', () => app.emit('mark-done', task));
  text.on('click', () => app.emit('show-detail', task));
  addButton.on('click', () => addButton.press());
  addButton.on('press', () => app.emit('add-subtask', task));
  return row;
}

const organizeTasks = ({ app, tasks }) => {
  const tasksByParent = tasks.reduce((acc, task) => {
    const path = (task.ancestors || []).concat(task._id).join('.children.');
    const existing = get(acc, path);
    set(acc, path, { ...existing, ...task });
    return acc;
  }, {});
  return { app, tasks: tasksByParent }
}

const sortTasks = ({ app, tasks }) => {
  const sortByDate = (a, b) => {
    [a, b].forEach(t => t.dueDate = moment(new Date(t.dueDate)));

    if (a.dueDate._isValid && b.dueDate._isValid) return a.dueDate - b.dueDate;
    if (!a.dueDate._isValid && !b.dueDate._isValid) return 0;
    if (a.dueDate) return 1;
    return -1;
  }
  const recursiveSortAndFlatten = taskObject => {
    const sorted = Object.values(taskObject).sort(sortByDate);
    return sorted.map(task => {
      if (task.children) {
        return [task].concat(recursiveSortAndFlatten(task.children));
      } else {
        return [task]
      }
    })
  }
  tasks = flattenDeep(recursiveSortAndFlatten(tasks));
  return { app, tasks }
}

const makeTaskRows = ({ app, tasks }) => {
  tasks = tasks.map((task) => makeRow(task, app));
  return { app, tasks }
}

const updateTasks = flow(
  organizeTasks,
  sortTasks,
  makeTaskRows
)

module.exports = async function (app) {
  if (app.list) app.list.destroy();
  const { find } = crud(app);
  const allTasks = await find({});
  const { tasks } = updateTasks({ app, tasks: allTasks });

  tasks.forEach((item, idx) => item.top = 1 + idx);
  app.list = blessed.box({
    children: tasks,
  });
  app.mainBox.append(app.list);
  app.screen.render();
}