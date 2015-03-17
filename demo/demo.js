import {Module} from 'framework';

class Demo extends Module {
  constructor(){
    this.resetSideBars();
  }
  resetSideBars(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }
  get routes(){
    return [
      {
        pattern: ['', 'test'],
        moduleId: 'test',
        title: 'Test',
        nav: true,
      },
      {
        pattern: 'asf',
        moduleId: 'test',
        title: 'Cool',
        nav: true,
      },
      {
        route: 'ui',
        moduleId: 'ui',
        hasChildRoutes: true,
        title: 'UI',
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
        route: 'components',
        moduleId: 'components',
        // hasChildRoutes: true,
        title: 'Components',
        nav: true,
      },
    ];
  }
  activate(){
    this.resetSideBars();
  }
}

export default Demo;
