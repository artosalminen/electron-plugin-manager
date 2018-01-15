// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

'use strict';

const path = require('path');
const pluginManager = require('electron-npm-plugin-manager');

const pluginsPrefix = './plugins/';
let installedPlugins = [];

var App = (function () {

  function App() {
  }

  App.installPlugin = function(pluginName) {
    if(!pluginName) {
      throw Error('Plugin name is missing!');
    }
    this.logProcess(`Start installation of plugin: ${pluginName}`);
    return pluginManager.configureNpm()
      .then(config => pluginManager.install((pluginsPrefix + pluginName), config))
      .then(plugin => {
        const config = plugin.config;
        const pluginPath = plugin.pluginPath;

        const plugInfo = require(path.join(pluginPath, 'package.json'));
        const plug = require(path.join(pluginPath, plugInfo.main));

        plug.activate();
        this.logProcess(`Plugin activated: ${pluginPath}`);

        plug.name = pluginName;
        installedPlugins.push(plug);

        return {pluginName, config};
      })
      .catch(err => { setTimeout(() => { throw err; }); });
  };

  App.deactivatePlugin = function(pluginName) {
    const index = installedPlugins.findIndex(i => i.name === pluginName);
    if(index >= 0) {
      installedPlugins[index].deactivate();
      installedPlugins.splice(index, 1);
    }
    return Promise.resolve(this.getPluginsCount());
  };

  App.processText = function(text) {
    this.logProcess(`Input:  "${text}"`);
    installedPlugins.forEach(element => {
      text = element.convert(text);
    });
    this.logProcess(`Output: "${text}"`);
    return text;
  };

  App.getPluginsCount = function() {
    return installedPlugins.length;
  }

  App.logProcess = function(text) {
    console.log(text);
    const element = document.getElementById("progress");
    element.innerHTML += `[${(new Date).toLocaleTimeString()}] ${text}\r\n`;
    element.scrollTop = element.scrollHeight;
  }
  return App;
}());
exports["default"] = App;
