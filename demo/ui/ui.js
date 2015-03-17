import {Module} from 'framework';

class Ui extends Module {
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
        pattern: 'bindings',
        hasChildRoutes: true,
        nav: true,
      },
      {
        pattern: 'font-awesome',
        hasChildRoutes: true,
        title: 'Font Awesome',
        nav: true,
      },
      {
        pattern: 'extra',
        nav: true,
      },
      {
        pattern: 'dialogs',
        moduleId: 'dialogs',
        title: 'Dialogs',
        nav: true,
      },
      {
        pattern: ['components'],
        moduleId: 'components',
        hasChildRoutes: true,
        title: 'Components',
        nav: true,
      },
      {
        pattern: ['', 'css'],
        moduleId: 'css',
        hasChildRoutes: true,
        title: 'CSS',
        nav: true,
      },
    ];
  }
  activate(){
    this.resetSideBars();
  }
}

export default Ui;