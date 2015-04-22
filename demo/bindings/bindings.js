import {Module} from 'framework';

class BindingModule extends Module {
  
  constructor(){
    super();
  }
  
  get routes(){
    return [
      {
        pattern: ['', 'if'],
        moduleId: 'if',
        title: 'if',
        nav: true,
      },
      {
        pattern: 'repeat',
        title: 'repeat',
        nav: true,
      },
      // {
      //   pattern: 'visible',
      //   moduleId: 'visible',
      //   title: 'visible',
      //   nav: true,
      // },
      {
        pattern: 'css',
        moduleId: 'css',
        title: 'css',
        nav: true,
      },
      // {
      //   pattern: 'style',
      //   title: 'style',
      //   nav: true,
      // },
      // {
      //   pattern: 'attr',
      //   title: 'attr',
      //   nav: true,
      // },
      {
        pattern: 'event',
        title: 'event',
        nav: true,
      },
      // {
      //   pattern: 'value',
      //   title: 'value',
      //   nav: true,
      // },
      // {
      //   pattern: 'checked',
      //   title: 'checked',
      //   nav: true,
      // },
      // {
      //   pattern: 'options',
      //   title: 'options',
      //   nav: true,
      // },
      // {
      //   pattern: 'date',
      //   title: 'date',
      //   nav: true,
      // },
    ];
  }

}

export default BindingModule;