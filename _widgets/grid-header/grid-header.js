import {Widget} from 'framework';

class GridHeaderWidget extends Widget  {

  constructor(){
    super();
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

    var sortDirection;
    if(this.propertySortedUp){
      this.propertySortedUp = false;
      this.propertySortedDown = true;
      sortDirection = -1;
    }
    else {
      this.propertySortedUp = true;
      this.propertySortedDown = false;
      sortDirection = 1;
    }
    var sortProperties = Array.isArray(this.property) ? this.property : [this.property];
    for(var property of sortProperties){
      this.paginator.options.sort[property] = sortDirection;
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