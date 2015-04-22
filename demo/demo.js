import {Module} from 'framework';
import highlight from './vendor/highlight/highlight';
import ko from 'knockout';

var hljs = window.hljs;

ko.bindingHandlers.hljs = {
    update: function(element, valueAccessor) {
      if(typeof hljs !== "undefined"){
        hljs.highlightBlock(element);
      }
    }
};

var hljsInjected = false;

class Demo extends Module {
  constructor(){
    super();
    this.resetSideBars();
  }
  resetSideBars(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }
  get routes(){
    return [
      // {
      //   pattern: ['', 'test'],
      //   moduleId: 'test',
      //   title: 'Test',
      //   nav: true,
      // },
      // {
      //   pattern: 'asf',
      //   moduleId: 'test',
      //   title: 'Cool',
      //   nav: true,
      // },
      // {
      //   route: 'ui',
      //   moduleId: 'ui',
      //   hasChildRoutes: true,
      //   title: 'UI',
      //   nav: true,
      // },
      {
        route: ['', 'dialogs'],
        moduleId: 'dialogs',
        // hasChildRoutes: true,
        title: 'Dialogs & Toast',
        nav: true,
      },
      {
        route: 'widgets',
        moduleId: 'widgets',
        // hasChildRoutes: true,
        title: 'Widgets',
        nav: true,
      },
      {
        route: 'branches',
        moduleId: 'branches',
        hasChildRoutes: true,
        title: 'Grid',
        nav: true,
      },
      {
        route: 'bindings',
        moduleId: 'bindings',
        hasChildRoutes: true,
        title: 'Bindings',
        nav: true,
      },
      {
        route: 'font-awesome',
        moduleId: 'font-awesome',
        // hasChildRoutes: true,
        title: 'Font Awesome',
        nav: true,
      },
      {
        route: 'css',
        moduleId: 'bs-css',
        hasChildRoutes: true,
        title: 'CSS',
        nav: true,
      },
      {
        route: 'components',
        moduleId: 'bs-components',
        hasChildRoutes: true,
        title: 'Components',
        nav: true,
      },
      {
        route: 'elements',
        moduleId: 'components',
        // hasChildRoutes: true,
        title: 'UI Elements',
        nav: true,
      },
      {
        route: 'layout',
        moduleId: 'layout',
        title: 'Layout',
        hasChildRoutes: true,
        nav: true,
      },
      {
        route: 'events',
        moduleId: 'events',
        title: 'Events',
        hasChildRoutes: true,
        nav: true,
      }
    ];
  }

  activate(){
    this.resetSideBars();
  }
}

export default Demo;
