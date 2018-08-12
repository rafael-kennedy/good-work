const blessed = require('blessed');


module.exports = function (app) {
  const textbox = blessed.textarea({
    inputOnFocus: true,
    shrink: true,
    clickable: true,
    title: 'text of task',
    width: '100%-17',
    name: 'text',
    height: 9,
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
    left: 14,
    mouse: true
  });

  const dueDateBox = blessed.textarea({
    inputOnFocus: true,
    shrink: true,
    clickable: true,
    title: 'Due Date:',
    width: '100%-17',
    name: 'due',
    height: 3,
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
    left: 14,
    top: 10,
    mouse: true
  })

  const submitButton = blessed.button({
    content: ' Submit ',
    shrink: true,
    left: '50%+1',
    bottom: 0,
    border: 'line',
    style: {
      hover: {
        fg: 'white',
        bg: 'green'
      }
    }
  })

  const cancelButton = blessed.button({
    content: ' Cancel ',
    shrink: true,
    left: '50%-9',
    bottom: 0,
    border: 'line',
    style: {
      hover: {
        fg: 'white',
        bg: 'darkred'
      }
    }
  })

  cancelButton.on('press', () => {
    form.cancel();
  })
  cancelButton.on('click', () => {
    form.cancel();
  })

  submitButton.on('press', () => {
    form.submit();
  })
  submitButton.on('click', () => {
    form.submit();
  })

  const form = blessed.form({
    label: 'create task',
    draggable: true,
    left: 'center',
    width: '60%',
    height: 18,
    keys: true,
    border: {
      type: 'line'
    },
    children: [
      blessed.box({ content: 'Text of Task:', top: 1 }),
      blessed.box({ content: 'Due Date:', top: 11 }),
      textbox,
      dueDateBox,
      cancelButton,
      submitButton,
    ]
  })
  // form.addLine('To Do Text:')
  // form.append(textbox)
  // form.append(submitButton)

  form.on('submit', (data) => {
    app.emit('create-task', data);
    form.destroy(form);
    app.screen.render();
  })

  form.on('cancel', (data) => {
    form.destroy(form);
    app.screen.render();
  })

  app.screen.append(form)

  return form;
}