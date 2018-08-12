const blessed = require('blessed');

const createTaskBox = require('./create-task-box');
const mainBar = require('./main-bar');

module.exports = function (app) {
  // Create a screen object.
  app.screen = blessed.screen({
    smartCSR: true
  });

  app.screen.title = app.projectName;

  // Create a box perfectly centered horizontally and vertically.
  const box = blessed.box({
    top: 4,
    left: 'center',
    width: '95%',
    tags: true,
    height: '100%-6',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'none',
      border: {
        fg: '#f0f0f0'
      }
    }
  });

  app.mainBox = box;
  const bar = mainBar(app);

  // Append our box to the screen.
  app.screen.append(bar);
  app.screen.append(box);

  // If our box is clicked, change the content.
  box.on('click', function (data) {
    box.setContent('something \n else');
    app.screen.render();
  });

  // Quit on Escape, q, or Control-C.
  app.screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  // Focus our element.
  box.focus();

  // Render the screen.
  app.screen.render();
}