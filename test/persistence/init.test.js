const subject = require('../../src/persistence/init');
const os = require('os');
const path = require('path');
const fs = require('fs');

const DataStore = require('nedb');

const homedir = require('os').homedir();
const dataDirectory = path.join(homedir, '.good-work');

describe('initialize persistence', () => {
  describe('new projects', () => {
    let project;
    const projectName = `test-${Date.now()}`
    beforeAll(async () => {
      project = await subject(projectName);
    });
    test('should create ~/.good-work', () => {
      const testVal = fs.existsSync(dataDirectory);
      expect(testVal).toBeTruthy();
    });

    test('should create project directory', () => {
      const testVal = fs.existsSync(path.join(dataDirectory, projectName));
      expect(testVal).toBeTruthy();
    });

    test('should always return an nedb instance', () => {
      expect(project).toBeInstanceOf(DataStore);
    });
  });
});