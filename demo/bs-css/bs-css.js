import {Module} from 'framework';

class BootstrapCssModule extends Module {
  
  constructor(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }
  
  get routes(){
    return [
      {
        pattern: ['', 'typography'],
        moduleId: 'typography',
        title: 'Typography',
        nav: true,
      },
      {
        pattern: 'tables',
        moduleId: 'tables',
        title: 'Tables',
        nav: true,
      },
      {
        pattern: 'forms',
        moduleId: 'forms',
        title: 'Forms',
        nav: true,
      },
      {
        pattern: 'buttons',
        nav: true,
      },
      {
        pattern: 'images',
        nav: true,
      },
      {
        pattern: 'helper_classes',
        title: 'Helper classes',
        nav: true,
      },
      {
        pattern: 'responsive_utils',
        title: 'Responsive Utilities',
        nav: true,
      },
    ];
  }
  
  activate(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }

}

export default BootstrapCssModule;