#!/usr/bin/env node
const program = require('commander');

const main = require('./src/index');

const { version } = require('./package.json');


program
  .version('0.1.0')

program
  .command('open <project>')
  .description('Opens a to-do list project')
  .action((project, cmd) => {
    console.log('Opening: ' + project);
    main(project, cmd);
  })

program.parse(process.argv);
