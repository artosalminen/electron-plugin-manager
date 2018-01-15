'use strict';

const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');

module.exports = {
  configureNpm
};

function configureNpm(appFolderName, location, npmEnv) {
  const isWin32 = /^win32/.test(process.platform);
  const isWin = /^win/.test(process.platform);

  const npmExec = location || path.join(appRoot.path, 'node_modules', '.bin', 'npm');

  if (typeof npmEnv === 'undefined') {
    npmEnv = JSON.parse(JSON.stringify(process.env));
    const userHomeDirectory = isWin32 ? process.env.USERPROFILE : process.env.HOME;
    npmEnv.APP_HOME = path.join(userHomeDirectory, appFolderName);
    npmEnv.APP_PLUGINS_HOME = path.join(npmEnv.APP_HOME, 'plugins');
    npmEnv.npmExec = npmExec;
  }

  if ( !fs.existsSync( npmEnv.APP_HOME ) ) {
    fs.mkdirSync( npmEnv.APP_HOME );
  }
  if ( !fs.existsSync( npmEnv.APP_PLUGINS_HOME ) ) {
    fs.mkdirSync( npmEnv.APP_PLUGINS_HOME );
  }

  // Check if npm already exists
  const returnValue = { npmExec, npmEnv, isWin, isWin32 };
  if(fs.existsSync(npmExec)) {
    return Promise.resolve((returnValue));
  }
  throw new Error(`Npm not found from ${npmExec}. Try to install packages with 'npm install'.`);
}
