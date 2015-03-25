import {Module} from 'framework';

class BootstrapComponentsModule extends Module {
  
  constructor(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }
  
  get routes(){
    return [
      {
        pattern: ['', 'btn_groups'],
        moduleId: 'btn_groups',
        title: 'Btn Groups',
        nav: true,
      },
      {
        pattern: 'input_groups',
        title: 'Input Groups',
        nav: true,
      },
      {
        pattern: 'navs',
        nav: true,
      },
      {
        pattern: 'navbar',
//        nav: true,
      },
      {
        pattern: 'breadcrumbs',
        // nav: true,
      },
      {
        pattern: 'pagination',
        nav: true,
      },
      {
        pattern: 'labels',
        nav: true,
      },
      {
        pattern: 'badges',
        nav: true,
      },
      {
        pattern: 'thumbnails',
//        nav: true,
      },
      {
        pattern: 'alerts',
        nav: true,
      },
      {
        pattern: 'progress_bars',
        title: 'Progress',
        nav: true,
      },
      {
        pattern: 'media_object',
        title: 'Media',
        nav: true,
      },
      {
        pattern: 'list_groups',
        title: 'List',
        nav: true,
      },
      {
        pattern: 'panels',
        nav: true,
      },
      {
        pattern: 'wells',
        nav: true,
      }
    ];
  }
  
  activate(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }

}

export default BootstrapComponentsModule;