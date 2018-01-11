'use strict';

const npmMgr = require('./src/npm');
const pluginMgr = require('./src/plugin');

module.exports = {
  configureNpm,
  install,
  uninstall
};

function configureNpm(appFolderName, location, npmEnv) {
  return npmMgr.configureNpm(appFolderName || '.my-plugin-app', location, npmEnv);
}

function install(pluginPath, npmConfig) {
  return pluginMgr.install(pluginPath, npmConfig);
}

function uninstall(pluginPath, npmConfig) {
  return pluginMgr.uninstall(pluginPath, npmConfig);
}
