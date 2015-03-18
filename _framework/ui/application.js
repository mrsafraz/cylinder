import system from 'durandal/system';
import app from 'durandal/app';
import ko from 'knockout';
import $ from 'jquery';
import bootstrap from 'bootstrap';
import durandalPunches from 'durandal.punches';
import breeze from 'breeze';
import koES5 from 'breeze.koES5';
import widget from 'plugins/widget';

import {Config} from '../core/config';
import {ModuleLoader} from '../core/module-loader';
import {RouteBuilder} from './route-builder';
import {Route} from '../core/module-loader';
import {Authenticator} from '../auth/authenticator';
import {Initializer} from '../data/initializer';

import viewLocator from 'durandal/viewLocator';

import dialogPlugin from './plugins/dialog';

var {EntityManager} = breeze;

breeze.config.initializeAdapterInstance('modelLibrary', 'koES5', true);

export class Application {

  constructor(config: Config, authenticator: Authenticator, initializer: Initializer){
    this.config = config;
    this.authenticator = authenticator;
    this.initializer = initializer;
  }

  init(){
      // alert(this.config.enableAuthentication)
    if(this.config.enableAuthentication){
      this.authenticator.enable();
    }
    this.initializer.preload(this.config.preload || ['Preload']);
    this.initializer.ctors(this.config.initializers || {});

    if(this.config.enableModuleIdConvention !== undefined){
      RouteBuilder.enableModuleIdConvention(this.config.enableModuleIdConvention);
    }

    var _systemWidgets = [
      'clamped-text',
      'date-picker',
      'dropdown-picker',
      'navigation-picker',
      'search-input',
      'pagination',
      'grid-header',
      'file-upload',
      'loading-indicator',

      'entity-detail',
      'entity-grid',
    ];

    var systemWidgets = [];
    for(var w of _systemWidgets){
      systemWidgets.push({
        [w]: 'cylinder/_widgets/' + w + '/' + w,
      });
    }

    var widgets = systemWidgets.concat(this.config.widgets || []);

    for(var w of widgets){
      var wConfig = {};
      if(w && typeof w === 'object'){
        var key = Object.keys(w)[0];
        wConfig.id = key;
        wConfig.path = w[key];
      }
      else {
        wConfig.id = w;
        wConfig.path = '_widgets/' + w + '/' + w;
      }
      wConfig.name = wConfig.id.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
      console.log('WCongif', wConfig);
      widget.mapKind(wConfig.name, wConfig.path, wConfig.path);
      widget.registerKind(wConfig.name);
    }

    system.resolveObject = ModuleLoader.load;
    system.setModuleId = ModuleLoader.setModuleId;
    ko.punches.enableAll();
    var oldStart = app.start;
    app.title = this.config.appTitle;
    app.start = function(){
      app.configurePlugins({
          router:true,
          observable: true,
          dialog: true,
          widget: true,
      });
      return new Promise((resolve, reject)=> {
        oldStart().then(function(){
          ko.bindingHandlers.viewPort
            = ko.bindingHandlers.routerViewPort = ko.bindingHandlers.router;
          resolve();
        }, reject);
      });
    };
  }

  run(){
    app.start().then(()=> {
      if(this.config.enableViewConvention){
        viewLocator.useConvention();
      }
      app.setRoot(this.config.shellModuleId || 'shell/shell', this.config.shellTransition || 'entrance');
    });
  }

  static load(rawConfig){
    var config = new Config(rawConfig);
    var providers = rawConfig.providers;
    config.providers = {};
    var filters = config.filters;
    providers.set(Config, function(){
      return config;
    });
    var entityManager = new EntityManager(config.apiUrl);
    providers.set(EntityManager, function(){
      return entityManager;
    });
    if(providers){
      providers.forEach(function(value, key){
        ModuleLoader.registerProvider(key, value);
      });
    }
    if(filters){
      for(var name in filters){
        ko.filters[name] = filters[name];
      }
    }
  }

  static create(rawConfig){
    Application.load(rawConfig);
    var app = ModuleLoader.load(Application);
    app.init();
    return app;
  }
}