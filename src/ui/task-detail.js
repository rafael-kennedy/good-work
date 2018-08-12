const blessed = require('blessed');

const editorSettings = {
  inputOnFocus: true,
  shrink: true,
  clickable: true,
  width: 32,
  name: 'text editor',
  style: {
    focus: {
      bg: 'blue',
      fg: 'white'
    },
    hover: {
      bg: 'blue',
      fg: 'white'
    }
  },
  border: {
    type: 'line'
  },
  left: 5
}

function makeRow(task, app, position) {
  const taskEmit = (evt) => () => app.emit(evt, task);
  const depthGap = 2;
  const checkbox = blessed.box({
    left: depthGap,
    width: 3,
    height: 1,
    content: task.done ? '☑' : '☐'
  })
  const text = blessed.box({
    width: 33,
    shrink: true,
    left: depthGap + 4,
    content: task.text
  });
  const addButton = blessed.button({
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
  const closeBox = blessed.button({
    right: 1,
    height: 1,
    width: 1,
    content: 'X',
    style: {
      hover: {
        fg: 'red',
        bg: 'grey'
      }
    }
  })
  const deleteButton = blessed.button({
    right: 1,
    height: 1,
    width: 6,
    top: 1,
    content: 'DELETE',
    style: {
      hover: {
        bg: 'red'
      }
    }
  })
  const row = blessed.box({
    draggable: true,
    left: 50,
    top: 7,
    width: 50,
    border: {
      type: 'line'
    },
    children: [
      checkbox,
      text,
      addButton,
      closeBox,
      deleteButton
    ],
    shrink: true,
    ...position || {}
  })

  text.once('click', () => {
    const editor = blessed.textarea({
      ...editorSettings,
      width: 32
    })
    editor.once('blur', () => {
      task.text = editor.value;
      app.emit('update-task', task);
      app.screen.append(makeRow(task, app, { left: row.aleft, top: row.atop }));
      app.screen.remove(row);
      app.screen.render();
    })
    row.insert(editor);
    editor.setValue(task.text)
    row.remove(text);
    row.height = 12;
    app.screen.render();
  })

  checkbox.once('click', taskEmit('mark-done'));
  closeBox.once('click', () => closeBox.press());
  closeBox.once('press', () => {
    row.destroy();
    app.screen.render();
  });
  deleteButton.once('click', taskEmit('delete-task'))
  addButton.once('click', () => addButton.press());
  addButton.once('press', () => taskEmit('add-subtask'));
  return row;
}

module.exports = async function (app, task) {
  const detailRow = makeRow(task, app);
  app.screen.append(detailRow);
  app.screen.render();
}