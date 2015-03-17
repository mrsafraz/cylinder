import {Widget} from 'framework';

class GridHeaderWidget extends Widget  {

  constructor(){
    this.paginator = null;
    this.property = null;
    this.label = null;
    this.propertySortedUp = false;
    this.propertySortedDown = false;
  }
  
  togglePropertySort(){
    for(var gridSorter of this.paginator.gridSorters){
      if(gridSorter !== this){
        gridSorter.propertySortedUp = false;
        gridSorter.propertySortedDown = false;
      }
    }
    if(!this.paginator.options.sort){
//      this.paginator.options.sort = {};
    }
      this.paginator.options.sort = {};
    if(this.propertySortedUp){
      this.propertySortedUp = false;
      this.propertySortedDown = true;
      this.paginator.options.sort[this.property] = -1;
    }
    else {
      this.propertySortedUp = true;
      this.propertySortedDown = false;
      this.paginator.options.sort[this.property] = 1;
    }
    // reset page
    this.paginator.currentPage = 1;
    this.paginator.refresh();
  }

  activate(settings){
    this.paginator = settings.paginator;
    this.property = settings.property;
    this.label = settings.label;
    if(!this.paginator.gridSorters){
      this.paginator.gridSorters = [];
    }
    if(this.paginator.gridSorters.indexOf(this) === -1){
      this.paginator.gridSorters.push(this);
    }
  }

}

export default GridHeaderWidget;