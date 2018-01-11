'use strict';

const path = require('path');
const fs = require('fs');

const spawnPromise = require('./util');

const fsCopy = require('./fs-copy');

module.exports = {
  install,
  uninstall,
  download,
};

function install(pluginPath, npmConfig) {
  try {
    pluginPath = path.join(process.cwd(), pluginPath);
    fs.lstatSync(pluginPath);
  } catch (err) {
    throw new Error(`${pluginPath} PATH not found`);
  }

  console.log(pluginPath);
  console.log(npmConfig.npmEnv.APP_HOME);
  console.log(npmConfig.npmEnv.APP_PLUGINS_HOME);

  try {
    console.log(`Copying plugin from ${pluginPath} to ${npmConfig.npmEnv.APP_PLUGINS_HOME}`)
    fsCopy.copyFolderRecursiveSync(pluginPath, npmConfig.npmEnv.APP_PLUGINS_HOME);
  } catch (err) {
    throw new Error(`${pluginPath} package could not be copied.`);
  }
  pluginPath = path.join(npmConfig.npmEnv.APP_PLUGINS_HOME, pluginPath.split(path.sep).slice(-1)[0]);

  const options = {
    cwd: pluginPath,
    env: npmConfig.npmEnv
  };

  // Installing with npm as the installation with apm did not work.
  // TODO: Consider installation with apm executable.
  console.log('Installing plugin with npm in ' + pluginPath)
  const isWin = /^win/.test(process.platform);
  return spawnPromise(isWin ? npmConfig.npmExec + '.cmd': npmConfig.npmExec, ['install'], options)
    .then(() => {
      console.log('pluginPath', pluginPath);
      return { pluginPath, config: npmConfig };
    })
    .catch(err => { console.error('Plugin installation error:', err.stack); });
}

function uninstall(pluginPath, npmConfig) {
  const options = {
    env: npmConfig.npmEnv
  };
  const pluginPath = path.join(process.cwd(), pluginPath);
  const isWin = /^win/.test(process.platform);
  return spawnPromise(isWin ? npmConfig.npmExec + '.cmd': npmConfig.npmExec, ['uninstall', pluginPath], options)
    .then(() => ({ pluginPath, config: npmConfig }))
    .catch(err => {
      console.error('Plugin uninstallation error:', err);
    });
}

function download(repo) {
  console.log(repo);
  throw Error('Not implemented.');
}
