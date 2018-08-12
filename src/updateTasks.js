const crud = require('./persistence/crud');
const blessed = require('blessed');


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

module.exports = async function (app) {
  if (app.list) app.list.destroy();
  const { find } = crud(app);
  const allTasks = await find({});
  const items = allTasks.map((task) => makeRow(task, app));
  items.forEach((item, idx) => item.top = 1 + idx);
  app.list = blessed.box({
    children: items,
  });
  app.mainBox.append(app.list);
  app.screen.render();
}