import {Module} from 'framework';
import {DataProvider} from './data-provider';

class Branches extends Module {
  constructor(dataProvider: DataProvider){
    super();
    this.dataProvider = dataProvider;
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }

  get routes(){
    return this.dataProvider.getRoutes();
  }

  activate(entityType){
    this.dataProvider.selectEntityType(entityType);
    this.isLeftSideActive = false;
    this.isRightSideActive = false;
  }
}

export default Branches;