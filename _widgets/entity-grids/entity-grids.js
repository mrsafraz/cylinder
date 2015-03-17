import {Widget} from 'kingdom';

class EntityGridsWidget extends Widget  {

  constructor(){
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
    this.title = '';
    this.$root = {};
  }

  activate(settings){
    this.title = settings.title;
    this.$root = settings.$root;
    this.isLeftSideActive = false;
    this.isRightSideActive = false;    
  }

}

export default EntityGridsWidget;